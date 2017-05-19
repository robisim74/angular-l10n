import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';

import { LocaleService } from './locale.service';
import { IntlAPI } from './intl-api';
import { ITranslationConfig, TranslationConfig } from '../models/translation/translation-config';
import { ITranslationConfigAPI, TranslationConfigAPI } from '../models/translation/translation-config-api';
import { TranslationProvider } from './translation-provider';
import { LoadingMode, ServiceState } from '../models/types';

/**
 * Manages the translation data.
 */
export interface ITranslationService {

    translationChanged: EventEmitter<string>;
    translationError: EventEmitter<any>;

    serviceState: ServiceState;

    /**
     * Configure the service in the application root module or bootstrap component.
     */
    addConfiguration(): ITranslationConfigAPI;
    getConfiguration(): ITranslationConfig;

    /**
     * Call this method after the configuration to initialize the service.
     */
    init(): void;

    /**
     * The language of the translation service is updated when the translation data has been loaded.
     */
    getLanguage(): string;

    translate(key: string, args?: any, lang?: string): string;

    translateAsync(key: string, args?: any, lang?: string): Observable<string>;

}

@Injectable() export class TranslationService implements ITranslationService {

    @Output() public translationChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public translationError: EventEmitter<any> = new EventEmitter<any>(true);

    public serviceState: ServiceState;

    private loadingMode: LoadingMode;

    private language: string;

    /**
     * The translation data: {language: {key: value}}.
     */
    private translationData: any = {};

    constructor(
        public locale: LocaleService,
        private configuration: TranslationConfig,
        private translationProvider: TranslationProvider
    ) {
        this.serviceState = ServiceState.isWaiting;

        // When the language changes, loads translation data.
        this.locale.loadTranslation.subscribe(
            () => { this.loadTranslation(); }
        );
    }

    public addConfiguration(): ITranslationConfigAPI {
        return new TranslationConfigAPI(this.configuration);
    }

    public getConfiguration(): ITranslationConfig {
        return this.configuration;
    }

    public init(): void {
        if (this.configuration.providers.length > 0) {
            this.loadingMode = LoadingMode.Async;
        } else {
            this.loadingMode = LoadingMode.Direct;
        }
        this.loadTranslation();
    }

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
            const value: string = this.translate(key, args, lang);
            observer.next(value);
            observer.complete();
        });
    }

    private translateI18nPlural(key: string, args: any, lang: string): string {
        let keyText: string = key.replace(/^\d+\b/, "");
        keyText = keyText.trim();

        const keyNumber: number = parseFloat(key);
        key = key.replace(/^\d+/, this.translateNumber(keyNumber));

        return key.replace(keyText, this.getValue(keyText, args, lang));
    }

    private getValue(key: string, args: any, lang: string): string {
        const path: string = key;
        let value: string | null = null;
        if (this.translationData[lang]) {
            let translation: any = this.translationData[lang];

            // Composed key.
            const keys: string[] = key.split(this.configuration.keySeparator);
            do {
                key = keys.shift()!;
                if (translation[key] && typeof translation[key] === "object") {
                    translation = translation[key];
                }
            } while (keys.length > 0);

            value = translation[key];
        }
        return this.parseValue(path, key, value, args, lang);
    }

    private translateNumber(keyNumber: number): string {
        if (!isNaN(keyNumber) && IntlAPI.hasNumberFormat()) {
            const localeNumber: string = new Intl.NumberFormat(this.language).format(keyNumber);
            return localeNumber;
        }
        return keyNumber.toString();
    }

    private parseValue(path: string, key: string, value: string | null, args: any, lang: string): string {
        if (value == null) {
            return this.handleMissingValue(path, args, lang);
        } else if (args) {
            return this.handleArgs(value, args);
        }
        return value;
    }

    private handleMissingValue(path: string, args: any, lang: string): string {
        if (this.configuration.missingKey != null) {
            return this.translate(this.configuration.missingKey, args, lang);
        } else if (this.configuration.missingValue != null) {
            return this.configuration.missingValue;
        }
        // The same path is returned.
        return path;
    }

    private handleArgs(value: string, args: any): string {
        const TEMPLATE_REGEXP: RegExp = /{{\s?([^{}\s]*)\s?}}/g;
        return value.replace(TEMPLATE_REGEXP, (substring: string, parsedKey: string) => {
            const replacer: string = args[parsedKey] as string;
            return typeof replacer !== "undefined" ? replacer : substring;
        });
    }

    private loadTranslation(): void {
        const language: string = !this.configuration.localeAsLanguage
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

        const observableSequencesOfTranslationData: Array<Observable<any>> = [];

        for (const provider of this.configuration.providers) {
            observableSequencesOfTranslationData.push(
                this.translationProvider.getTranslation(language, provider.args)
            );
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

    private addData(data: any, language: string): void {
        this.translationData[language] = typeof this.translationData[language] !== "undefined"
            ? { ...this.translationData[language], ...data } // Object spread.
            : data;
    }

    private releaseTranslation(language: string): void {
        this.serviceState = ServiceState.isReady;
        this.language = language;
        this.sendEvents();
    }

    private sendEvents(): void {
        // Sends an event for the components.
        this.translationChanged.emit(this.language);
    }

}
