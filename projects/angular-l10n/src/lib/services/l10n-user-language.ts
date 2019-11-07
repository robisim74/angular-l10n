import { Injectable } from '@angular/core';

import { getBrowserLanguage } from '../models/utils';

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

    public get(): Promise<string | null> {
        const browserLanguage = getBrowserLanguage();
        return Promise.resolve(browserLanguage);
    }

}
