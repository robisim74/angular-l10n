/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {NumberFormatStyle} from '@angular/common/src/facade/intl';

// Services.
import {LocaleNumber} from '../services/locale-number';
import {LocaleService} from '../services/locale.service';

/**
 * 'localedecimal' pipe function.
 */
@Pipe({
  name: 'localedecimal',
  pure: true
})

/**
 * LocaleDecimalPipe class.
 * 
 * Getting the local decimal:
 * 
 * expression | localedecimal[:defaultLocale:[digitInfo]]
 * 
 * where 'expression' is a number, 'defaultLocale' is the default locale and 'digitInfo' has the following format:
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
@Injectable() export class LocaleDecimalPipe extends LocaleNumber implements PipeTransform {

  constructor(public locale: LocaleService) {
    super();
  }

  /**
   * LocaleDecimalPipe transform method.
   * 
   * @param value The number to be localized
   * @param defaultLocale The default locale
   * @param digits The format of the number
   * @return The locale decimal
   */
  transform(value: any, defaultLocale: string, digits: string = null): string {

    return LocaleNumber.format(defaultLocale, value, NumberFormatStyle.Decimal, digits);

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
@Injectable() export class LocalePercentPipe extends LocaleNumber implements PipeTransform {

  constructor(public locale: LocaleService) {
    super();
  }

  /**
   * LocalePercentPipe transform method.
   * 
   * @param value The number to be localized
   * @param defaultLocale The default locale
   * @param digits The format of the number
   * @return The locale percent
   */
  transform(value: any, defaultLocale: string, digits: string = null): string {

    return LocaleNumber.format(defaultLocale, value, NumberFormatStyle.Percent, digits);

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
 * 
 * Getting the local currency:
 * 
 * expression | localecurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
 * 
 * where 'currency' is the current currency and 'symbolDisplay' is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 
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
@Injectable() export class LocaleCurrencyPipe extends LocaleNumber implements PipeTransform {

  constructor(public locale: LocaleService) {
    super();
  }

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
  transform(value: any,
    defaultLocale: string,
    currency: string,
    symbolDisplay: boolean = false,
    digits: string = null): string {

    return LocaleNumber.format(defaultLocale, value, NumberFormatStyle.Currency, digits, currency, symbolDisplay);

  }

}
