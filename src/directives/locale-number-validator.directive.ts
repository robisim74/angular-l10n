/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Directive, provide, forwardRef, Input, OnInit} from '@angular/core';
import {NG_VALIDATORS, Control, Validator} from '@angular/common';

// Services.
import {LocaleService} from '../services/locale.service';
import {LocaleParser} from '../services/locale-parser';

/**
 * Function that takes a Control and returns either null when it’s valid, or and error object if it’s not.
 * 
 * @param locale The reference to LocaleService
 * @param digits The format of the number
 * @param MIN_VALUE The minimum value for the number
 * @param MAX_VALUE The maximum value for the number
 * @return An error object: 'format', 'minValue' or 'maxValue'; null in case the value is valid
 */
export function validateLocaleNumber(locale: LocaleService, digits: string, MIN_VALUE: number = Number.MIN_VALUE, MAX_VALUE: number = Number.MAX_VALUE) {

    var defaultLocale: string;
    var NUMBER_REGEXP: RegExp;

    return (c: Control): { [key: string]: any } => {

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

                return { minValue: false };

            }

            else if (parsedValue > MAX_VALUE) {

                return { maxValue: false };

            }

            return null; // The number is valid.

        } else {

            return { format: false };

        }

    };

}

@Directive({
    selector: '[validateLocaleNumber][ngControl],[validateLocaleNumber][ngModel],[validateLocaleNumber][ngFormControl]', // Validator works with ngControl, ngModel or ngFormControl directives.
    providers: [
        provide(NG_VALIDATORS, {
            useExisting: forwardRef(() => LocaleNumberValidator),
            multi: true
        })
    ]
})

/**
 * LocaleNumberValidator class.
 * 
 * @author Roberto Simonetti
 */
export class LocaleNumberValidator implements Validator, OnInit {

    private MIN_VALUE: number = Number.MIN_VALUE;

    private MAX_VALUE: number = Number.MAX_VALUE;

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

    private validator: Function;

    constructor(public locale: LocaleService) { }

    ngOnInit() {

        this.validator = validateLocaleNumber(this.locale, this.digits, this.MIN_VALUE, this.MAX_VALUE);

    }

    validate(c: Control): Function {

        return this.validator(c);

    }

}

