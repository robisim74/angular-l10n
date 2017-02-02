import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslationModule } from './translation.module';
import { LocaleService } from '../services/locale.service';
import { TranslationService } from '../services/translation.service';
import { LocaleDatePipe } from '../pipes/locale-date.pipe';
import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from '../pipes/locale-number.pipe';
import { LocaleDateDirective } from '../directives/locale-date.directive';
import {
    LocaleDecimalDirective,
    LocalePercentDirective,
    LocaleCurrencyDirective
} from '../directives/locale-number.directive';

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
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: LocalizationModule,
            providers: [LocaleService, TranslationService]
        };
    }

    /**
     * Use in features modules with lazy loading: new instance of TranslationService.
     */
    public static forChild(): ModuleWithProviders {
        return {
            ngModule: LocalizationModule,
            providers: [TranslationService]
        };
    }

}
