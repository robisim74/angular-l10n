import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalizedRouting } from '../models/localized-routing';
import { L10nLoader, LocalizedRoutingLoader } from '../services/l10n-loader';

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
                { provide: L10nLoader, useClass: LocalizedRoutingLoader }
            ]
        };
    }

}
