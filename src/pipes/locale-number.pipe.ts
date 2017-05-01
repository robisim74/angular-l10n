import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';

import { IntlAPI } from '../services/intl-api';

@Pipe({
    name: 'localeDecimal',
    pure: true
})
export class LocaleDecimalPipe implements PipeTransform {

    public transform(value: any, defaultLocale: string, digits?: string): string | null {
        if (IntlAPI.HasNumberFormat()) {
            const localeDecimal: DecimalPipe = new DecimalPipe(defaultLocale);
            return localeDecimal.transform(value, digits);
        }
        // Returns the number without localization.
        return value;
    }

}

@Pipe({
    name: 'localePercent',
    pure: true
})
export class LocalePercentPipe implements PipeTransform {

    public transform(value: any, defaultLocale: string, digits?: string): string | null {
        if (IntlAPI.HasNumberFormat()) {
            const localePercent: PercentPipe = new PercentPipe(defaultLocale);
            return localePercent.transform(value, digits);
        }
        // Returns the number without localization.
        return value;
    }

}

@Pipe({
    name: 'localeCurrency',
    pure: true
})
export class LocaleCurrencyPipe implements PipeTransform {

    public transform(
        value: any,
        defaultLocale: string,
        currency: string,
        symbolDisplay: boolean = false,
        digits?: string
    ): string | null {
        if (IntlAPI.HasNumberFormat()) {
            const localeCurrency: CurrencyPipe = new CurrencyPipe(defaultLocale);
            return localeCurrency.transform(value, currency, symbolDisplay, digits);
        }
        // Returns the number & currency without localization.
        return value + " " + currency;
    }

}
