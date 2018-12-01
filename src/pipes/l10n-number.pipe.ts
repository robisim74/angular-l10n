import { Pipe, PipeTransform } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { DigitsOptions } from '../models/types';

@Pipe({
    name: 'l10nDecimal',
    pure: true
})
export class L10nDecimalPipe implements PipeTransform {

    constructor(protected locale: LocaleService) { }

    public transform(value: any, defaultLocale: string, digits?: string | DigitsOptions): string | null {
        if (value == null) return null;

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
        if (value == null) return null;

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
        currencyDisplay: 'code' | 'symbol' | 'name' = 'symbol',
        digits?: string | DigitsOptions
    ): string | null {
        if (value == null) return null;

        return this.locale.formatCurrency(value, digits, currencyDisplay, defaultLocale, currency);
    }

}
