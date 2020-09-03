import { Injectable, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

import { L10nLocale } from '../models/types';
import { L10N_CONFIG, L10nConfig, L10N_LOCALE } from '../models/l10n-config';
import { formatLanguage } from '../models/utils';
import { L10nTranslationService } from './l10n-translation.service';
import { L10nLocation } from './l10n-location';

@Injectable() export class L10nRoutingService {

    private get router(): Router {
        return this.injector.get(Router);
    }

    private get location(): Location {
        return this.injector.get(Location);
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(L10N_CONFIG) private config: L10nConfig,
        @Inject(L10N_LOCALE) private locale: L10nLocale,
        private translation: L10nTranslationService,
        private l10nLocation: L10nLocation,
        private injector: Injector
    ) { }

    public async init(): Promise<void> {
        // Parses the url to find the language when a navigation starts.
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationStart)
        ).subscribe({
            next: (event: NavigationStart) => {
                // Skips location change on pop state event and on first navigation.
                this.redirectToPath(event.url, event.navigationTrigger === 'popstate' || event.id === 1);
            }
        });

        // Replaces url when a navigation ends.
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ).subscribe({
            next: (event: NavigationEnd) => {
                const url = (event.url && event.url !== '/' && event.url === event.urlAfterRedirects) ?
                    event.url :
                    event.urlAfterRedirects;
                this.replacePath(this.locale, url);
            }
        });

        if (isPlatformBrowser(this.platformId)) {
            // Replaces url when locale changes.
            this.translation.onChange().subscribe({
                next: (locale: L10nLocale) => this.replacePath(locale)
            });
        }
    }

    /**
     * Removes the language from the path and navigates.
     * @param path Localized path
     * @param skipLocationChange When true, navigates without pushing a new state into history
     */
    private redirectToPath(path: string, skipLocationChange: boolean): void {
        const segment = this.l10nLocation.getLocalizedSegment(path);
        if (segment != null) {
            const url = path.replace(segment, '/');
            // navigateByUrl keeps the query params.
            this.router.navigateByUrl(url, { skipLocationChange });
        }
    }

    /**
     * Replaces the path with the language without pushing a new state into history.
     * @param locale The current locale
     * @param path The path to be replaced
     */
    private replacePath(locale: L10nLocale, path?: string): void {
        if (locale.language === '') return;

        const language = formatLanguage(locale.language, this.config.format);
        if (path) {
            if (!this.isDefaultRouting()) {
                this.location.replaceState(this.l10nLocation.toLocalizedPath(language, path));
            }
        } else {
            path = this.l10nLocation.path();
            const segment = this.l10nLocation.getLocalizedSegment(path);
            if (segment != null) {
                path = path.replace(segment, '/');

                if (this.isDefaultRouting()) {
                    this.location.replaceState(path);
                }
            }
            if (!this.isDefaultRouting()) {
                this.location.replaceState(this.l10nLocation.toLocalizedPath(language, path));
            }
        }
    }

    private isDefaultRouting(): boolean {
        if (!this.config.defaultRouting) return false;

        return formatLanguage(this.locale.language, this.config.format) ===
            formatLanguage(this.config.defaultLocale.language, this.config.format);
    }

}
