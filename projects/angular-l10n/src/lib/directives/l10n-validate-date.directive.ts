import { Directive, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { L10nDateTimeFormatOptions } from '../models/types';
import { L10nValidation } from '../services/l10n-validation';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param validation The instance of L10nValidation service
 * @param options A L10n or Intl DateTimeFormatOptions object
 * @param minDate The minimum date
 * @param maxDate The maximum date
 * @return An error object: 'format', 'minDate' or 'maxDate'; null in case the date is valid
 */
export function l10nValidateDate(
    validation: L10nValidation,
    options?: L10nDateTimeFormatOptions,
    minDate?: Date,
    maxDate?: Date
): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
        if (c.value === '' || c.value == null) return null;

        const date = validation.parseDate(c.value, options);
        if (date != null) {
            if (minDate && date < minDate) {
                return { mindate: true };
            } else if (maxDate && date > maxDate) {
                return { maxDate: true };
            }
            return null; // The date is valid.
        } else {
            return { format: true };
        }
    };
}

@Directive({
    selector: '[l10nValidateDate][ngModel],[l10nValidateDate][formControl],[l10nValidateDate][formControlName]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => L10nValidateDateDirective), multi: true }
    ]
})
export class L10nValidateDateDirective implements Validator, OnInit {

    @Input() set l10nValidateDate(options: L10nDateTimeFormatOptions) {
        this.options = options;
    }

    @Input() public options: L10nDateTimeFormatOptions;

    @Input() public minDate: Date;
    @Input() public maxDate: Date;

    protected validator: ValidatorFn;

    constructor(protected validation: L10nValidation) { }

    public ngOnInit() {
        this.validator = l10nValidateDate(this.validation, this.options, this.minDate, this.maxDate);
    }

    public validate(c: AbstractControl): ValidationErrors | null {
        return this.validator(c);
    }

}
