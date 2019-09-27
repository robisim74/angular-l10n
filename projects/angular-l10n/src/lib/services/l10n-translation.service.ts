import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, Subject, merge, concat } from 'rxjs';

import { L10nLocale } from '../models/types';
import { L10N_CONFIG, L10nConfig, L10N_LOCALE } from '../models/l10n-config';
import { formatLanguage, getSchema, getValue, mergeDeep } from '../models/utils';
import { l10nError } from '../models/l10n-error';
import { L10nCache } from './l10n-cache';
import { L10nStorage } from './l10n-storage';
import { L10nUserLanguage } from './l10n-user-language';
import { L10nTranslationFallback } from './l10n-translation-fallback';
import { L10nTranslationLoader } from './l10n-translation-loader';
import { L10nTranslationHandler } from './l10n-translation-handler';
import { L10nMissingTranslationHandler } from './l10n-missing-translation-handler';

@Injectable() export class L10nTranslationService {

    /**
     * The translation data: {language: {key: value}}
     */
    public data: any = {};

    private translation = new BehaviorSubject<L10nLocale>(this.locale);

    private error = new BehaviorSubject<any>(null);

    constructor(
        @Inject(L10N_CONFIG) private config: L10nConfig,
        @Inject(L10N_LOCALE) private locale: L10nLocale,
        private cache: L10nCache,
        private storage: L10nStorage,
        private userLanguage: L10nUserLanguage,
        private translationFallback: L10nTranslationFallback,
        private translationLoader: L10nTranslationLoader,
        private translationHandler: L10nTranslationHandler,
        private missingTranslationHandler: L10nMissingTranslationHandler
    ) { }

    /**
     * Gets the current locale.
     */
    public getLocale(): L10nLocale {
        return this.locale;
    }

    public async setLocale(locale: L10nLocale): Promise<void> {
        await this.loadTranslation(locale);
    }

    /**
     * Fired when the translation data has been loaded. Returns the locale.
     */
    public onChange(): Observable<L10nLocale> {
        return this.translation.asObservable();
    }

    /**
     * Fired when the translation data could not been loaded. Returns the error.
     */
    public onError(): Observable<any> {
        return this.error.asObservable();
    }

    /**
     * Translates a key or an array of keys.
     * @param keys The key or an array of keys to be translated
     * @param params Optional parameters contained in the key
     * @param language The current language
     * @return The translated value or an object: {key: value}
     */
    public translate(
        keys: string | string[],
        params?: any,
        language = formatLanguage(this.locale.language, this.config.format)
    ): string | any {
        if (Array.isArray(keys)) {
            const data: any = {};
            for (const key of keys) {
                data[key] = this.translate(key, params, language);
            }
            return data;
        }

        const value = getValue(keys, this.data[language], this.config.keySeparator);

        return value ? this.translationHandler.parseValue(keys, params, value) : this.missingTranslationHandler.handle(keys);
    }

    /**
     * Checks if a translation exists.
     * @param key The key to be tested
     * @param language The current language
     */
    public has(key: string, language = formatLanguage(this.locale.language, this.config.format)): boolean {
        return getValue(key, this.data[language], this.config.keySeparator) !== null;
    }

    /**
     * Gets the current language direction.
     */
    public getLanguageDirection(): 'ltr' | 'rtl' | undefined {
        const schema = getSchema(this.config.schema, this.locale.language, this.config.format);
        if (schema) return schema.dir;
    }

    public async init(): Promise<void> {
        if (this.locale.language) return Promise.resolve();

        // Tries to get the locale from the storage.
        let locale = await this.storage.read();
        // Tries to get the locale through the user language.
        if (locale == null) {
            const browserLanguage = await this.userLanguage.get();
            if (browserLanguage) {
                const schema = getSchema(this.config.schema, browserLanguage, this.config.format);
                if (schema) {
                    locale = schema.locale;
                }
            }
        }
        // Gets the default locale.
        if (locale == null) {
            locale = this.config.defaultLocale;
        }

        // Loads translation data.
        await this.loadTranslation(locale);
    }

    public async loadTranslation(locale = this.locale): Promise<void> {
        const language = formatLanguage(locale.language, this.config.format);

        this.data = {};

        return new Promise((resolve) => {
            concat(...this.getTranslation(language)).subscribe({
                next: (data) => this.addData(data, language),
                error: (error) => {
                    this.releaseTranslation(locale);
                    this.handleError(error);
                    resolve();
                },
                complete: () => {
                    this.releaseTranslation(locale);
                    resolve();
                }
            });
        });
    }

    private getTranslation(language: string): Observable<any>[] {
        const lazyLoaders: Observable<any>[] = [];
        let loaders: Observable<any>[] = [];

        for (const provider of this.config.providers) {
            if (this.config.fallback) {
                loaders = loaders.concat(this.translationFallback.get(language, provider));
            } else {
                if (this.config.cache) {
                    lazyLoaders.push(
                        this.cache.read(`${provider.name}-${language}`, this.translationLoader.get(language, provider))
                    );
                } else {
                    lazyLoaders.push(this.translationLoader.get(language, provider));
                }
            }
        }
        loaders.push(merge(...lazyLoaders));

        return loaders;
    }

    private addData(data: any, language: string): void {
        this.data[language] = this.data[language] !== undefined
            ? mergeDeep(this.data[language], data)
            : data;
    }

    private handleError(error: any): void {
        this.error.next(error);
    }

    private releaseTranslation(locale: L10nLocale): void {
        Object.assign(this.locale, locale);
        this.translation.next(this.locale);
        this.storage.write(this.locale);
    }

}
