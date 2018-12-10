import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslationModule } from './translation.module';
import { InjectorRef } from '../models/injector-ref';
import { Logger } from '../models/logger';
import {
    LOCALE_CONFIG,
    TRANSLATION_CONFIG,
    LOGGER_CONFIG,
    LOCALIZED_ROUTING_CONFIG,
    LOCALE_INTERCEPTOR_CONFIG,
    L10nConfig,
    Token
} from '../models/l10n-config';
import { L10nLoader, LocaleLoader, TranslationLoader } from '../services/l10n-loader';
import { LocaleService } from '../services/locale.service';
import { LocaleStorage, L10nStorage } from '../services/locale-storage';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, L10nTranslationProvider } from '../services/translation-provider';
import { TranslationHandler, L10nTranslationHandler } from '../services/translation-handler';
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
            providers: [
                InjectorRef,
                Logger,
                { provide: LOCALE_CONFIG, useValue: l10nConfig.locale || {} },
                { provide: TRANSLATION_CONFIG, useValue: l10nConfig.translation || {} },
                { provide: LOGGER_CONFIG, useValue: l10nConfig.logger || {} },
                { provide: LOCALIZED_ROUTING_CONFIG, useValue: l10nConfig.localizedRouting || {} },
                { provide: LOCALE_INTERCEPTOR_CONFIG, useValue: l10nConfig.localeInterceptor || {} },
                LocaleService,
                {
                    provide: LocaleStorage,
                    useClass: token.localeStorage || L10nStorage
                },
                TranslationService,
                {
                    provide: TranslationProvider,
                    useClass: token.translationProvider || L10nTranslationProvider
                },
                {
                    provide: TranslationHandler,
                    useClass: token.translationHandler || L10nTranslationHandler
                },
                { provide: L10nLoader, useClass: LocaleLoader }
            ]
        };
    }

    /**
     * Use in feature modules with lazy loading: new instance of TranslationService.
     */
    public static forChild(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<LocalizationModule> {
        return {
            ngModule: LocalizationModule,
            providers: [
                InjectorRef,
                { provide: TRANSLATION_CONFIG, useValue: l10nConfig.translation || {} },
                TranslationService,
                { provide: L10nLoader, useClass: TranslationLoader }
            ]
        };
    }

    constructor(private injector: InjectorRef, logger: Logger) { }

}
