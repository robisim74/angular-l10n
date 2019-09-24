import { Injectable, Inject } from '@angular/core';

import { L10nNumberFormatOptions, L10nDateTimeFormatOptions, L10nLocale } from '../models/types';
import { L10N_LOCALE } from '../models/l10n-config';

/**
 * Implement this class-interface to create a validation service.
 */
@Injectable() export abstract class L10nValidation {

    /**
     * This method must contain the logic to convert a string to a number.
     * @param value The string to be parsed
     * @param options A L10n or Intl NumberFormatOptions object
     * @param language The current language
     * @return The parsed number
     */
    public abstract parseNumber(
        value: string,
        options?: L10nNumberFormatOptions | Intl.NumberFormatOptions,
        language?: string
    ): number | null;

    /**
     * This method must contain the logic to convert a string to a date.
     * @param value The string to be parsed
     * @param options A L10n or Intl DateTimeFormatOptions object
     * @param language The current language
     * @return The parsed date
     */
    public abstract parseDate(
        value: string,
        options?: L10nDateTimeFormatOptions | Intl.DateTimeFormatOptions,
        language?: string
    ): Date | null;

}

@Injectable() export class L10nDefaultValidation {

    constructor(@Inject(L10N_LOCALE) private locale: L10nLocale) { }

    public parseNumber(
        value: string,
        options?: L10nNumberFormatOptions | Intl.NumberFormatOptions,
        language = this.locale.language
    ): number | null {
        return null;
    }

    public parseDate(
        value: string,
        options?: L10nDateTimeFormatOptions | Intl.DateTimeFormatOptions,
        language = this.locale.language
    ): Date | null {
        return null;
    }

}
