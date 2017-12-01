import { InjectionToken } from '@angular/core';

import { Type, DefaultLocaleCodes, Language, StorageStrategy, ISOCode } from './types';

export const LOCALE_CONFIG: InjectionToken<LocaleConfig> =
    new InjectionToken<LocaleConfig>('LOCALE_CONFIG');
export const TRANSLATION_CONFIG: InjectionToken<TranslationConfig> =
    new InjectionToken<TranslationConfig>('TRANSLATION_CONFIG');

export interface LocaleConfig {
    /**
     * Adds the languages to use in the app.
     */
    languages?: Language[];

    /**
     * Defines the language ISO 639 two-letter or three-letter code to be used,
     * if the language is not found in the browser.
     */
    language?: string;

    /**
     * Defines the default locale to be used, regardless of the browser language.
     */
    defaultLocale?: DefaultLocaleCodes;

    /**
     * Defines the currency ISO 4217 three-letter code to be used.
     */
    currency?: string;

    /**
     * The time zone name of the IANA time zone database to use.
     */
    timezone?: string;

    /**
     * Defines the storage to be used for language, default locale & currency. Default is cookie.
     */
    storage?: StorageStrategy;

    /**
     * If the cookie expiration is omitted, the cookie becomes a session cookie.
     */
    cookieExpiration?: number;
}

export interface TranslationConfig {
    /**
     * Direct loading: adds translation data.
     */
    translationData?: Array<{
        /**
         * ISO 639 two-letter or three-letter code.
         */
        languageCode: string;

        /**
         * Translation data of the language.
         */
        data: any;
    }>;

    /**
     * Asynchronous loading: adds translation providers.
     */
    providers?: any[];

    /**
     * Asynchronous loading: disables/enables the cache for translation providers.
     */
    caching?: Boolean;

    /**
     * Sets a composed language for translations.
     */
    composedLanguage?: ISOCode[];

    /**
     * Sets the value to use for missing keys.
     */
    missingValue?: string;

    /**
     * Sets the key to use for missing keys.
     */
    missingKey?: string;

    /**
     * Sets composed key separator.
     */
    composedKeySeparator?: string;

    /**
     * Disables/enables the translation of numbers that are contained at the beginning of the keys.
     */
    i18nPlural?: boolean;
}

export interface L10nConfig {
    /**
     * LocaleService configuration.
     */
    locale?: LocaleConfig;
    /**
     * TranslationService configuration.
     */
    translation?: TranslationConfig;
}

export interface Token {
    /**
     * Defines the locale storage to be used.
     */
    localeStorage?: Type<any>;
    /**
     * Defines the translation provider to be used.
     */
    translationProvider?: Type<any>;
    /**
     * Defines the translation handler to be used.
     */
    translationHandler?: Type<any>;
}
