/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

// Services.
import { LocaleService } from '../services/locale.service';
import { LocaleParser } from '../services/locale-parser';

/**
 * Function that takes a Control and returns either null when it’s valid, or and error object if it’s not.
 * 
 * @param locale The reference to LocaleService
 * @param digits The format of the number
 * @param MIN_VALUE The minimum value for the number
 * @param MAX_VALUE The maximum value for the number
 * @return An error object: 'format', 'minValue' or 'maxValue'; null in case the value is valid
 */
export function validateLocaleNumber(locale: LocaleService, digits: string, MIN_VALUE: number = Number.MIN_VALUE, MAX_VALUE: number = Number.MAX_VALUE): Function {

    var defaultLocale: string;
    var NUMBER_REGEXP: RegExp;

    return (c: FormControl): { [key: string]: any } => {

        // Checks if the default locale has changed. 
        if (defaultLocale != locale.getDefaultLocale()) {

            NUMBER_REGEXP = LocaleParser.NumberRegExpFactory(locale.getDefaultLocale(), digits);
            defaultLocale = locale.getDefaultLocale();

        }

        // Checks the format.
        if (NUMBER_REGEXP.test(c.value)) {

            var parsedValue: number;

            parsedValue = LocaleParser.Number(c.value, locale.getDefaultLocale());

            if (parsedValue < MIN_VALUE) {

                return {
                    minValue: {
                        valid: false
                    }
                };

            } else if (parsedValue > MAX_VALUE) {

                return {
                    maxValue: {
                        valid: false
                    }
                };

            }

            return null; // The number is valid.

        } else {

            return {
                format: {
                    valid: false
                }
            };

        }

    };

}

@Directive({
    selector: '[validateLocaleNumber][ngModel],[validateLocaleNumber][formControl]', // Validator works with ngModel and formControl directives.
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => LocaleNumberValidator), multi: true }
    ]
})

/**
 * LocaleNumberValidator class.
 * Validates a number by default locale.
 * 
 * @author Roberto Simonetti
 */
export class LocaleNumberValidator implements Validator, OnInit {

    /**
     * Format: {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}.
     */
    @Input('validateLocaleNumber') digits: string;

    @Input() set minValue(value: number) {

        this.MIN_VALUE = value || this.MIN_VALUE;

    }

    @Input() set maxValue(value: number) {

        this.MAX_VALUE = value || this.MAX_VALUE;

    }

    private MIN_VALUE: number = Number.MIN_VALUE;

    private MAX_VALUE: number = Number.MAX_VALUE;

    private validator: Function;

    constructor(public locale: LocaleService) { }

    ngOnInit(): void {

        this.validator = validateLocaleNumber(this.locale, this.digits, this.MIN_VALUE, this.MAX_VALUE);

    }

    public validate(c: FormControl): Function {

        return this.validator(c);

    }

}
