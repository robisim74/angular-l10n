import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalizedRouting } from '../models/localized-routing';
import { L10nLoader, LocalizedRoutingLoader } from '../services/l10n-loader';
import { L10nJsonLdComponent } from '../components/l10n-json-ld.component';

/**
 * Provides dependencies & components for SEO by locales.
 */
@NgModule({
    declarations: [L10nJsonLdComponent],
    exports: [L10nJsonLdComponent]
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
