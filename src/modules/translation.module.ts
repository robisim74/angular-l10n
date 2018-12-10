import { NgModule, ModuleWithProviders } from '@angular/core';

import { InjectorRef } from '../models/injector-ref';
import { Logger } from '../models/logger';
import {
    LOCALE_CONFIG,
    TRANSLATION_CONFIG,
    L10N_LOGGER,
    LOCALIZED_ROUTING,
    LOCALE_INTERCEPTOR,
    L10nConfig,
    Token
} from '../models/l10n-config';
import { L10nLoader, LocaleLoader, TranslationLoader } from '../services/l10n-loader';
import { LocaleService } from '../services/locale.service';
import { LocaleStorage, L10nStorage } from '../services/locale-storage';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, L10nTranslationProvider } from '../services/translation-provider';
import { TranslationHandler, L10nTranslationHandler } from '../services/translation-handler';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslateDirective } from '../directives/translate.directive';

/**
 * Provides dependencies, pipes & directives for translating messages.
 */
@NgModule({
    declarations: [
        TranslatePipe,
        TranslateDirective
    ],
    exports: [
        TranslatePipe,
        TranslateDirective
    ]
})
export class TranslationModule {

    /**
     * Use in AppModule: new instances of LocaleService & TranslationService.
     */
    public static forRoot(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<TranslationModule> {
        return {
            ngModule: TranslationModule,
            providers: [
                InjectorRef,
                Logger,
                { provide: LOCALE_CONFIG, useValue: l10nConfig.locale || {} },
                { provide: TRANSLATION_CONFIG, useValue: l10nConfig.translation || {} },
                { provide: L10N_LOGGER, useValue: l10nConfig.logger || {} },
                { provide: LOCALIZED_ROUTING, useValue: l10nConfig.localizedRouting || {} },
                { provide: LOCALE_INTERCEPTOR, useValue: l10nConfig.localeInterceptor || {} },
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
    public static forChild(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<TranslationModule> {
        return {
            ngModule: TranslationModule,
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
