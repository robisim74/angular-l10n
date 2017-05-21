import { NgModule, ModuleWithProviders } from '@angular/core';

import { DecimalCode } from '../models/validation/decimal-code';
import { LocaleValidation } from '../services/locale-validation';
import { LocaleNumberValidatorDirective } from '../directives/locale-number-validator.directive';

/**
 * Provides dependencies & directives for locale validation.
 */
@NgModule({
    declarations: [
        LocaleNumberValidatorDirective
    ],
    exports: [
        LocaleNumberValidatorDirective
    ]
})
export class LocaleValidationModule {

    /**
     * Use in AppModule: new instance of LocaleValidation.
     */
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: LocaleValidationModule,
            providers: [DecimalCode, LocaleValidation]
        };
    }

}
