import { Injectable, Inject } from '@angular/core';

import { L10N_CONFIG, L10nConfig } from '../models/l10n-config';
import { getBrowserLanguage } from '../models/utils';

/**
 * Implement this class-interface to get the user language.
 */
@Injectable() export abstract class L10nUserLanguage {

    /**
     * This method must contain the logic to get the user language.
     * @return The user language
     */
    public abstract async get(): Promise<string | null>;

}

@Injectable() export class L10nDefaultUserLanguage implements L10nUserLanguage {

    constructor(@Inject(L10N_CONFIG) private config: L10nConfig) { }

    public async get(): Promise<string | null> {
        const browserLanguage = getBrowserLanguage(this.config.format);
        return Promise.resolve(browserLanguage);
    }

}
