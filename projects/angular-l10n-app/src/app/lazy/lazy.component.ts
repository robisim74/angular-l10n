import { Component, OnInit, inject } from '@angular/core';

import { L10N_LOCALE, L10N_CONFIG, L10nTranslatePipe } from 'angular-l10n';

/**
 * Standalone sample
 */
@Component({
    selector: 'app-lazy',
    templateUrl: './lazy.component.html',
    styleUrls: ['./lazy.component.scss'],
    standalone: true,
    imports: [L10nTranslatePipe]
})
export class LazyComponent implements OnInit {

    locale = inject(L10N_LOCALE);
    config = inject(L10N_CONFIG);

    ngOnInit() {
        console.log(this.config.providers);
    }

}
