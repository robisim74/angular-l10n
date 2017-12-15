import { Injectable } from '@angular/core';

import { DecimalCode } from '../models/decimal-code';

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

/**
 * Provides the methods to convert strings according to default locale.
 */
@Injectable() export class LocaleValidation implements ILocaleValidation {

    constructor(private decimalCode: DecimalCode) { }

    /**
     * Converts a string to a number according to default locale.
     * If the string cannot be converted to a number, returns NaN.
     */
    public parseNumber(s: string): number | null {
        if (s == "") {
            return null;
        }
        return this.decimalCode.parse(s);
    }

}
