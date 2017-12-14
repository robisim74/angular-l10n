import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

import { LocaleService } from '../services/locale.service';
import { DecimalCode } from '../models/decimal-code';
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
): Function {

    const locale: LocaleService = InjectorRef.get(LocaleService);
    const decimalCode: DecimalCode = InjectorRef.get(DecimalCode);

    let defaultLocale: string;
    let NUMBER_REGEXP: RegExp;

    return (formControl: FormControl): { [key: string]: any } | null => {
        if (formControl.value == null || formControl.value == "") return null;

        if (defaultLocale != locale.getDefaultLocale()) {
            NUMBER_REGEXP = decimalCode.getRegExp(digits);
            defaultLocale = locale.getDefaultLocale();
        }

        if (NUMBER_REGEXP.test(formControl.value)) {
            const parsedValue: number = decimalCode.parse(formControl.value);
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
    selector: '[l10nValidateNumber][ngModel],[l10nValidateNumber][formControl]',
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

    private validator: Function;

    public ngOnInit(): void {
        this.validator = l10nValidateNumber(
            this.digits,
            this.minValue || this.MIN_VALUE,
            this.maxValue || this.MAX_VALUE
        );
    }

    public validate(formControl: FormControl): Function {
        return this.validator(formControl);
    }

}
