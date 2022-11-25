import { Component, OnInit, Input, inject } from '@angular/core';

import {
    L10nDatePipe,
    L10nNumberPipe,
    L10nPluralPipe,
    L10nTimeAgoPipe,
    L10nTranslatePipe,
    L10N_LOCALE
} from 'angular-l10n';

import { convertCurrency, convertLength } from '../../conversions';

/**
 * Standalone sample
 */
@Component({
    selector: 'app-pipe',
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss'],
    standalone: true,
    imports: [
        L10nTranslatePipe,
        L10nPluralPipe,
        L10nDatePipe,
        L10nTimeAgoPipe,
        L10nNumberPipe
    ]
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
