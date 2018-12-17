import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslationModule, provideRoot, provideChild } from './translation.module';
import { InjectorRef } from '../models/injector-ref';
import { Logger } from '../models/logger';
import { L10nConfig, Token } from '../models/l10n-config';

import { L10nDatePipe } from '../pipes/l10n-date.pipe';
import { L10nDecimalPipe, L10nPercentPipe, L10nCurrencyPipe } from '../pipes/l10n-number.pipe';
import { L10nDateDirective } from '../directives/l10n-date.directive';
import {
    L10nDecimalDirective,
    L10nPercentDirective,
    L10nCurrencyDirective
} from '../directives/l10n-number.directive';

/**
 * Provides dependencies, pipes & directives for translating messages, dates & numbers.
 */
@NgModule({
    declarations: [
        L10nDatePipe,
        L10nDecimalPipe,
        L10nPercentPipe,
        L10nCurrencyPipe,
        L10nDateDirective,
        L10nDecimalDirective,
        L10nPercentDirective,
        L10nCurrencyDirective
    ],
    imports: [
        TranslationModule
    ],
    exports: [
        TranslationModule,
        L10nDatePipe,
        L10nDecimalPipe,
        L10nPercentPipe,
        L10nCurrencyPipe,
        L10nDateDirective,
        L10nDecimalDirective,
        L10nPercentDirective,
        L10nCurrencyDirective
    ]
})
export class LocalizationModule {

    /**
     * Use in AppModule: new instances of LocaleService & TranslationService.
     */
    public static forRoot(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<LocalizationModule> {
        return {
            ngModule: LocalizationModule,
            providers: provideRoot(l10nConfig, token)
        };
    }

    /**
     * Use in feature modules with lazy loading: new instance of TranslationService.
     */
    public static forChild(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<LocalizationModule> {
        return {
            ngModule: LocalizationModule,
            providers: provideChild(l10nConfig, token)
        };
    }

    constructor(private injector: InjectorRef, private logger: Logger) { }

}
