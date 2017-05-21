import { NgModule, ModuleWithProviders } from '@angular/core';

import { InjectorRef } from '../models/injector-ref';
import { LocaleConfig } from '../models/localization/locale-config';
import { LocaleService } from '../services/locale.service';
import { TranslationConfig } from '../models/translation/translation-config';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, HttpTranslationProvider } from '../services/translation-provider';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslateDirective } from '../directives/translate.directive';
import { Token } from '../models/types';

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
                TranslationConfig,
                TranslationService,
                {
                    provide: TranslationProvider,
                    useClass: token.translationProvider || HttpTranslationProvider
                }
            ]
        };
    }

    /**
     * Use in features modules with lazy loading: new instance of TranslationService.
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
                }
            ]
        };
    }

    constructor(public injector: InjectorRef) {
        // Creates the instance of the InjectorRef, so that module dependencies are available.
    }

}
