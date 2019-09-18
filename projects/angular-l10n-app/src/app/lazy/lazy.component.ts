import { Component, OnInit, Inject } from '@angular/core';

import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
    selector: 'app-lazy',
    templateUrl: './lazy.component.html',
    styleUrls: ['./lazy.component.scss']
})
export class LazyComponent implements OnInit {

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }

    ngOnInit() {
    }

}
