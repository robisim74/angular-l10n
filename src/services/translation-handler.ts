import { Injectable } from '@angular/core';

import { TranslationConfig } from '../models/translation/translation-config';

/**
 * Implement this class-interface to create a custom handler for translated values.
 */
@Injectable() export abstract class TranslationHandler {

    /**
     * This method must contain the logic to parse the translated value.
     * @param path The path of composed key
     * @param key The key to be translated
     * @param value The translated value
     * @param args The parameters passed along with the key
     * @param lang The current language
     * @return The translated value of the key
     */
    public abstract parseValue(path: string, key: string, value: string | null, args: any, lang: string): string;

}

@Injectable() export class DefaultTranslationHandler implements TranslationHandler {

    constructor(private configuration: TranslationConfig) { }

    public parseValue(path: string, key: string, value: string | null, args: any, lang: string): string {
        if (value == null) {
            return this.handleMissingValue(path);
        } else if (args) {
            return this.handleArgs(value, args);
        }
        return value;
    }

    private handleMissingValue(path: string): string {
        if (this.configuration.missingValue != null) {
            return this.configuration.missingValue;
        }
        // The same path is returned.
        return path;
    }

    private handleArgs(value: string, args: any): string {
        const TEMPLATE_REGEXP: RegExp = /{{\s?([^{}\s]*)\s?}}/g;
        return value.replace(TEMPLATE_REGEXP, (substring: string, parsedKey: string) => {
            const replacer: string = args[parsedKey] as string;
            return typeof replacer !== "undefined" ? replacer : substring;
        });
    }

}
