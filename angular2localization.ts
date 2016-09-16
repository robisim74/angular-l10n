// Exports services, pipes & directives.
export { LocalizationService, ServiceState, LoadingMode } from './src/services/localization.service';
export { LocaleService } from './src/services/locale.service';
export { Locale } from './src/services/locale';
export { IntlSupport } from './src/services/Intl-support';
export { LocaleParser, NumberCode } from './src/services/locale-parser';
export { TranslatePipe } from './src/pipes/translate.pipe';
export { LocaleDatePipe } from './src/pipes/locale-date.pipe';
export { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from './src/pipes/locale-number.pipe';
export { LocaleNumberValidator, validateLocaleNumber } from './src/directives/locale-number-validator.directive';

// Modules.
import { NgModule, ModuleWithProviders } from '@angular/core';
// Services.
import { LocaleService } from './src/services/locale.service';
import { LocalizationService } from './src/services/localization.service';
// Pipes.
import { TranslatePipe } from './src/pipes/translate.pipe';
import { LocaleDatePipe } from './src/pipes/locale-date.pipe';
import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from './src/pipes/locale-number.pipe';
// Directives.
import { LocaleNumberValidator } from './src/directives/locale-number-validator.directive';

@NgModule({
    declarations: [
        LocaleDatePipe,
        LocaleDecimalPipe,
        LocalePercentPipe,
        LocaleCurrencyPipe,
        LocaleNumberValidator
    ],
    exports: [
        LocaleDatePipe,
        LocaleDecimalPipe,
        LocalePercentPipe,
        LocaleCurrencyPipe,
        LocaleNumberValidator
    ]
})

export class LocaleModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LocaleModule,
            providers: [LocaleService]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: LocaleModule,
            providers: [LocaleService]
        };
    }

}

@NgModule({
    declarations: [
        TranslatePipe
    ],
    exports: [
        TranslatePipe
    ]
})

export class LocalizationModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LocalizationModule,
            providers: [LocalizationService]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: LocalizationModule,
            providers: [LocalizationService]
        };
    }

}
