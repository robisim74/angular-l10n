import { NgModule, ModuleWithProviders } from '@angular/core';

import { L10nRoutingToken } from '../models/l10n-config';
import { L10nRoutingService } from '../services/l10n-routing.service';
import { L10nLoader, L10nRoutingLoader } from '../services/l10n-loader';
import { L10nLocation, L10nDefaultLocation } from '../services/l10n-location';

@NgModule({})
export class L10nRoutingModule {

    public static forRoot(token: L10nRoutingToken = {}): ModuleWithProviders<L10nRoutingModule> {
        return {
            ngModule: L10nRoutingModule,
            providers: [
                L10nRoutingService,
                { provide: L10nLocation, useClass: token.location || L10nDefaultLocation },
                { provide: L10nLoader, useClass: L10nRoutingLoader }
            ]
        };
    }

}
