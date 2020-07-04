import { Directive, forwardRef, OnInit, Input, OnChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { L10nDateTimeFormatOptions } from '../models/types';
import { L10nValidation } from '../services/l10n-validation';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param validation The instance of L10nValidation service
 * @param options A L10n or Intl DateTimeFormatOptions object
 * @param minDate The minimum date
 * @param maxDate The maximum date
 * @param language The current language
 * @return An error object: 'format', 'minDate' or 'maxDate'; null in case the date is valid
 */
export function l10nValidateDate(
    validation: L10nValidation,
    options?: L10nDateTimeFormatOptions,
    minDate?: Date,
    maxDate?: Date,
    language?: string
): ValidatorFn {
    const validator = (c: AbstractControl): ValidationErrors | null => {
        if (c.value === '' || c.value == null) return null;

        const date = validation.parseDate(c.value, options, language);
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
    return validator;
}

@Directive({
    selector: '[l10nValidateDate][ngModel],[l10nValidateDate][formControl],[l10nValidateDate][formControlName]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => L10nValidateDateDirective), multi: true }
    ]
})
export class L10nValidateDateDirective implements Validator, OnInit, OnChanges {

    @Input() set l10nValidateDate(options: any) {
        this.options = options;
    }

    @Input() public options: any;

    @Input() public minDate: Date;
    @Input() public maxDate: Date;

    @Input() public language: string;

    protected validator: ValidatorFn;

    constructor(protected validation: L10nValidation) { }

    public ngOnInit() {
        this.validator = l10nValidateDate(this.validation, this.options, this.minDate, this.maxDate, this.language);
    }

    public ngOnChanges() {
        this.validator = l10nValidateDate(this.validation, this.options, this.minDate, this.maxDate, this.language);
    }

    public validate(c: AbstractControl): ValidationErrors | null {
        return this.validator(c);
    }

}
