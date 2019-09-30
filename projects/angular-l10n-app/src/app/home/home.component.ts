import { Component, OnInit, Inject } from '@angular/core';

import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    today = Date.now();
    timeAgo = -0;
    value = Math.round(Math.random() * 1000000) / 100;

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }

    ngOnInit() {
        let i = 0;
        setInterval(() => {
            i++;
            this.timeAgo = i * (-1);
        }, 1000);
    }

}
