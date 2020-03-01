import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { L10nTranslationService } from './l10n-translation.service';

@Injectable({
    providedIn: 'root'
})
export class L10nResolver implements Resolve<Promise<void>> {

    constructor(private translation: L10nTranslationService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
        return this.translation.loadTranslation(route.data.l10nProviders);
    }
}
