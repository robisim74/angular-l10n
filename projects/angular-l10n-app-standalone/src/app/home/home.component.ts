import { Component, OnInit, Inject } from '@angular/core';

import { L10N_LOCALE, L10nLocale, L10nTranslatePipe } from 'angular-l10n';

import { PipeComponent } from './pipe/pipe.component';
import { DirectiveComponent } from './directive/directive.component';
import { ApiComponent } from './api/api.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        L10nTranslatePipe,
        PipeComponent,
        DirectiveComponent,
        ApiComponent
    ]
})
export class HomeComponent implements OnInit {

    count = 0;

    today = Date.now();
    timeAgo = '-0';

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }

    ngOnInit() {
        if (typeof window !== 'undefined') {
            setInterval(() => {
                this.timeAgo = `-${++this.count}`;
            }, 1000);
        }
    }

}
