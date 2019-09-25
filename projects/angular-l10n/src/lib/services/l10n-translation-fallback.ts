import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { L10nProvider } from '../models/types';
import { L10N_CONFIG, L10nConfig } from '../models/l10n-config';
import { L10nCache } from './l10n-cache';
import { L10nTranslationLoader } from './l10n-translation-loader';

/**
 * Implement this class-interface to create a translation fallback.
 */
@Injectable() export abstract class L10nTranslationFallback {

    /**
     * This method must contain the logic to get the ordered loaders.
     * @param language The current language
     * @param provider The provider of the translations data
     * @return An array of loaders
     */
    public abstract get(language: string, provider: L10nProvider): Observable<any>[];

}

@Injectable() export class L10nDefaultTranslationFallback implements L10nTranslationFallback {

    constructor(
        @Inject(L10N_CONFIG) private config: L10nConfig,
        private cache: L10nCache,
        private translationLoader: L10nTranslationLoader
    ) { }

    /**
     * Translation data will be merged in the following order:
     * 'language'
     * 'language[-script]'
     * 'language[-script][-country]'
     */
    public get(language: string, provider: L10nProvider): Observable<any>[] {
        const loaders: Observable<any>[] = [];
        const keywords = language.match(/-?[a-zA-z]+/g) || [];
        let fallbackLanguage = '';
        for (const keyword of keywords) {
            fallbackLanguage += keyword;
            if (this.config.cache) {
                loaders.push(
                    this.cache.read(`${provider.name}-${fallbackLanguage}`,
                        this.translationLoader.getTranslation(fallbackLanguage, provider))
                );
            } else {
                loaders.push(this.translationLoader.getTranslation(fallbackLanguage, provider));
            }
        }
        return loaders;
    }

}
