import { InjectionToken } from '@angular/core';

import { Type, DefaultLocale, Language, StorageStrategy, ISOCode, LogLevel, Schema } from './types';

export const L10N_CONFIG: InjectionToken<L10nConfigRef> = new InjectionToken<L10nConfigRef>('L10N_CONFIG');

/**
 * Reference to L10N_CONFIG.
 */
export type L10nConfigRef = Required<L10nConfig>;

export interface L10nConfig {
    /**
     * Locale service configuration.
     */
    locale?: {
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
        defaultLocale?: DefaultLocale;

        /**
         * Defines the currency ISO 4217 three-letter code to be used.
         */
        currency?: string;

        /**
         * The time zone name of the IANA time zone database to use.
         */
        timezone?: string;

        /**
         * Defines the storage to be used for default locale, currency & timezone.
         */
        storage?: StorageStrategy;

        /**
         * If the cookie expiration is omitted, the cookie becomes a session cookie.
         */
        cookieExpiration?: number;
    };

    /**
     * Translation service configuration.
     */
    translation?: {
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
        caching?: boolean;

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
    };

    /**
     * Logger configuration.
     */
    logger?: {
        /**
         * Defines the log level.
         */
        level?: LogLevel;
    };

    /**
     * Localized routing configuration.
     */
    localizedRouting?: {
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
    };

    /**
     * Locale interceptor configuration.
     */
    localeInterceptor?: {
        /**
         * Defines the format of the 'Accept-Language' header.
         */
        format?: ISOCode[];
    };
}

export function l10nConfigFactory(l10nConfig: L10nConfig): L10nConfigRef {
    return {
        locale: l10nConfig.locale || {},
        translation: l10nConfig.translation || {},
        logger: l10nConfig.logger || {},
        localizedRouting: l10nConfig.localizedRouting || {},
        localeInterceptor: l10nConfig.localeInterceptor || {}
    };
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
