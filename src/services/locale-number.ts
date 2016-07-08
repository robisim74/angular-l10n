/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { NumberWrapper, RegExpWrapper, Type, isBlank, isNumber, isPresent } from '@angular/common/src/facade/lang';
import { BaseException } from '@angular/common/src/facade/exceptions';
import { NumberFormatStyle, NumberFormatter } from '@angular/common/src/facade/intl';
import { InvalidPipeArgumentException } from '@angular/common/src/pipes/invalid_pipe_argument_exception';

/**
 * LocaleNumber class.
 * Class to format numbers.
 */
export class LocaleNumber {

    public static format(pipe: Type, defaultLocale: string, value: number, style: NumberFormatStyle, digits: string, currency: string = null, currencyAsSymbol: boolean = false): string {

        if (isBlank(value)) { return null; }

        if (!isNumber(value)) {

            throw new InvalidPipeArgumentException(pipe, value);

        }

        var minInt: number = 1;
        var minFraction: number = 0;
        var maxFraction: number = 3;
        const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/g;

        if (isPresent(digits)) {

            var parts: RegExpExecArray = RegExpWrapper.firstMatch(NUMBER_FORMAT_REGEXP, digits);

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
