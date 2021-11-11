import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import { L10nTranslationService, L10nIntlService, L10nLocale } from 'angular-l10n';

import { convertCurrency, convertLength } from '../../conversions';

@Component({
    selector: 'app-api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit, OnChanges {

    @Input() today: number;
    @Input() timeAgo: string;

    greeting: string;
    whoIAm: string;
    description: string;

    formattedToday: string;
    formattedTimeAgo: string;
    formattedValue: string;
    formattedLength: string;
    formattedOnePlural: string;
    formattedOtherPlural: string;

    constructor(
        private translation: L10nTranslationService,
        private intl: L10nIntlService
    ) { }

    ngOnInit() {
        this.translation.onChange().subscribe({
            next: (locale: L10nLocale) => {
                this.greeting = this.translation.translate('home.greeting');
                this.whoIAm = this.translation.translate('home.whoIAm', { name: 'Angular l10n' });
                this.description = this.translation.translate('home.description');

                this.formattedToday = this.intl.formatDate(this.today, { dateStyle: 'full', timeStyle: 'short' });
                this.formattedTimeAgo = this.intl.formatRelativeTime(this.timeAgo, 'second', { numeric: 'always', style: 'long' });
                this.formattedValue = this.intl.formatNumber(
                    1000,
                    { digits: '1.2-2', style: 'currency' },
                    undefined,
                    undefined,
                    convertCurrency,
                    { rate: 1.16 }
                );
                this.formattedLength = this.intl.formatNumber(
                    1,
                    { digits: '1.0-2', style: 'unit', unit: locale.units['length'] },
                    undefined,
                    undefined,
                    convertLength
                );
                this.formattedOnePlural = this.intl.plural(1, 'home.devs', { type: 'cardinal' });
                this.formattedOtherPlural = this.intl.plural(2, 'home.devs', { type: 'cardinal' });
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.formattedTimeAgo = this.intl.formatRelativeTime(changes['timeAgo']['currentValue'], 'second', { numeric: 'always', style: 'long' });
    }

}
