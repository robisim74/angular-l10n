import { Injectable, Inject, Injector } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

import { L10nLocale } from '../models/types';
import { L10N_CONFIG, L10nConfig, L10N_LOCALE } from '../models/l10n-config';
import { formatLanguage, getSchema } from '../models/utils';
import { L10nTranslationService } from './l10n-translation.service';

@Injectable() export class L10nRoutingService {

    private get router(): Router {
        return this.injector.get(Router);
    }

    private get location(): Location {
        return this.injector.get(Location);
    }

    constructor(
        @Inject(L10N_CONFIG) private config: L10nConfig,
        @Inject(L10N_LOCALE) private locale: L10nLocale,
        private translation: L10nTranslationService,
        private injector: Injector
    ) { }

    public async init(): Promise<void> {
        // Parses the url to find the language when the app starts.
        const path = this.location.path(true);
        await this.parsePath(path);

        // Parses the url to find the language when a navigation starts.
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationStart)
        ).subscribe({
            next: (event: NavigationStart) => this.redirectToPath(event.url)
        });

        // Replaces url when a navigation ends.
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ).subscribe({
            next: (event: NavigationEnd) => {
                const url = (!!event.url && event.url !== '/' && event.url === event.urlAfterRedirects) ?
                    event.url :
                    event.urlAfterRedirects;
                this.replacePath(this.locale, url);
            }
        });

        // Replaces url when locale changes.
        this.translation.onChange().subscribe({
            next: (locale: L10nLocale) => this.replacePath(locale)
        });
    }

    /**
     * Parses path to find the language.
     * @param path The path to be parsed
     */
    private async parsePath(path?: string): Promise<void> {
        if (!path) return Promise.resolve();

        const segment = this.getLocalizedSegment(path);
        if (segment != null) {
            if (this.config.schema && this.config.format) {
                const language = segment.replace(/\//g, '');
                const schema = getSchema(this.config.schema, this.config.format, language);
                if (schema) {
                    await this.translation.setLocale(schema.locale);
                }
            }
        }
    }

    /**
     * Removes the language from the path and navigates without pushing a new state into history.
     * @param path Localized path
     */
    private redirectToPath(path: string): void {
        const segment = this.getLocalizedSegment(path);
        if (segment != null) {
            const url = path.replace(segment, '/');
            // navigateByUrl keeps the query params.
            this.router.navigateByUrl(url, { skipLocationChange: true });
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
                this.location.replaceState(this.getLocalizedPath(language, path));
            }
        } else {
            path = this.location.path(true);
            const segment = this.getLocalizedSegment(path);
            if (segment != null) {
                path = path.replace(segment, '/');

                if (this.isDefaultRouting()) {
                    this.location.replaceState(path);
                }
            }
            if (!this.isDefaultRouting()) {
                this.location.replaceState(this.getLocalizedPath(language, path));
            }
        }
    }

    private getLocalizedSegment(path: string): string | null {
        if (this.config.schema) {
            for (const element of this.config.schema) {
                const language = formatLanguage(element.locale.language, this.config.format);
                const regex = new RegExp(`(\/${language}\/)|(\/${language}$)`);
                const segments = path.match(regex);
                if (segments != null) {
                    return segments[0];
                }
            }
        }
        return null;
    }

    private getLocalizedPath(language: string, path: string): string {
        return Location.stripTrailingSlash('/' + language + path);
    }

    private isDefaultRouting(): boolean {
        if (!this.config.defaultLocale || !this.config.defaultRouting) return false;

        return formatLanguage(this.locale.language, this.config.format) ===
            formatLanguage(this.config.defaultLocale.language, this.config.format);
    }

}
