import { NgModule, ModuleWithProviders } from '@angular/core';

import { InjectorRef } from '../models/injector-ref';
import { LocaleConfig } from '../models/localization/locale-config';
import { LocaleService } from '../services/locale.service';
import { LocaleStorage, BrowserStorage } from '../services/locale-storage';
import { TranslationConfig } from '../models/translation/translation-config';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, HttpTranslationProvider } from '../services/translation-provider';
import { TranslationHandler, DefaultTranslationHandler } from '../services/translation-handler';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslateDirective } from '../directives/translate.directive';
import { Token } from '../models/types';

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
    public static forRoot(token: Token = {}): ModuleWithProviders {
        return {
            ngModule: TranslationModule,
            providers: [
                InjectorRef,
                LocaleConfig,
                LocaleService,
                {
                    provide: LocaleStorage,
                    useClass: token.localeStorage || BrowserStorage
                },
                TranslationConfig,
                TranslationService,
                {
                    provide: TranslationProvider,
                    useClass: token.translationProvider || HttpTranslationProvider
                },
                {
                    provide: TranslationHandler,
                    useClass: token.translationHandler || DefaultTranslationHandler
                }
            ]
        };
    }

    /**
     * Use in feature modules with lazy loading: new instance of TranslationService.
     */
    public static forChild(token: Token = {}): ModuleWithProviders {
        return {
            ngModule: TranslationModule,
            providers: [
                InjectorRef,
                TranslationConfig,
                TranslationService,
                {
                    provide: TranslationProvider,
                    useClass: token.translationProvider || HttpTranslationProvider
                },
                {
                    provide: TranslationHandler,
                    useClass: token.translationHandler || DefaultTranslationHandler
                }
            ]
        };
    }

    constructor(private injector: InjectorRef) {
        // Creates the instance of the InjectorRef, so that module dependencies are available.
    }

}
