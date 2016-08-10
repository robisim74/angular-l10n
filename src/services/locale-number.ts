/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { NumberFormatStyle, NumberFormatter } from '@angular/common/src/facade/intl';
import { NumberWrapper, Type, isBlank, isNumber, isPresent, isString } from '@angular/common/src/facade/lang';
import { InvalidPipeArgumentException } from '@angular/common/src/pipes/invalid_pipe_argument_exception';

/**
 * LocaleNumber class.
 * Class to format numbers.
 */
export class LocaleNumber {

    public static format(pipe: Type, defaultLocale: string, value: number | string, style: NumberFormatStyle, digits: string, currency: string = null, currencyAsSymbol: boolean = false): string {

        if (isBlank(value)) { return null; }

        // Converts strings to numbers.
        value = isString(value) && NumberWrapper.isNumeric(value) ? +value : value;

        if (!isNumber(value)) {

            throw new InvalidPipeArgumentException(pipe, value);

        }

        let minInt: number;
        let minFraction: number;
        let maxFraction: number;
        if (style !== NumberFormatStyle.Currency) {
            // Relies on Intl default for currency.
            minInt = 1;
            minFraction = 0;
            maxFraction = 3;
        }

        const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;

        if (isPresent(digits)) {

            var parts: RegExpMatchArray = digits.match(NUMBER_FORMAT_REGEXP);

            if (parts === null) {
                throw new Error(`${digits} is not a valid digit info for number pipes`);
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

        return NumberFormatter.format(value as number, defaultLocale, style, {
            minimumIntegerDigits: minInt,
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            currency: currency,
            currencyAsSymbol: currencyAsSymbol
        });

    }

}
