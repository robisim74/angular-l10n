import { Component, OnInit, Input, inject } from '@angular/core';

import { L10N_LOCALE } from 'angular-l10n';

import { convertCurrency, convertLength } from '../../conversions';

@Component({
    selector: 'app-pipe',
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss']
})
export class PipeComponent implements OnInit {

    @Input() today: number;
    @Input() timeAgo: string;

    convertCurrency = convertCurrency;
    convertLength = convertLength;

    locale = inject(L10N_LOCALE); // Alternative to inject in constructor

    ngOnInit() {
    }

}
