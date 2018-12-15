import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocaleValidation } from '../services/locale-validation';

import { L10nNumberValidatorDirective } from '../directives/l10n-number-validator.directive';

/**
 * Provides dependencies & directives for validation by locales.
 */
@NgModule({
    declarations: [
        L10nNumberValidatorDirective
    ],
    exports: [
        L10nNumberValidatorDirective
    ]
})
export class LocaleValidationModule {

    /**
     * Use in AppModule: new instance of LocaleValidation.
     */
    public static forRoot(): ModuleWithProviders<LocaleValidationModule> {
        return {
            ngModule: LocaleValidationModule,
            providers: [LocaleValidation]
        };
    }

}
