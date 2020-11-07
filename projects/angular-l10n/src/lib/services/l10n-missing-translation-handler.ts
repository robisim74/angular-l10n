import { Injectable } from '@angular/core';

/**
 * Implement this class-interface to create an handler for missing values.
 */
@Injectable() export abstract class L10nMissingTranslationHandler {

    /**
     * This method must contain the logic to handle missing values.
     * @param key The key that has been requested
     * @return The value
     */
    public abstract handle(key: string, value?: string): string | any;

}

@Injectable() export class L10nDefaultMissingTranslationHandler implements L10nMissingTranslationHandler {

    public handle(key: string, value?: string): string | any {
        return key;
    }

}
