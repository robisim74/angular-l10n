import { Pipe, PipeTransform } from '@angular/core';

import { IntlAPI } from '../services/intl-api';
import { NumberFormatter } from '../models/intl';
import { NumberFormatStyle } from '../models/types';

function formatNumber(
    defaultLocale: string,
    value: number,
    style: NumberFormatStyle,
    digits?: string,
    currency?: string,
    currencyDisplay?: string): string | null {

    if (value == null) return null;

    value = typeof value === "string" && !isNaN(+value - parseFloat(value)) ? +value : value;

    let minInt: number | undefined;
    let minFraction: number | undefined;
    let maxFraction: number | undefined;
    if (style !== NumberFormatStyle.Currency) {
        minInt = 1;
        minFraction = 0;
        maxFraction = 3;
    }

    if (!!digits) {
        const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;
        const parts: RegExpMatchArray | null = digits.match(NUMBER_FORMAT_REGEXP);
        if (parts != null) {
            if (parts[1] != null) {  // Min integer digits.
                minInt = parseInt(parts[1]);
            }
            if (parts[3] != null) {  // Min fraction digits.
                minFraction = parseInt(parts[3]);
            }
            if (parts[5] != null) {  // Max fraction digits.
                maxFraction = parseInt(parts[5]);
            }
        }
    }

    return NumberFormatter.format(value, defaultLocale, style, {
        minimumIntegerDigits: minInt,
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        currency: currency,
        currencyDisplay: currencyDisplay
    });
}

@Pipe({
    name: 'l10nDecimal',
    pure: true
})
export class L10nDecimalPipe implements PipeTransform {

    public transform(value: any, defaultLocale: string, digits?: string): string | null {
        if (typeof defaultLocale === "undefined") return null;

        if (IntlAPI.hasNumberFormat()) {
            return formatNumber(defaultLocale, value, NumberFormatStyle.Decimal, digits);
        }
        // Returns the number without localization.
        return value;
    }

}

@Pipe({
    name: 'l10nPercent',
    pure: true
})
export class L10nPercentPipe implements PipeTransform {

    public transform(value: any, defaultLocale: string, digits?: string): string | null {
        if (typeof defaultLocale === "undefined") return null;

        if (IntlAPI.hasNumberFormat()) {
            return formatNumber(defaultLocale, value, NumberFormatStyle.Percent, digits);
        }
        // Returns the number without localization.
        return value;
    }

}

@Pipe({
    name: 'l10nCurrency',
    pure: true
})
export class L10nCurrencyPipe implements PipeTransform {

    public transform(
        value: any,
        defaultLocale: string,
        currency: string,
        currencyDisplay: 'code' | 'symbol' | 'name' = 'symbol',
        digits?: string
    ): string | null {
        if (typeof defaultLocale === "undefined" || typeof currency === "undefined") return null;

        if (IntlAPI.hasNumberFormat()) {
            return formatNumber(defaultLocale, value, NumberFormatStyle.Currency, digits, currency, currencyDisplay);
        }
        // Returns the number & currency without localization.
        return value + " " + currency;
    }

}
