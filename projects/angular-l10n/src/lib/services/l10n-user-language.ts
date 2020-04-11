import { Injectable, Inject } from '@angular/core';

import { L10N_CONFIG, L10nConfig } from '../models/l10n-config';

/**
 * Implement this class-interface to get the user language.
 */
@Injectable() export abstract class L10nUserLanguage {

    /**
     * This method must contain the logic to get the user language.
     * @return The user language
     */
    public abstract get(): Promise<string | null>;

}

@Injectable() export class L10nDefaultUserLanguage implements L10nUserLanguage {

    constructor(@Inject(L10N_CONFIG) private config: L10nConfig) { }

    public get(): Promise<string | null> {
        let browserLanguage = null;
        if (navigator !== undefined && navigator.language) {
            switch (this.config.format) {
                case 'language':
                    browserLanguage = navigator.language.split('-')[0];
                    break
                case 'language-region':
                    browserLanguage = navigator.language;
                    break
            }
        }
        return Promise.resolve(browserLanguage);
    }

}
