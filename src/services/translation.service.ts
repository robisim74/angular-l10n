import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/merge';

import { LocaleService } from './locale.service';
import { IntlAPI } from './intl-api';
import { ITranslationConfig, TranslationConfig } from '../models/translation/translation-config';
import { ITranslationConfigAPI, TranslationConfigAPI } from '../models/translation/translation-config-api';
import { TranslationProvider } from './translation-provider';
import { TranslationHandler } from './translation-handler';
import { LoadingMode, ServiceState } from '../models/types';

/**
 * Manages the translation data.
 */
export interface ITranslationService {

    translationChanged: EventEmitter<string>;
    translationError: EventEmitter<any>;

    /**
     * Configure the service in the application root module or in a feature module with lazy loading.
     */
    addConfiguration(): ITranslationConfigAPI;

    getConfiguration(): ITranslationConfig;

    /**
     * Call this method after the configuration to initialize the service.
     */
    init(): void;

    /**
     * Gets the current language of the service.
     */
    getLanguage(): string;

    /**
     * Translates a key or an array of keys.
     * @param keys The key or an array of keys to be translated
     * @param args Optional parameters contained in the key
     * @param lang The current language of the service is used by default
     * @return The translated value or an object: {key: value}
     */
    translate(keys: string | string[], args?: any, lang?: string): string | any;

    translateAsync(keys: string | string[], args?: any, lang?: string): Observable<string | any>;

}

@Injectable() export class TranslationService implements ITranslationService {

    @Output() public translationChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public translationError: EventEmitter<any> = new EventEmitter<any>(true);

    private serviceState: ServiceState;

    private loadingMode: LoadingMode;

    private language: string;

    /**
     * The translation data: {language: {key: value}}.
     */
    private translationData: any = {};

    constructor(
        private locale: LocaleService,
        private configuration: TranslationConfig,
        private translationProvider: TranslationProvider,
        private translationHandler: TranslationHandler
    ) {
        this.serviceState = ServiceState.isWaiting;
    }

    public addConfiguration(): ITranslationConfigAPI {
        return new TranslationConfigAPI(this.configuration);
    }

    public getConfiguration(): ITranslationConfig {
        return this.configuration;
    }

    public async init(): Promise<void> {
        // Waiting for LocaleService initialization.
        await this.locale.init();

        if (this.configuration.providers.length > 0) {
            this.loadingMode = LoadingMode.Async;
        } else {
            this.loadingMode = LoadingMode.Direct;
        }

        // When the language changes, loads translation data.
        this.locale.loadTranslation.subscribe(
            () => { this.loadTranslation(); }
        );

        await this.loadTranslation();
    }

    public getLanguage(): string {
        return this.language;
    }

    public translate(keys: string | string[], args: any = null, lang: string = this.language): string | any {
        // If the service is not ready, returns the keys.
        if (this.serviceState != ServiceState.isReady) return keys;

        if (typeof keys === "string") return this.translateKey(keys, args, lang);

        const data: any = {};
        for (const key of keys) {
            data[key] = this.translateKey(key, args, lang);
        }
        return data;
    }

    public translateAsync(
        keys: string | string[],
        args?: any,
        lang: string = this.language
    ): Observable<string | any> {
        return Observable.create((observer: Observer<string | any>) => {
            const values: string | any = this.translate(keys, args, lang);
            observer.next(values);
            observer.complete();
        });
    }

    private translateKey(key: string, args: any, lang: string): string {
        if (key == null || key == "") { return ""; }
        // I18n plural.
        if (this.configuration.i18nPlural && /^\d+\b/.exec(key)) {
            return this.translateI18nPlural(key, args, lang);
        }
        return this.getValue(key, args, lang);
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
        return this.translationHandler.parseValue(path, key, value, args, lang);
    }

    private translateI18nPlural(key: string, args: any, lang: string): string {
        let keyText: string = key.replace(/^\d+\b/, "");
        keyText = keyText.trim();

        const keyNumber: number = parseFloat(key);
        key = key.replace(/^\d+/, this.translateNumber(keyNumber));

        return key.replace(keyText, this.getValue(keyText, args, lang));
    }

    private translateNumber(keyNumber: number): string {
        if (!isNaN(keyNumber) && IntlAPI.hasNumberFormat()) {
            const localeNumber: string = new Intl.NumberFormat(this.language).format(keyNumber);
            return localeNumber;
        }
        return keyNumber.toString();
    }

    private async loadTranslation(): Promise<void> {
        const language: string = !this.configuration.localeAsLanguage
            ? this.locale.getCurrentLanguage()
            : this.locale.getCurrentLocale();

        if (language != null && language != this.language) {
            if (this.loadingMode == LoadingMode.Async) {
                await this.getTranslation(language).toPromise();
            } else {
                this.translationData = {};
                this.translationData[language] = this.configuration.translationData[language];
                this.releaseTranslation(language);
            }
        }
    }

    private getTranslation(language: string): Observable<any> {

        return Observable.create((observer: Observer<any>) => {
            this.translationData = {};
            this.serviceState = ServiceState.isLoading;

            const sequencesOfTranslationData: Array<Observable<any>> = [];

            for (const provider of this.configuration.providers) {
                sequencesOfTranslationData.push(
                    this.translationProvider.getTranslation(language, provider.args)
                );
            }

            // Merges all the sequences into a single observable sequence.
            Observable.merge(...sequencesOfTranslationData).subscribe(
                (data: any) => {
                    this.addData(data, language);
                },
                (error: any) => {
                    // Sends an event for custom actions.
                    this.translationError.emit(error);
                    this.releaseTranslation(language);
                    observer.next(null);
                    observer.complete();
                },
                () => {
                    this.releaseTranslation(language);
                    observer.next(null);
                    observer.complete();
                }
            );
        });
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
