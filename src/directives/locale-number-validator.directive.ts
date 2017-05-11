import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

import { LocaleService } from '../services/locale.service';
import { LocaleValidation } from '../services/locale-validation';
import { InjectorRef } from '../models/injector-ref';
import { RegExpFactory } from '../models/validation/regexp-factory';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param digits The format of the number
 * @param MIN_VALUE The minimum value for the number
 * @param MAX_VALUE The maximum value for the number
 * @return An error object: 'format', 'minValue' or 'maxValue'; null in case the value is valid
 */
export function validateLocaleNumber(
    digits: string,
    MIN_VALUE: number = Number.MIN_VALUE,
    MAX_VALUE: number = Number.MAX_VALUE
): Function {

    const locale: LocaleService = InjectorRef.get(LocaleService);
    const localeValidation: LocaleValidation = InjectorRef.get(LocaleValidation);

    let defaultLocale: string;
    let NUMBER_REGEXP: RegExp;

    return (formControl: FormControl): { [key: string]: any } | null => {
        if (formControl.value == null || formControl.value == "") return null;

        if (defaultLocale != locale.getDefaultLocale()) {
            NUMBER_REGEXP = RegExpFactory.number(locale.getDefaultLocale(), digits);
            defaultLocale = locale.getDefaultLocale();
        }

        if (NUMBER_REGEXP.test(formControl.value)) {
            let parsedValue: number | null;
            parsedValue = localeValidation.parseNumber(formControl.value);
            if (parsedValue != null && parsedValue < MIN_VALUE) {
                return {
                    minValue: {
                        valid: false
                    }
                };
            } else if (parsedValue != null && parsedValue > MAX_VALUE) {
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
    selector: '[validateLocaleNumber][ngModel],[validateLocaleNumber][formControl]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => LocaleNumberValidatorDirective), multi: true }
    ]
})
export class LocaleNumberValidatorDirective implements Validator, OnInit {

    /**
     * Format: {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}.
     */
    @Input('validateLocaleNumber') public digits: string;

    @Input() set minValue(value: number) {
        this.MIN_VALUE = value || this.MIN_VALUE;
    }

    @Input() set maxValue(value: number) {
        this.MAX_VALUE = value || this.MAX_VALUE;
    }

    private MIN_VALUE: number = Number.MIN_VALUE;

    private MAX_VALUE: number = Number.MAX_VALUE;

    private validator: Function;

    public ngOnInit(): void {
        this.validator = validateLocaleNumber(this.digits, this.MIN_VALUE, this.MAX_VALUE);
    }

    public validate(formControl: FormControl): Function {
        return this.validator(formControl);
    }

}
