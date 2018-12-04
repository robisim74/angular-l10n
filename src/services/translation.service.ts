import { Injectable, Inject } from '@angular/core';
import { Observer, Observable, Subject, BehaviorSubject, merge, concat, race } from 'rxjs';

import { TRANSLATION_CONFIG, TranslationConfig } from '../models/l10n-config';
import { LocaleService } from './locale.service';
import { TranslationProvider } from './translation-provider';
import { TranslationHandler } from './translation-handler';
import { ProviderType } from '../models/types';
import { mergeDeep } from '../models/merge-deep';

export interface ITranslationService {

    translationError: Subject<any>;

    getConfiguration(): TranslationConfig;

    init(): Promise<any>;

    translationChanged(): Observable<string>;

    translate(keys: string | string[], args?: any, lang?: string): string | any;

    translateAsync(keys: string | string[], args?: any, lang?: string): Observable<string | any>;

}

/**
 * Manages the translation data.
 */
@Injectable() export class TranslationService implements ITranslationService {

    /**
     * Fired when the translation data could not been loaded. Returns the error.
     */
    translationError: Subject<any> = new Subject<any>();

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
    ) { }

    public getConfiguration(): TranslationConfig {
        return this.configuration;
    }

    public async init(): Promise<any> {
        // When the language or the default locale changes, loads translation data.
        race(this.locale.languageCodeChanged, this.locale.defaultLocaleChanged).subscribe(
            () => {
                this.loadTranslation()
                    .catch((error: any) => null);
            }
        );

        await this.loadTranslation()
            .catch((error: any) => { throw error; });
    }

    /**
     * Fired when the translation data has been loaded. Returns the translation language.
     */
    public translationChanged(): Observable<string> {
        return this.translation.asObservable();
    }

    /**
     * Translates a key or an array of keys.
     * @param keys The key or an array of keys to be translated
     * @param args Optional parameters contained in the key
     * @param lang The current language of the service is used by default
     * @return The translated value or an object: {key: value}
     */
    public translate(
        keys: string | string[],
        args?: any,
        lang?: string
    ): string | any {
        if (Array.isArray(keys)) {
            const data: any = {};
            for (const key of keys) {
                data[key] = this.translateKey(key, args, lang || this.translation.getValue());
            }
            return data;
        }
        return this.translateKey(keys, args, lang || this.translation.getValue());
    }

    public translateAsync(
        keys: string | string[],
        args?: any,
        lang?: string
    ): Observable<string | any> {
        return Observable.create((observer: Observer<string | any>) => {
            const values: string | any = this.translate(keys, args, lang);
            observer.next(values);
            observer.complete();
        });
    }

    private translateKey(key: string, args: any, lang: string): string | any {
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
            value = typeof translation[key] === "undefined" ?
                translation[this.configuration.missingKey || ""] :
                translation[key];
        }
        return this.translationHandler.parseValue(path, key, value, args, lang);
    }

    private translateI18nPlural(key: string, args: any, lang: string): string {
        let keyText: string = key.replace(/^\d+\b/, "");
        keyText = keyText.trim();
        const keyNumber: number = parseFloat(key);
        if (!isNaN(keyNumber)) {
            key = key.replace(/^\d+/, this.locale.formatDecimal(keyNumber));
        }
        return key.replace(keyText, this.getValue(keyText, args, lang));
    }

    private async loadTranslation(): Promise<any> {
        let language: string;
        if (this.configuration.composedLanguage) {
            language = this.locale.composeLocale(this.configuration.composedLanguage);
        } else {
            language = this.locale.getCurrentLanguage();
        }
        if (language) {
            this.translationData = {};

            if (this.configuration.translationData) {
                this.getTranslation(language);
            }
            if (this.configuration.providers) {
                await this.getTranslationAsync(language)
                    .toPromise()
                    .catch((error: any) => { throw error; });
            }
        }
    }

    private getTranslation(language: string): void {
        const translations: any[] = this.configuration.translationData!.filter((value: any) => value.languageCode == language);
        for (const translation of translations) {
            this.addData(translation.data, language);
        }
        if (!this.configuration.providers) {
            this.releaseTranslation(language);
        }
    }

    private getTranslationAsync(language: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            const sequencesOfOrderedTranslationData: Array<Observable<any>> = [];
            const sequencesOfTranslationData: Array<Observable<any>> = [];

            for (const provider of this.configuration.providers!) {
                if (typeof provider.type !== "undefined" && provider.type == ProviderType.Fallback) {
                    let fallbackLanguage: string = language;
                    if (provider.fallbackLanguage) {
                        fallbackLanguage = this.locale.composeLocale(provider.fallbackLanguage);
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
            // Adds to ordered sequences.
            sequencesOfOrderedTranslationData.push(mergedSequencesOfTranslationData);

            concat(...sequencesOfOrderedTranslationData).subscribe(
                (data: any) => {
                    this.addData(data, language);
                },
                (error: any) => {
                    this.handleError(error, language);
                    observer.error(error);
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
        this.translation.next(language);
    }

    private handleError(error: any, language: string): void {
        if (this.configuration.rollbackOnError) {
            this.locale.rollback();
        } else {
            this.releaseTranslation(language);
        }
        this.translationError.next(error);
    }

}
