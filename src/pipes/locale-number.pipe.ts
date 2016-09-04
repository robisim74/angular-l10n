/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';

// Services.
import { IntlSupport } from '../services/Intl-support';

/**
 * 'localeDecimal' pipe function.
 */
@Pipe({
    name: 'localeDecimal',
    pure: true
})

/**
 * LocaleDecimalPipe class.
 * Localizes decimal numbers.
 * 
 * Getting the local decimal:
 * 
 * expression | localeDecimal[:defaultLocale:[digitInfo]]
 * 
 * where 'expression' is a number and 'digitInfo' has the following format:
 * 
 * {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
 * 
 * For example, to get the local decimal, add in the template:
 * 
 * {{ pi | localeDecimal:defaultLocale:'1.5-5' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 *         ...
 *     }
 * 
 *     // Gets the default locale.
 *     get defaultLocale(): string {
 *
 *         return this.locale.getDefaultLocale();
 *      
 *     }
 * 
 * }
 * 
 * @author Roberto Simonetti
 * @see Angular 2 DecimalPipe for further information
 */
export class LocaleDecimalPipe implements PipeTransform {

    /**
     * LocaleDecimalPipe transform method.
     * 
     * @param value The number to be localized
     * @param defaultLocale The default locale
     * @param digits The format of the number
     * @return The locale decimal
     */
    public transform(value: any, defaultLocale: string, digits: string = null): string {

        // Checks for support for Intl.
        if (IntlSupport.NumberFormat(defaultLocale) == true) {

            var localeDecimal: DecimalPipe = new DecimalPipe(defaultLocale);

            return localeDecimal.transform(value, digits);

        }

        // Returns the number without localization.
        return value;

    }

}

/**
 * 'localePercent' pipe function.
 */
@Pipe({
    name: 'localePercent',
    pure: true
})

/**
 * LocalePercentPipe class.
 * Localizes percent numbers.
 * 
 * Getting the local percentage:
 * 
 * expression | localePercent[:defaultLocale:[digitInfo]]
 * 
 * For example, to get the local percentage, add in the template:
 * 
 * {{ a | localePercent:defaultLocale:'1.1-1' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 *         ...
 *     }
 * 
 *     // Gets the default locale.
 *     get defaultLocale(): string {
 *
 *         return this.locale.getDefaultLocale();
 *      
 *     }
 * 
 * }
 * 
 * @author Roberto Simonetti
 * @see Angular 2 PercentPipe for further information
 */
export class LocalePercentPipe implements PipeTransform {

    /**
     * LocalePercentPipe transform method.
     * 
     * @param value The number to be localized
     * @param defaultLocale The default locale
     * @param digits The format of the number
     * @return The locale percent
     */
    public transform(value: any, defaultLocale: string, digits: string = null): string {

        // Checks for support for Intl.
        if (IntlSupport.NumberFormat(defaultLocale) == true) {

            var localePercent: PercentPipe = new PercentPipe(defaultLocale);

            return localePercent.transform(value, digits);

        }

        // Returns the number without localization.
        return value;

    }

}

/**
 * 'localeCurrency' pipe function.
 */
@Pipe({
    name: 'localeCurrency',
    pure: true
})

/**
 * LocaleCurrencyPipe class.
 * Localizes currencies.
 * 
 * Getting the local currency:
 * 
 * expression | localeCurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
 * 
 * where 'symbolDisplay' is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 
 * 
 * For example, to get the local currency, add in the template:
 * 
 * {{ b | localeCurrency:defaultLocale:currency:true:'1.2-2' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 *         ...
 *     }
 * 
 *     // Gets the default locale.
 *     get defaultLocale(): string {
 *
 *         return this.locale.getDefaultLocale();
 *      
 *     }
 * 
 *     // Gets the current currency.
 *     get currency(): string {
 *
 *         return this.locale.getCurrentCurrency();
 *      
 *     }
 * 
 * }
 * 
 * @author Roberto Simonetti
 * @see Angular 2 CurrencyPipe for further information
 */
export class LocaleCurrencyPipe implements PipeTransform {

    /**
     * LocaleCurrencyPipe transform method.
     * 
     * @param value The number to be localized
     * @param defaultLocale The default locale
     * @param currency The current currency
     * @param symbolDisplay Indicates whether to use the currency symbol
     * @param digits The format of the number
     * @return The locale currency
     */
    public transform(value: any,
        defaultLocale: string,
        currency: string,
        symbolDisplay: boolean = false,
        digits: string = null): string {

        // Checks for support for Intl.
        if (IntlSupport.NumberFormat(defaultLocale) == true) {

            var localeCurrency: CurrencyPipe = new CurrencyPipe(defaultLocale);

            return localeCurrency.transform(value, currency, symbolDisplay, digits);

        }

        // Returns the number without localization & currency.
        return value + " " + currency;

    }

}
