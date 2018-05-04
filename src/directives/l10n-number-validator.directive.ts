import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidatorFn, ValidationErrors } from '@angular/forms';

import { LocaleService } from '../services/locale.service';
import { LocaleValidation } from '../services/locale-validation';
import { InjectorRef } from '../models/injector-ref';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param digits The format of the number
 * @param MIN_VALUE The minimum value for the number
 * @param MAX_VALUE The maximum value for the number
 * @return An error object: 'format', 'minValue' or 'maxValue'; null in case the value is valid
 */
export function l10nValidateNumber(
    digits: string,
    MIN_VALUE: number = Number.MIN_VALUE,
    MAX_VALUE: number = Number.MAX_VALUE
): ValidatorFn {

    const locale: LocaleService = InjectorRef.get(LocaleService);
    const localeValidation: LocaleValidation = InjectorRef.get(LocaleValidation);

    let defaultLocale: string;
    let NUMBER_REGEXP: RegExp;

    return (c: AbstractControl): ValidationErrors | null => {
        if (c.value == null || c.value == "") return null;

        if (defaultLocale != locale.getDefaultLocale()) {
            NUMBER_REGEXP = localeValidation.getRegExp(digits);
            defaultLocale = locale.getDefaultLocale();
        }

        if (NUMBER_REGEXP.test(c.value)) {
            const parsedValue: number | null = localeValidation.parseNumber(c.value);
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
    selector: '[l10nValidateNumber][ngModel],[l10nValidateNumber][c]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => L10nNumberValidatorDirective), multi: true }
    ]
})
export class L10nNumberValidatorDirective implements Validator, OnInit {

    /**
     * Format: {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}.
     */
    @Input() set l10nValidateNumber(digits: string) {
        this.digits = digits;
    }

    @Input() public digits: string;

    @Input() public minValue: number;
    @Input() public maxValue: number;

    private readonly MIN_VALUE: number = Number.MIN_VALUE;
    private readonly MAX_VALUE: number = Number.MAX_VALUE;

    private validator: ValidatorFn;

    public ngOnInit(): void {
        this.validator = l10nValidateNumber(
            this.digits,
            this.minValue || this.MIN_VALUE,
            this.maxValue || this.MAX_VALUE
        );
    }

    public validate(c: AbstractControl): ValidationErrors | null {
        return this.validator(c);
    }

}
