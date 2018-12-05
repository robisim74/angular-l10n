import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalizedRouting } from '../models/localized-routing';
import { L10nLoader, initLocalizedRouting } from '../services/l10n-loader';
import { LocaleService } from '../services/locale.service';
import { TranslationService } from '../services/translation.service';

/**
 * Provides dependencies & components for SEO.
 */
@NgModule({
    declarations: [],
    exports: []
})
export class LocaleSeoModule {

    /**
     * Use in AppModule.
     */
    public static forRoot(): ModuleWithProviders<LocaleSeoModule> {
        return {
            ngModule: LocaleSeoModule,
            providers: [
                LocalizedRouting,
                {
                    provide: L10nLoader,
                    useFactory: initLocalizedRouting,
                    deps: [LocalizedRouting, LocaleService, TranslationService]
                }
            ]
        };
    }

}
