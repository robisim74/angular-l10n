import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocaleConfig } from '../models/localization/locale-config';
import { TranslationConfig } from '../models/translation/translation-config';
import { LocaleService } from '../services/locale.service';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslateDirective } from '../directives/translate.directive';

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
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: TranslationModule,
            providers: [
                LocaleConfig,
                TranslationConfig,
                LocaleService,
                TranslationService
            ]
        };
    }

    /**
     * Use in features modules with lazy loading: new instance of TranslationService.
     */
    public static forChild(): ModuleWithProviders {
        return {
            ngModule: TranslationModule,
            providers: [TranslationConfig, TranslationService]
        };
    }

}
