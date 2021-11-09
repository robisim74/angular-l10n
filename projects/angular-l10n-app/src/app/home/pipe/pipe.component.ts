import { Component, OnInit, Inject, Input } from '@angular/core';

import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

import { convertCurrency } from '../../conversions';

@Component({
    selector: 'app-pipe',
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss']
})
export class PipeComponent implements OnInit {

    @Input() today: number;
    @Input() timeAgo: string;
    @Input() value: number;

    convertCurrency = convertCurrency;

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }

    ngOnInit() {
    }

}
