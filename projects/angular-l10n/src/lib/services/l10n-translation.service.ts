import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, BehaviorSubject, merge, concat } from 'rxjs';

import { L10nLocale, L10nProvider } from '../models/types';
import { L10N_CONFIG, L10nConfig, L10N_LOCALE } from '../models/l10n-config';
import { formatLanguage, getSchema, getValue, mergeDeep } from '../models/utils';
import { L10nCache } from './l10n-cache';
import { L10nStorage } from './l10n-storage';
import { L10nUserLanguage } from './l10n-user-language';
import { L10nTranslationFallback } from './l10n-translation-fallback';
import { L10nTranslationLoader } from './l10n-translation-loader';
import { L10nTranslationHandler } from './l10n-translation-handler';
import { L10nMissingTranslationHandler } from './l10n-missing-translation-handler';
import { L10nLocation } from './l10n-location';

@Injectable() export class L10nTranslationService {

    /**
     * The translation data: {language: {key: value}}
     */
    public data: { [key: string]: any } = {};

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
        private missingTranslationHandler: L10nMissingTranslationHandler,
        @Optional() private location: L10nLocation
    ) { }

    /**
     * Gets the current locale.
     */
    public getLocale(): L10nLocale {
        return this.locale;
    }

    /**
     * Changes the current locale and load the translation data.
     * @param locale The new locale
     */
    public async setLocale(locale: L10nLocale): Promise<void> {
        await this.loadTranslation(this.config.providers, locale);
    }

    /**
     * Fired every time the translation data has been loaded. Returns the locale.
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
        language = this.locale.language
    ): string | any {
        language = formatLanguage(language, this.config.format);

        if (Array.isArray(keys)) {
            const data: { [key: string]: any } = {};
            for (const key of keys) {
                data[key] = this.translate(key, params, language);
            }
            return data;
        }

        const value = getValue(keys, this.data[language], this.config.keySeparator);

        return value ? this.translationHandler.parseValue(keys, params, value) : this.missingTranslationHandler.handle(keys, value, params);
    }

    /**
     * Checks if a translation exists.
     * @param key The key to be tested
     * @param language The current language
     */
    public has(key: string, language = this.locale.language): boolean {
        language = formatLanguage(language, this.config.format);

        return getValue(key, this.data[language], this.config.keySeparator) !== null;
    }

    /**
     * Gets the language direction.
     */
    public getLanguageDirection(language = this.locale.language): 'ltr' | 'rtl' | undefined {
        const schema = getSchema(this.config.schema, language, this.config.format);
        return schema ? schema.dir : undefined;
    }

    /**
     * Gets available languages.
     */
    public getAvailableLanguages(): string[] {
        const languages = this.config.schema.map(item => formatLanguage(item.locale.language, this.config.format));
        return languages;
    }

    /**
     * Should only be called when the service instance is created
     * or in lazy loaded modules when initialNavigation is enabled.
     * @param providers An array of L10nProvider
     */
    public async init(providers: L10nProvider[] = this.config.providers): Promise<void> {
        let locale: L10nLocale | null = null;

        // Tries to get locale from path if localized routing is used.
        if (this.location) {
            const path = this.location.path();
            const pathLanguage = this.location.parsePath(path);
            if (pathLanguage) {
                const schema = getSchema(this.config.schema, pathLanguage, this.config.format);
                if (schema) {
                    locale = schema.locale;
                }
            }
        }
        // Tries to get locale from storage.
        if (locale == null) {
            locale = await this.storage.read();
        }
        // Tries to get locale through the user language.
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
        await this.loadTranslation(providers, locale);
    }

    /**
     * Can be called at every translation change.
     * @param providers An array of L10nProvider
     * @param locale The current locale
     */
    public async loadTranslation(providers: L10nProvider[] = this.config.providers, locale = this.locale): Promise<void> {
        const language = formatLanguage(locale.language, this.config.format);

        return new Promise((resolve) => {
            concat(...this.getTranslation(providers, language)).subscribe({
                next: (data) => this.addData(data, language),
                error: (error) => {
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

    /**
     * Can be called to add translation data.
     * @param data The translation data {key: value}
     * @param language The language to add data
     */
    public addData(data: { [key: string]: any }, language: string): void {
        this.data[language] = this.data[language] !== undefined
            ? mergeDeep(this.data[language], data)
            : data;
    }

    /**
     * Adds providers to configuration
     * @param providers The providers of the translations data
     */
    public addProviders(providers: L10nProvider[]): void {
        providers.forEach(provider => {
            if (!this.config.providers.find(p => p.name === provider.name)) {
                this.config.providers.push(provider);
            }
        });
    }

    private getTranslation(providers: L10nProvider[], language: string): Observable<any>[] {
        const lazyLoaders: Observable<any>[] = [];
        let loaders: Observable<any>[] = [];

        for (const provider of providers) {
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

    private handleError(error: any): void {
        this.error.next(error);
    }

    private releaseTranslation(locale: L10nLocale): void {
        Object.assign(this.locale, locale);
        this.translation.next(this.locale);
        this.storage.write(this.locale);
    }

}
