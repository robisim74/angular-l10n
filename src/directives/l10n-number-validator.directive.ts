import { Directive, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidatorFn, ValidationErrors } from '@angular/forms';

import { LocaleValidation } from '../services/locale-validation';
import { InjectorRef } from '../models/injector-ref';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param digits An alias of the format
 * @param MIN_VALUE The minimum value for the number
 * @param MAX_VALUE The maximum value for the number
 * @return An error object: 'format', 'minValue' or 'maxValue'; null in case the value is valid
 */
export function l10nValidateNumber(
    digits: string,
    MIN_VALUE: number = Number.MIN_VALUE,
    MAX_VALUE: number = Number.MAX_VALUE
): ValidatorFn {
    const localeValidation: LocaleValidation = InjectorRef.get(LocaleValidation);

    return (c: AbstractControl): ValidationErrors | null => {
        if (c.value == "" || c.value == null) return null;

        const parsedValue: number | null = localeValidation.parseNumber(c.value, digits);
        if (parsedValue != null && !isNaN(parsedValue)) {
            if (parsedValue < MIN_VALUE) {
                return { minValue: true };
            } else if (parsedValue > MAX_VALUE) {
                return { maxValue: true };
            }
            return null; // The number is valid.
        } else {
            return { format: true };
        }
    };
}

@Directive({
    selector: '[l10nValidateNumber][ngModel],[l10nValidateNumber][formControl],[l10nValidateNumber][formControlName]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => L10nNumberValidatorDirective), multi: true }
    ]
})
export class L10nNumberValidatorDirective implements Validator, OnInit {

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
