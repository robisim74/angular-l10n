import { Directive, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { L10nValidation } from '../services/l10n-validation';

/**
 * Function that takes a control and returns either null when it’s valid, or an error object if it’s not.
 * @param validation The instance of L10nValidation service
 * @param options A L10n or Intl DateTimeFormatOptions object
 * @return An error object: 'format'; null in case the value is valid
 */
export function l10nValidateDate(validation: L10nValidation, options?: any): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
        if (c.value === '' || c.value == null) return null;

        const value = validation.parseDate(c.value, options);
        if (value != null) {
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

    @Input() set l10nValidateDate(options: any) {
        this.options = options;
    }

    @Input() public options: any;

    protected validator: ValidatorFn;

    constructor(protected validation: L10nValidation) { }

    public ngOnInit() {
        this.validator = l10nValidateDate(this.validation, this.options);
    }

    public validate(c: AbstractControl): ValidationErrors | null {
        return this.validator(c);
    }

}
