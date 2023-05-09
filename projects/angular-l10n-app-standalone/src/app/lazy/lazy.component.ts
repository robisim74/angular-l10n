import { Component, OnInit, Inject } from '@angular/core';

import { L10N_LOCALE, L10nLocale, L10N_CONFIG, L10nConfig, L10nTranslatePipe } from 'angular-l10n';

/**
 * Standalone sample
 */
@Component({
    selector: 'app-lazy',
    templateUrl: './lazy.component.html',
    styleUrls: ['./lazy.component.scss'],
    standalone: true,
    imports: [
        L10nTranslatePipe
    ]
})
export class LazyComponent implements OnInit {

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale, @Inject(L10N_CONFIG) private l10nConfig: L10nConfig) { }

    ngOnInit() {
        console.log(this.l10nConfig.providers);
    }

}
