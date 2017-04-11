import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';

import { LocaleService } from './locale.service';
import { IntlAPI } from './intl-api';
import { TranslationConfig } from '../models/translation/translation-config';
import { Config } from '../models/translation/config';
import { LoadingMode } from '../models/translation/loading-mode';
import { ServiceState } from '../models/translation/service-state';

/**
 * Manages the translation data.
 */
@Injectable() export class TranslationService {

    @Output() public translationChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public translationError: EventEmitter<any> = new EventEmitter<any>(true);

    public get configuration(): Config {
        return this._configuration;
    }

    public serviceState: ServiceState;

    private loadingMode: LoadingMode;

    private _configuration: Config = new Config();

    private language: string;

    /**
     * The translation data: {language: {key: value}}.
     */
    private translationData: any = {};

    constructor(public locale: LocaleService, private http: Http) {
        this.serviceState = ServiceState.isWaiting;

        // When the language changes, loads translation data.
        this.locale.loadTranslation.subscribe(
            () => { this.loadTranslation(); }
        );
    }

    /**
     * Configure the service in the application root module or bootstrap component.
     */
    public addConfiguration(): TranslationConfig {
        return new TranslationConfig(this);
    }

    /**
     * Call this method after the configuration to initialize the service.
     */
    public init(): void {
        if (this.configuration.providers.length > 0) {
            this.loadingMode = LoadingMode.Async;
        } else {
            this.loadingMode = LoadingMode.Direct;
        }
        this.loadTranslation();
    }

    /**
     * The language of the translation service is updated when the translation data has been loaded.
     */
    public getLanguage(): string {
        return this.language;
    }

    public translate(key: string, args: any = null, lang: string = this.language): string {
        if (key == null || key == "") { return ""; }
        // I18n plural.
        if (this.configuration.i18nPlural && /^\d+\b/.exec(key)) {
            return this.translateI18nPlural(key, args, lang);
        }
        return this.getValue(key, args, lang);
    }

    public translateAsync(key: string, args?: any, lang: string = this.language): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            let value: string = this.translate(key, args, lang);
            observer.next(value);
            observer.complete();
        });
    }

    private translateI18nPlural(key: string, args: any, lang: string): string {
        let keyText: string = key.replace(/^\d+\b/, "");
        keyText = keyText.trim();

        let keyNumber: number = parseFloat(key);
        key = key.replace(/^\d+/, this.translateNumber(keyNumber));

        return key.replace(keyText, this.getValue(keyText, args, lang));
    }

    private getValue(key: string, args: any, lang: string): string {
        let value: string;
        if (this.translationData[lang]) {
            let translation: any = this.translationData[lang];

            // Composed key.
            let keys: string[] = key.split(this.configuration.keySeparator);
            do {
                key = keys.shift();
                if (translation[key] && typeof translation[key] === "object") {
                    translation = translation[key];
                }
            } while (keys.length > 0);

            value = translation[key];
        }
        return this.parseValue(key, value, args, lang);
    }

    private translateNumber(keyNumber: number): string {
        if (!isNaN(keyNumber) && IntlAPI.HasNumberFormat()) {
            let localeNumber: string = new Intl.NumberFormat(this.language).format(keyNumber);
            return localeNumber;
        }
        return keyNumber.toString();
    }

    private parseValue(key: string, value: string, args: any, lang: string): string {
        if (value == null) {
            return this.handleMissingValue(key, args, lang);
        } else if (args) {
            return this.handleArgs(value, args);
        }
        return value;
    }

    private handleMissingValue(key: string, args: any, lang: string): string {
        if (this.configuration.missingKey != null) {
            return this.translate(this.configuration.missingKey, args, lang);
        } else if (this.configuration.missingValue != null) {
            return this.configuration.missingValue;
        }
        // The same key is returned.
        return key;
    }

    private handleArgs(value: string, args: any): string {
        const TEMPLATE_REGEXP: RegExp = /{{\s?([^{}\s]*)\s?}}/g;
        return value.replace(TEMPLATE_REGEXP, (substring: string, parsedKey: string) => {
            let replacer: string = <string>args[parsedKey];
            return typeof replacer !== "undefined" ? replacer : substring;
        });
    }

    private loadTranslation(): void {
        let language: string = !this.configuration.localeAsLanguage
            ? this.locale.getCurrentLanguage()
            : this.locale.getCurrentLanguage()
            + "-"
            + this.locale.getCurrentCountry();

        if (language != null && language != this.language) {
            if (this.loadingMode == LoadingMode.Async) {
                this.getTranslation(language);
            } else {
                this.translationData = {};
                this.translationData[language] = this.configuration.translationData[language];
                this.releaseTranslation(language);
            }
        }
    }

    private getTranslation(language: string): void {
        this.translationData = {};
        this.serviceState = ServiceState.isLoading;

        let observableSequencesOfTranslationData: Array<Observable<any>> = [];

        for (let provider of this.configuration.providers) {
            let url: string = provider.path;
            if (provider.webAPI) {
                url += language;
            } else {
                url += language + "." + provider.dataFormat;
            }
            observableSequencesOfTranslationData.push(this.getTranslationByProvider(url));
        }

        // Merges all the observable sequences into a single observable sequence.
        Observable.merge(...observableSequencesOfTranslationData).subscribe(
            (data: any) => {
                this.addData(data, language);
            },
            (error: any) => {
                // Sends an event for custom actions.
                this.translationError.emit(error);
                this.releaseTranslation(language);
            },
            () => {
                this.releaseTranslation(language);
            }
        );
    }

    private getTranslationByProvider(url: string): Observable<any> {
        return this.http.get(url)
            .map((res: Response) => res.json());
    }

    private addData(data: any, language: string): void {
        this.translationData[language] = typeof this.translationData[language] !== "undefined"
            ? { ...this.translationData[language], ...data } // Object spread.
            : data;
    }

    private releaseTranslation(language: string): void {
        this.serviceState = ServiceState.isReady;
        this.language = language;
        // Sends an event for the components.
        this.translationChanged.emit(language);
    }

}
