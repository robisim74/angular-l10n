/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Pipe, PipeTransform } from '@angular/core';
import { NumberFormatStyle } from '@angular/common/src/facade/intl';

// Services.
import { LocaleNumber } from '../services/locale-number';
import { IntlSupport } from '../services/Intl-support';

/**
 * 'localedecimal' pipe function.
 */
@Pipe({
    name: 'localedecimal',
    pure: true
})

/**
 * LocaleDecimalPipe class.
 * Localizes decimal numbers.
 * 
 * Getting the local decimal:
 * 
 * expression | localedecimal[:defaultLocale:[digitInfo]]
 * 
 * where 'expression' is a number and 'digitInfo' has the following format:
 * 
 * {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
 * 
 * For example, to get the local decimal, add in the template:
 * 
 * {{ pi | localedecimal:defaultLocale:'1.5-5' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 * import {LocaleDecimalPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *     ...
 *     pipes: [LocaleDecimalPipe]
 * })
 * 
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

            return LocaleNumber.format(LocaleDecimalPipe, defaultLocale, value, NumberFormatStyle.Decimal, digits);

        }

        // Returns the number without localization.
        return value;

    }

}

/**
 * 'localepercent' pipe function.
 */
@Pipe({
    name: 'localepercent',
    pure: true
})

/**
 * LocalePercentPipe class.
 * Localizes percent numbers.
 * 
 * Getting the local percentage:
 * 
 * expression | localepercent[:defaultLocale:[digitInfo]]
 * 
 * For example, to get the local percentage, add in the template:
 * 
 * {{ a | localepercent:defaultLocale:'1.1-1' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 * import {LocalePercentPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *     ...
 *     pipes: [LocalePercentPipe]
 * })
 * 
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

            return LocaleNumber.format(LocalePercentPipe, defaultLocale, value, NumberFormatStyle.Percent, digits);

        }

        // Returns the number without localization.
        return value;

    }

}

/**
 * 'localecurrency' pipe function.
 */
@Pipe({
    name: 'localecurrency',
    pure: true
})

/**
 * LocaleCurrencyPipe class.
 * Localizes currencies.
 * 
 * Getting the local currency:
 * 
 * expression | localecurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
 * 
 * where 'symbolDisplay' is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 
 * 
 * For example, to get the local currency, add in the template:
 * 
 * {{ b | localecurrency:defaultLocale:currency:true:'1.2-2' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 * import {LocaleCurrencyPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *     ...
 *     pipes: [LocaleCurrencyPipe]
 * })
 * 
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

            return LocaleNumber.format(LocaleCurrencyPipe, defaultLocale, value, NumberFormatStyle.Currency, digits, currency, symbolDisplay);

        }

        // Returns the number without localization & currency.
        return value + " " + currency;

    }

}
