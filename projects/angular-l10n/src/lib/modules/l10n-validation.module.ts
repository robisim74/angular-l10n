import { NgModule, ModuleWithProviders } from '@angular/core';

import { L10nValidateNumberDirective } from '../directives/l10n-validate-number.directive';
import { L10nValidateDateDirective } from '../directives/l10n-validate-date.directive';
import { L10nValidationToken } from '../models/l10n-config';
import { L10nValidation, L10nDefaultValidation } from '../services/l10n-validation';

@NgModule({
    declarations: [
        L10nValidateNumberDirective,
        L10nValidateDateDirective
    ],
    exports: [
        L10nValidateNumberDirective,
        L10nValidateDateDirective
    ]
})
export class L10nValidationModule {

    public static forRoot(token: L10nValidationToken = {}): ModuleWithProviders<L10nValidationModule> {
        return {
            ngModule: L10nValidationModule,
            providers: [
                { provide: L10nValidation, useClass: token.validation || L10nDefaultValidation }
            ]
        };
    }

}
