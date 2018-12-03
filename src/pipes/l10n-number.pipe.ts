import { Pipe, PipeTransform } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { DigitsOptions } from '../models/types';
import { Logger } from '../models/logger';

@Pipe({
    name: 'l10nDecimal',
    pure: true
})
export class L10nDecimalPipe implements PipeTransform {

    constructor(protected locale: LocaleService) { }

    public transform(value: any, defaultLocale: string, digits?: string | DigitsOptions): string | null {
        if (isEmpty(value)) return null;
        if (typeof defaultLocale === "undefined") Logger.log('L10nDecimalPipe', 'missingDefaultLocale');

        return this.locale.formatDecimal(value, digits, defaultLocale);
    }

}

@Pipe({
    name: 'l10nPercent',
    pure: true
})
export class L10nPercentPipe implements PipeTransform {

    constructor(protected locale: LocaleService) { }

    public transform(value: any, defaultLocale: string, digits?: string | DigitsOptions): string | null {
        if (isEmpty(value)) return null;
        if (typeof defaultLocale === "undefined") Logger.log('L10nPercentPipe', 'missingDefaultLocale');

        return this.locale.formatPercent(value, digits, defaultLocale);
    }

}

@Pipe({
    name: 'l10nCurrency',
    pure: true
})
export class L10nCurrencyPipe implements PipeTransform {

    constructor(protected locale: LocaleService) { }

    public transform(
        value: any,
        defaultLocale: string,
        currency: string,
        currencyDisplay?: 'code' | 'symbol' | 'name',
        digits?: string | DigitsOptions
    ): string | null {
        if (isEmpty(value)) return null;
        if (typeof defaultLocale === "undefined") Logger.log('L10nCurrencyPipe', 'missingDefaultLocale');
        if (typeof currency === "undefined") Logger.log('L10nCurrencyPipe', 'missingCurrency');

        return this.locale.formatCurrency(value, digits, currencyDisplay, defaultLocale, currency);
    }

}

function isEmpty(value: any): boolean {
    return value == null || value === "" || value !== value; // Checks for NaN.
}
