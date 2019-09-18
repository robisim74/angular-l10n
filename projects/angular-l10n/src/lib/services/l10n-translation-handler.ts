import { Injectable } from '@angular/core';

import { handleParams } from '../models/utils';

/**
 * Implement this class-interface to create an handler for translated values.
 */
@Injectable() export abstract class L10nTranslationHandler {

    /**
     * This method must contain the logic to parse the translated value.
     * @param key The key that has been requested
     * @param params The parameters passed along with the key
     * @param value The translated value
     * @return The parsed value
     */
    public abstract parseValue(key: string, params: any, value: any): string | any;

}

@Injectable() export class L10nDefaultTranslationHandler implements L10nTranslationHandler {

    public parseValue(key: string, params: any, value: any): string | any {
        if (params) return handleParams(value, params);
        return value;
    }

}
