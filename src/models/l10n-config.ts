import { InjectionToken } from '@angular/core';

import { Type, DefaultLocaleCodes, Language, StorageStrategy, ISOCode, LogLevel, Schema } from './types';

export const LOCALE_CONFIG: InjectionToken<LocaleConfig> =
    new InjectionToken<LocaleConfig>('LOCALE_CONFIG');
export const TRANSLATION_CONFIG: InjectionToken<TranslationConfig> =
    new InjectionToken<TranslationConfig>('TRANSLATION_CONFIG');
export const L10N_LOGGER: InjectionToken<LoggerConfig> =
    new InjectionToken<LoggerConfig>('L10N_LOGGER');
export const LOCALIZED_ROUTING: InjectionToken<LocalizedRoutingConfig> =
    new InjectionToken<LocalizedRoutingConfig>('LOCALIZED_ROUTING');
export const LOCALE_INTERCEPTOR: InjectionToken<LocaleInterceptorConfig> =
    new InjectionToken<LocaleInterceptorConfig>('LOCALE_INTERCEPTOR');

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
     * Provide it only at the root level.
     */
    caching?: Boolean;

    /**
     * Asynchronous loading: adds the query parameter 'ver' to the http requests.
     * Provide it only at the root level.
     */
    version?: string;

    /**
     * Asynchronous loading: sets a timeout in milliseconds for the http requests.
     * Provide it only at the root level.
     */
    timeout?: number;

    /**
     * Asynchronous loading: rollbacks to previous default locale, currency and timezone on error.
     */
    rollbackOnError?: boolean;

    /**
     * Sets a composed language for translations.
     */
    composedLanguage?: ISOCode[];

    /**
     * Sets the value or the function to use for missing keys.
     * Provide it only at the root level.
     */
    missingValue?: string | ((path: string) => string);

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

export interface LoggerConfig {
    /**
     * Defines the log level.
     */
    level?: LogLevel;
}

export interface LocalizedRoutingConfig {
    /**
     * Defines the format of the localized routing.
     */
    format?: ISOCode[];

    /**
     * Disables/enables default routing for default language or locale.
     */
    defaultRouting?: boolean;

    /**
     * Provides the schema to the default behaviour of localized routing.
     */
    schema?: Schema[];
}

export interface LocaleInterceptorConfig {
    /**
     * Defines the format of the 'Accept-Language' header.
     */
    format?: ISOCode[];
}

export interface L10nConfig {
    /**
     * Locale service configuration.
     */
    locale?: LocaleConfig;

    /**
     * Translation service configuration.
     */
    translation?: TranslationConfig;

    /**
     * Logger configuration.
     */
    logger?: LoggerConfig;

    /**
     * Localized routing configuration.
     */
    localizedRouting?: LocalizedRoutingConfig;

    /**
     * Locale interceptor configuration.
     */
    localeInterceptor?: LocaleInterceptorConfig;
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
