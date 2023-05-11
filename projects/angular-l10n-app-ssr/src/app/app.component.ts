import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { L10N_CONFIG, L10nConfig, L10N_LOCALE, L10nLocale, L10nTranslationService } from 'angular-l10n';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    /**
     * Handle page back/forward
     */
    @HostListener('window:popstate', ['$event'])
    onPopState() {
        this.translation.init();
    }

    schema = this.config.schema;

    pathLang = this.getPathLang();

    constructor(
        @Inject(L10N_LOCALE) public locale: L10nLocale,
        @Inject(L10N_CONFIG) private config: L10nConfig,
        private translation: L10nTranslationService,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        // Update path language
        this.translation.onChange().subscribe({
            next: () => {
                this.pathLang = this.getPathLang();
            }
        });
    }

    /**
     * Replace the locale and navigate to the new URL
     */
    navigateByLocale(locale: L10nLocale) {
        let path = this.location.path();
        if (this.locale.language !== this.config.defaultLocale.language) {
            if (locale.language !== this.config.defaultLocale.language) {
                path = path.replace(`/${this.locale.language}`, `/${locale.language}`);
            } else {
                path = path.replace(`/${this.locale.language}`, '');
            }
        } else if (locale.language !== this.config.defaultLocale.language) {
            path = `/${locale.language}${path}`;
        }

        this.router.navigate([path]).then(() => {
            this.translation.init();
        });
    }

    getPathLang() {
        return this.locale.language !== this.config.defaultLocale.language ?
            this.locale.language :
            '';
    }
}
