import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { L10nTranslationService } from '../services/l10n-translation.service';

export const l10nResolver: ResolveFn<void> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const translation = inject(L10nTranslationService);

    const providers = route.data['l10nProviders'];
    translation.addProviders(providers);

    await translation.loadTranslations(providers);
};
