import { Injectable, Inject } from '@angular/core';

import { TRANSLATION_CONFIG, TranslationConfig } from '../models/l10n-config';

/**
 * Implement this class-interface to create a custom handler for translated values.
 */
@Injectable() export abstract class TranslationHandler {

    /**
     * This method must contain the logic to parse the translated value.
     * @param path The path of the key
     * @param key The key that has been requested
     * @param value The translated value
     * @param args The parameters passed along with the key
     * @param lang The current language
     * @return The parsed value
     */
    public abstract parseValue(path: string, key: string, value: string | null, args: any, lang: string): string | any;

}

@Injectable() export class DefaultTranslationHandler implements TranslationHandler {

    constructor(@Inject(TRANSLATION_CONFIG) private configuration: TranslationConfig) { }

    public parseValue(path: string, key: string, value: string | null, args: any, lang: string): string | any {
        if (value == null) {
            return this.handleMissingValue(path);
        } else if (args) {
            return this.handleArgs(value, args);
        }
        return value;
    }

    private handleMissingValue(path: string): string {
        if (this.configuration.missingValue != null) {
            return typeof this.configuration.missingValue === "function"
                ? this.configuration.missingValue(path)
                : this.configuration.missingValue;
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
