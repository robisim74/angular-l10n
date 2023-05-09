import { Component, OnInit, Input, Inject } from '@angular/core';
import { L10nLocale, L10N_LOCALE } from 'angular-l10n';

import { convertCurrency, convertLength } from '../../conversions';

@Component({
    selector: 'app-directive',
    templateUrl: './directive.component.html',
    styleUrls: ['./directive.component.scss'],
    host: { ngSkipHydration: 'true' }
})
export class DirectiveComponent implements OnInit {

    @Input() today: number;
    @Input() timeAgo: string;

    convertCurrency = convertCurrency;
    convertLength = convertLength;

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) {
    }

    ngOnInit() {
    }

}
