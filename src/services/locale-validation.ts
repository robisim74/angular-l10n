import { Injectable } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { DecimalCode } from '../models/validation/decimal-code';

/**
 * Provides the methods to convert strings according to default locale.
 */
@Injectable() export class LocaleValidation {

    constructor(public locale: LocaleService) { }

    /**
     * Converts a string to a number according to default locale.
     * If the string cannot be converted to a number, returns NaN.
     */
    public parseNumber(s: string): number {
        if (s == "") {
            return null;
        }
        let decimalCode: DecimalCode = new DecimalCode(this.locale.getDefaultLocale());
        return decimalCode.parse(s);
    }

}
