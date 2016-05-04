/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {isNumber, isPresent, isBlank, NumberWrapper, RegExpWrapper} from '@angular/common/src/facade/lang';
import {BaseException} from '@angular/common/src/facade/exceptions';
import {NumberFormatter, NumberFormatStyle} from '@angular/common/src/facade/intl';
import {InvalidPipeArgumentException} from '@angular/common/src/pipes/invalid_pipe_argument_exception';

// Services.
import {LocaleService} from '../services/locale.service';

/**
 * LocaleNumber superclass.
 */
@Injectable() export class LocaleNumber {

  constructor() { }

  static format(defaultLocale: string, value: number, style: NumberFormatStyle, digits: string, currency: string = null, currencyAsSymbol: boolean = false): string {

    if (isBlank(value)) return null;

    if (!isNumber(value)) {

      throw new InvalidPipeArgumentException(LocaleNumber, value);

    }

    var minInt = 1, minFraction = 0, maxFraction = 3;
    var re = RegExpWrapper.create('^(\\d+)?\\.((\\d+)(\\-(\\d+))?)?$');

    if (isPresent(digits)) {

      var parts = RegExpWrapper.firstMatch(re, digits);

      if (isBlank(parts)) {
        throw new BaseException(`${digits} is not a valid digit info for number pipes`);
      }
      if (isPresent(parts[1])) {  // Min integer digits.
        minInt = NumberWrapper.parseIntAutoRadix(parts[1]);
      }
      if (isPresent(parts[3])) {  // Min fraction digits.
        minFraction = NumberWrapper.parseIntAutoRadix(parts[3]);
      }
      if (isPresent(parts[5])) {  // Max fraction digits.
        maxFraction = NumberWrapper.parseIntAutoRadix(parts[5]);
      }

    }

    return NumberFormatter.format(value, defaultLocale, style, {
      minimumIntegerDigits: minInt,
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
      currency: currency,
      currencyAsSymbol: currencyAsSymbol
    });

  }
}

/**
 * 'localedecimal' pipe function.
 */
@Pipe({
  name: 'localedecimal',
  pure: false // Required to update the value.
})

/**
 * LocaleDecimalPipe class.
 * An instance of this class is created for each 'localedecimal' pipe function.
 * 
 * Getting the local decimal:
 * 
 * expression | localedecimal[:digitInfo]
 * 
 * where 'expression' is a number and 'digitInfo' has the following format:
 * 
 * {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
 * 
 * For example, to get the local decimal, add in the template:
 * 
 * {{ pi | localedecimal:'1.5-5' }}
 * 
 * and include LocaleDecimalPipe in the component:
 * 
 * import {LocaleDecimalPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *      ...
 *      pipes: [LocaleDecimalPipe]
 * })
 * 
 * @author Roberto Simonetti
 * @see Angular 2 DecimalPipe for further information
 */
@Injectable() export class LocaleDecimalPipe extends LocaleNumber implements PipeTransform {

  /**
   * The default locale for LocaleDecimalPipe.
   */
  private defaultLocale: string;

  /**
   * The value of LocaleDecimalPipe.
   */
  private value: any;

  /**
   * The locale decimal for the value.
   */
  private localeDecimal: string;

  constructor(public locale: LocaleService) {
    super();
  }

  /**
   * LocaleDecimalPipe transform method.
   * 
   * @param value The number to be localized
   * @param digits The format of the number
   * @return The locale decimal
   */
  transform(value: any, digits: string = null): string {

    // Updates the locale decimal for the value if:
    // - the value has changed;
    // - the locale decimal is empty;
    // - the default locale has changed.
    if (this.value != value || this.localeDecimal == "" || this.defaultLocale != this.locale.getDefaultLocale()) {

      // Updates the default locale for LocaleDecimalPipe.
      this.defaultLocale = this.locale.getDefaultLocale();
      // Updates the value of LocaleDecimalPipe.
      this.value = value;

      // Gets the locale decimal.
      this.localeDecimal = LocaleNumber.format(this.defaultLocale, value, NumberFormatStyle.Decimal, digits);

    }

    return this.localeDecimal;
  }
}

/**
 * 'localepercent' pipe function.
 */
@Pipe({
  name: 'localepercent',
  pure: false // Required to update the value.
})

/**
 * LocalePercentPipe class.
 * An instance of this class is created for each 'localepercent' pipe function.
 * 
 * Getting the local percentage:
 * 
 * expression | localepercent[:digitInfo]
 * 
 * For example, to get the local percentage, add in the template:
 * 
 * {{ a | localepercent:'1.1-1' }}
 * 
 * and include LocalePercentPipe in the component:
 * 
 * import {LocalePercentPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *      ...
 *      pipes: [LocalePercentPipe]
 * })
 * 
 * @author Roberto Simonetti
 * @see Angular 2 PercentPipe for further information
 */
@Injectable() export class LocalePercentPipe extends LocaleNumber implements PipeTransform {

  /**
   * The default locale for LocalePercentPipe.
   */
  private defaultLocale: string;

  /**
   * The value of LocalePercentPipe.
   */
  private value: any;

  /**
   * The locale percent for the value.
   */
  private localePercent: string;

  constructor(public locale: LocaleService) {
    super();
  }

  /**
   * LocalePercentPipe transform method.
   * 
   * @param value The number to be localized
   * @param digits The format of the number
   * @return The locale percent
   */
  transform(value: any, digits: string = null): string {

    // Updates the locale percent for the value if:
    // - the value has changed;
    // - the locale percent is empty;
    // - the default locale has changed.
    if (this.value != value || this.localePercent == "" || this.defaultLocale != this.locale.getDefaultLocale()) {

      // Updates the default locale for LocalePercentPipe.
      this.defaultLocale = this.locale.getDefaultLocale();
      // Updates the value of LocalePercentPipe.
      this.value = value;

      // Gets the locale percent.
      this.localePercent = LocaleNumber.format(this.defaultLocale, value, NumberFormatStyle.Percent, digits);

    }

    return this.localePercent;
  }
}

/**
 * 'localecurrency' pipe function.
 */
@Pipe({
  name: 'localecurrency',
  pure: false // Required to update the value.
})

/**
 * LocaleCurrencyPipe class.
 * An instance of this class is created for each 'localecurrency' pipe function.
 * 
 * Getting the local currency:
 * 
 * expression | localecurrency[:symbolDisplay[:digitInfo]]]
 * 
 * where 'symbolDisplay' is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 
 * 
 * For example, to get the local currency, add in the template:
 * 
 * {{ b | localecurrency:true:'1.2-2' }}
 * 
 * and include LocaleCurrencyPipe in the component:
 * 
 * import {LocaleCurrencyPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *      ...
 *      pipes: [LocaleCurrencyPipe]
 * })
 * 
 * @author Roberto Simonetti
 * @see Angular 2 CurrencyPipe for further information
 */
@Injectable() export class LocaleCurrencyPipe extends LocaleNumber implements PipeTransform {

  /**
   * The currency code for LocaleCurrencyPipe.
   */
  private currencyCode: string;

  /**
   * The default locale for LocaleCurrencyPipe.
   */
  private defaultLocale: string;

  /**
   * The value of LocaleCurrencyPipe.
   */
  private value: any;

  /**
   * The locale currency for the value.
   */
  private localeCurrency: string;

  constructor(public locale: LocaleService) {
    super();
  }

  /**
   * LocaleCurrencyPipe transform method.
   * 
   * @param value The number to be localized
   * @param symbolDisplay Indicates whether to use the currency symbol
   * @param digits The format of the number
   * @return The locale currency
   */
  transform(value: any, symbolDisplay: boolean = false, digits: string = null): string {

    // Updates the locale currency for the value if:
    // - the value has changed;
    // - the locale currency is empty;
    // - the currency code has changed;
    // - the default locale has changed.
    if (this.value != value
      || this.localeCurrency == ""
      || this.currencyCode != this.locale.getCurrentCurrency()
      || this.defaultLocale != this.locale.getDefaultLocale()) {

      // Updates the currency code for LocaleCurrencyPipe.
      this.currencyCode = this.locale.getCurrentCurrency();
      // Updates the default locale for LocaleCurrencyPipe.
      this.defaultLocale = this.locale.getDefaultLocale();
      // Updates the value of LocaleCurrencyPipe.
      this.value = value;

      // Gets the locale currency.
      this.localeCurrency = LocaleNumber.format(this.defaultLocale, value, NumberFormatStyle.Currency, digits, this.currencyCode, symbolDisplay);

    }

    return this.localeCurrency;
  }
}