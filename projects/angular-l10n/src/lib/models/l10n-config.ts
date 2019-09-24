import { InjectionToken, Type } from '@angular/core';

import { L10nFormat, L10nProvider, L10nLocale, L10nSchema } from './types';
import { L10nStorage } from '../services/l10n-storage';
import { L10nTranslationFallback } from '../services/l10n-translation-fallback';
import { L10nTranslationLoader } from '../services/l10n-translation-loader';
import { L10nTranslationHandler } from '../services/l10n-translation-handler';
import { L10nMissingTranslationHandler } from '../services/l10n-missing-translation-handler';
import { L10nValidation } from '../services/l10n-validation';

export interface L10nConfig {
    /**
     * Format of the translation language. Pattern: 'language[-script][-region]'
     * E.g.
     * format: 'language-region';
     */
    format?: L10nFormat;
    /**
     * The providers of the translations data.
     */
    providers?: L10nProvider[];
    /**
     * Translation fallback.
     */
    fallback?: boolean;
    /**
     * Caching for providers.
     */
    cache?: boolean;
    /**
     * Sets key separator.
     */
    keySeparator?: string;
    /**
     * Defines the default locale to be used.
     * E.g.
     * defaultLocale: { language: 'en-US', currency: 'USD };
     */
    defaultLocale?: L10nLocale;
    /**
     * Provides the schema of the supported locales.
     */
    schema?: L10nSchema[];
}

/**
 * L10n configuration token.
 */
export const L10N_CONFIG = new InjectionToken<L10nConfig>('L10N_CONFIG');

/**
 * L10n locale token.
 */
export const L10N_LOCALE = new InjectionToken<L10nLocale>('L10N_LOCALE');

export interface L10nTranslationToken {
    /**
     * Defines the storage to be used.
     */
    storage?: Type<L10nStorage>;
    /**
     * Defines the translation fallback to be used.
     */
    translationFallback?: Type<L10nTranslationFallback>;
    /**
     * Defines the translation loader to be used.
     */
    translationLoader?: Type<L10nTranslationLoader>;
    /**
     * Defines the translation handler to be used.
     */
    translationHandler?: Type<L10nTranslationHandler>;
    /**
     * Defines the missing translation handler to be used.
     */
    missingTranslationHandler?: Type<L10nMissingTranslationHandler>;
}

export interface L10nValidationToken {
    /**
     * Defines the validation service to be used.
     */
    validation?: Type<L10nValidation>;
}
