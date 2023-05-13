import { Inject, Injectable } from '@angular/core';

import { L10N_CONFIG, L10nConfig } from '../models/l10n-config';
import { getBrowserLanguage, getSchema } from '../models/utils';
import { L10nLocale } from '../models/types';

/**
 * Implement this class-interface to resolve the locale.
 */
@Injectable() export abstract class L10nLocaleResolver {

    /**
     * This method must contain the logic to get the locale.
     * @return The locale
     */
    public abstract get(): Promise<L10nLocale | null>;

}

@Injectable() export class L10nDefaultLocaleResolver implements L10nLocaleResolver {

    constructor(@Inject(L10N_CONFIG) private config: L10nConfig) { }

    public async get(): Promise<L10nLocale | null> {
        const browserLanguage = getBrowserLanguage(this.config.format);
        if (browserLanguage) {
            const schema = getSchema(this.config.schema, browserLanguage, this.config.format);
            if (schema) {
                return Promise.resolve(schema.locale);
            }
        }
        return Promise.resolve(null);
    }

}
