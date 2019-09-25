import { NgModule, ModuleWithProviders } from '@angular/core';

import { L10nRoutingService } from '../services/l10n-routing.service';
import { L10nLoader, L10nRoutingLoader } from '../services/l10n-loader';

@NgModule() export class L10nRoutingModule {

    public static forRoot(): ModuleWithProviders<L10nRoutingModule> {
        return {
            ngModule: L10nRoutingModule,
            providers: [
                L10nRoutingService,
                { provide: L10nLoader, useClass: L10nRoutingLoader }
            ]
        };
    }

}
