import { Component, inject } from '@angular/core';

import { L10N_LOCALE } from 'angular-l10n';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    locale = inject(L10N_LOCALE);

}
