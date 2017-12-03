import { Injectable, Inject } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { merge } from 'rxjs/observable/merge';
import { concat } from 'rxjs/observable/concat';

import { TRANSLATION_CONFIG, TranslationConfig } from '../models/l10n-config';
import { LocaleService } from './locale.service';
import { TranslationProvider } from './translation-provider';
import { TranslationHandler } from './translation-handler';
import { IntlAPI } from './intl-api';
import { LoadingMode, ServiceState, ProviderType, ISOCode } from '../models/types';
import {mergeDeep} from "../models/merge-deep";

/**
 * Manages the translation data.
 */
export interface ITranslationService {

    translationError: Subject<any>;

    getConfiguration(): TranslationConfig;

    init(): Promise<void>;

    /**
     * Fired when the translation data has been loaded. Returns the translation language.
     */
    translationChanged(): Observable<string>;

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

    public translationError: Subject<any> = new Subject();

    private serviceState: ServiceState;

    private loadingMode: LoadingMode;

    private translation: BehaviorSubject<string> = new BehaviorSubject<string>('');

    /**
     * The translation data: {language: {key: value}}.
     */
    private translationData: any = {};

    constructor(
        @Inject(TRANSLATION_CONFIG) private configuration: TranslationConfig,
        private locale: LocaleService,
        private translationProvider: TranslationProvider,
        private translationHandler: TranslationHandler
    ) {
        this.serviceState = ServiceState.isWaiting;
    }

    public getConfiguration(): TranslationConfig {
        return this.configuration;
    }

    public async init(): Promise<void> {
        if (this.configuration.providers) {
            this.loadingMode = LoadingMode.Async;
        } else {
            this.loadingMode = LoadingMode.Direct;
            if (this.configuration.translationData) {
                const translations: any[] = this.configuration.translationData;
                for (const translation of translations) {
                    this.addData(translation.data, translation.languageCode);
                }
            }
        }

        // When the language changes, loads translation data.
        this.locale.loadTranslation.subscribe(
            () => { this.loadTranslation(); }
        );

        await this.loadTranslation();
    }

    public translationChanged(): Observable<string> {
        return this.translation.asObservable();
    }

    public translate(
        keys: string | string[],
        args: any = null,
        lang: string = this.translation.getValue()
    ): string | any {
        // If the service is not ready, returns the keys.
        if (this.serviceState != ServiceState.isReady) return keys;

        if (Array.isArray(keys)) {
            const data: any = {};
            for (const key of keys) {
                data[key] = this.translateKey(key, args, lang);
            }
            return data;
        }

        return this.translateKey(keys, args, lang);
    }

    public translateAsync(
        keys: string | string[],
        args?: any,
        lang: string = this.translation.getValue()
    ): Observable<string | any> {
        return Observable.create((observer: Observer<string | any>) => {
            const values: string | any = this.translate(keys, args, lang);
            observer.next(values);
            observer.complete();
        });
    }

    private translateKey(key: string, args: any, lang: string): string | any {
        if (key == null || key == "") return null;
        // I18n plural.
        if (this.configuration.i18nPlural && /^\d+\b/.exec(key)) {
            return this.translateI18nPlural(key, args, lang);
        }
        return this.getValue(key, args, lang);
    }

    private getValue(key: string, args: any, lang: string): string | any {
        const path: string = key;
        let value: string | null = null;

        let translation: any = this.translationData[lang];

        if (translation) {
            // Composed key.
            if (this.configuration.composedKeySeparator) {
                const sequences: string[] = key.split(this.configuration.composedKeySeparator);

                key = sequences.shift()!;
                while (sequences.length > 0 && translation[key]) {
                    translation = translation[key];
                    key = sequences.shift()!;
                }
            }

            value = translation[key] || translation[this.configuration.missingKey || ""];
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
            const localeNumber: string = new Intl.NumberFormat(this.translation.getValue()).format(keyNumber);
            return localeNumber;
        }
        return keyNumber.toString();
    }

    private async loadTranslation(): Promise<void> {
        let language: string;
        if (this.configuration.composedLanguage) {
            language = this.composeLanguage(this.configuration.composedLanguage);
        } else {
            language = this.locale.getCurrentLanguage();
        }

        if (language != null && language != this.translation.getValue()) {
            if (this.loadingMode == LoadingMode.Async) {
                await this.getTranslation(language).toPromise();
            } else {
                this.releaseTranslation(language);
            }
        }
    }

    private composeLanguage(composedLanguage: ISOCode[]): string {
        let language: string = "";
        if (composedLanguage.length > 0) {
            for (let i: number = 0; i <= composedLanguage.length - 1; i++) {
                switch (composedLanguage[i]) {
                    case ISOCode.Script:
                        language += this.locale.getCurrentScript();
                        break;
                    case ISOCode.Country:
                        language += this.locale.getCurrentCountry();
                        break;
                    default:
                        language += this.locale.getCurrentLanguage();
                }
                if (i < composedLanguage.length - 1) {
                    language += "-";
                }
            }
        }
        return language;
    }

    private getTranslation(language: string): Observable<any> {

        return Observable.create((observer: Observer<any>) => {
            this.translationData = {};
            this.serviceState = ServiceState.isLoading;

            const sequencesOfOrderedTranslationData: Array<Observable<any>> = [];
            const sequencesOfTranslationData: Array<Observable<any>> = [];

            for (const provider of this.configuration.providers!) {
                if (typeof provider.type !== "undefined" && provider.type == ProviderType.Fallback) {
                    let fallbackLanguage: string = language;
                    if (provider.fallbackLanguage) {
                        fallbackLanguage = this.composeLanguage(provider.fallbackLanguage);
                    }
                    sequencesOfOrderedTranslationData.push(
                        this.translationProvider.getTranslation(fallbackLanguage, provider)
                    );
                } else {
                    sequencesOfTranslationData.push(
                        this.translationProvider.getTranslation(language, provider)
                    );
                }
            }

            // Merges all the sequences into a single observable sequence.
            const mergedSequencesOfTranslationData: Observable<any> = merge(...sequencesOfTranslationData);

            sequencesOfOrderedTranslationData.push(mergedSequencesOfTranslationData);

            concat(...sequencesOfOrderedTranslationData).subscribe(
                (data: any) => {
                    this.addData(data, language);
                },
                (error: any) => {
                    // Sends an event for custom actions.
                    this.translationError.next(error);
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
            ? mergeDeep(this.translationData[language], data)
            : data;
    }

    private releaseTranslation(language: string): void {
        this.serviceState = ServiceState.isReady;
        this.sendEvents(language);
    }

    private sendEvents(language: string): void {
        // Sends an event for the services.
        this.translation.next(language);
    }

}
