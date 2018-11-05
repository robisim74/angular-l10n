import { NgModule, ModuleWithProviders } from '@angular/core';

import { InjectorRef } from '../models/injector-ref';
import { LOCALE_CONFIG, TRANSLATION_CONFIG, L10nConfig, Token } from '../models/l10n-config';
import { L10nLoader } from '../services/l10n-loader';
import { LocaleService } from '../services/locale.service';
import { LocaleStorage, BrowserStorage } from '../services/locale-storage';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, HttpTranslationProvider } from '../services/translation-provider';
import { TranslationHandler, DefaultTranslationHandler } from '../services/translation-handler';
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
                { provide: LOCALE_CONFIG, useValue: l10nConfig.locale || {} },
                { provide: TRANSLATION_CONFIG, useValue: l10nConfig.translation || {} },
                LocaleService,
                {
                    provide: LocaleStorage,
                    useClass: token.localeStorage || BrowserStorage
                },
                TranslationService,
                {
                    provide: TranslationProvider,
                    useClass: token.translationProvider || HttpTranslationProvider
                },
                {
                    provide: TranslationHandler,
                    useClass: token.translationHandler || DefaultTranslationHandler
                },
                L10nLoader
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
                L10nLoader
            ]
        };
    }

    constructor(private injector: InjectorRef) {
        // Creates the instance of the InjectorRef, so that module dependencies are available.
    }

}
