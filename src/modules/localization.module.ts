import { NgModule, ModuleWithProviders } from '@angular/core';

import { InjectorRef } from '../models/injector-ref';
import { TranslationModule } from './translation.module';
import { LocaleConfig } from '../models/localization/locale-config';
import { LocaleService } from '../services/locale.service';
import { TranslationConfig } from '../models/translation/translation-config';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, HttpTranslationProvider } from '../services/translation-provider';
import { LocaleDatePipe } from '../pipes/locale-date.pipe';
import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from '../pipes/locale-number.pipe';
import { LocaleDateDirective } from '../directives/locale-date.directive';
import {
    LocaleDecimalDirective,
    LocalePercentDirective,
    LocaleCurrencyDirective
} from '../directives/locale-number.directive';
import { Token } from '../models/types';

@NgModule({
    declarations: [
        LocaleDatePipe,
        LocaleDecimalPipe,
        LocalePercentPipe,
        LocaleCurrencyPipe,
        LocaleDateDirective,
        LocaleDecimalDirective,
        LocalePercentDirective,
        LocaleCurrencyDirective
    ],
    imports: [
        TranslationModule
    ],
    exports: [
        TranslationModule,
        LocaleDatePipe,
        LocaleDecimalPipe,
        LocalePercentPipe,
        LocaleCurrencyPipe,
        LocaleDateDirective,
        LocaleDecimalDirective,
        LocalePercentDirective,
        LocaleCurrencyDirective
    ]
})
export class LocalizationModule {

    /**
     * Use in AppModule: new instances of LocaleService & TranslationService.
     */
    public static forRoot(token: Token = {}): ModuleWithProviders {
        return {
            ngModule: LocalizationModule,
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
            ngModule: LocalizationModule,
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
