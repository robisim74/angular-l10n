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

// Exports services, pipes & directives.
export * from './src/services/localization.service';
export * from './src/services/locale.service';
export * from './src/services/locale';
export * from './src/services/Intl-support';
export * from './src/services/locale-parser';
export * from './src/pipes/translate.pipe';
export * from './src/pipes/locale-date.pipe';
export * from './src/pipes/locale-number.pipe';
export * from './src/directives/locale-number-validator.directive';

// Modules.
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
