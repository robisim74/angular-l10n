import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { L10nTranslationService } from './l10n-translation.service';

@Injectable({
    providedIn: 'root'
})
export class L10nResolver  {

    constructor(private translation: L10nTranslationService) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
        const providers = route.data['l10nProviders'];
        this.translation.addProviders(providers);

        await this.translation.init(providers);
    }
}
