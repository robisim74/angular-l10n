import { Injectable } from '@angular/core';

import { DecimalCode } from '../models/validation/decimal-code';

/**
 * Provides the methods to convert strings according to default locale.
 */
export interface ILocaleValidation {

    /**
     * Converts a string to a number according to default locale.
     * If the string cannot be converted to a number, returns NaN.
     */
    parseNumber(s: string): number | null;

}

@Injectable() export class LocaleValidation implements ILocaleValidation {

    constructor(private decimalCode: DecimalCode) { }

    public parseNumber(s: string): number | null {
        if (s == "") {
            return null;
        }
        return this.decimalCode.parse(s);
    }

}
