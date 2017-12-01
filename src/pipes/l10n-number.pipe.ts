import { Pipe, PipeTransform } from '@angular/core';

import { IntlAPI } from '../services/intl-api';
import { IntlFormatter } from '../models/intl-formatter';
import { NumberFormatStyle } from '../models/types';

@Pipe({
    name: 'l10nDecimal',
    pure: true
})
export class L10nDecimalPipe implements PipeTransform {

    public transform(value: any, defaultLocale: string, digits?: string): string | null {
        if (value == null) return null;
        if (typeof defaultLocale === "undefined") return null;

        if (IntlAPI.hasNumberFormat()) {
            value = typeof value === "string" && !isNaN(+value - parseFloat(value)) ? +value : value;

            return IntlFormatter.formatNumber(value, defaultLocale, NumberFormatStyle.Decimal, digits);
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
        if (value == null) return null;
        if (typeof defaultLocale === "undefined") return null;

        if (IntlAPI.hasNumberFormat()) {
            value = typeof value === "string" && !isNaN(+value - parseFloat(value)) ? +value : value;

            return IntlFormatter.formatNumber(value, defaultLocale, NumberFormatStyle.Percent, digits);
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

        if (value == null) return null;
        if (typeof defaultLocale === "undefined" || typeof currency === "undefined") return null;

        if (IntlAPI.hasNumberFormat()) {
            value = typeof value === "string" && !isNaN(+value - parseFloat(value)) ? +value : value;

            return IntlFormatter.formatNumber(
                value,
                defaultLocale,
                NumberFormatStyle.Currency,
                digits,
                currency,
                currencyDisplay
            );
        }
        // Returns the number & currency without localization.
        return value + " " + currency;
    }

}
