import { Component, inject } from '@angular/core';

import { L10N_LOCALE } from 'angular-l10n';

@Component({
    selector: 'app-directive',
    templateUrl: './directive.component.html',
    styleUrls: ['./directive.component.scss'],
    host: { ngSkipHydration: 'true' }
})
export class DirectiveComponent {

    locale = inject(L10N_LOCALE);

    today = Date.now();

}
