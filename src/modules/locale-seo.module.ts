import { NgModule, ModuleWithProviders } from '@angular/core';

import { L10nLoader, LocalizedRoutingLoader } from '../services/l10n-loader';
import { SearchService } from '../services/search.service';
import { LocalizedRouting } from '../models/localized-routing';

import { L10nJsonLdComponent } from '../components/l10n-json-ld.component';

/**
 * Provides dependencies & components for SEO by locales.
 */
@NgModule({
    declarations: [L10nJsonLdComponent],
    exports: [L10nJsonLdComponent]
})
export class LocaleSeoModule {

    public static forRoot(): ModuleWithProviders<LocaleSeoModule> {
        return {
            ngModule: LocaleSeoModule,
            providers: [
                LocalizedRouting,
                SearchService,
                { provide: L10nLoader, useClass: LocalizedRoutingLoader }
            ]
        };
    }

    public static forChild(): ModuleWithProviders<LocaleSeoModule> {
        return {
            ngModule: LocaleSeoModule,
            providers: [
                SearchService
            ]
        };
    }

}
