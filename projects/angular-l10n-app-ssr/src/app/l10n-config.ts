import { Injectable, Inject, Optional, PLATFORM_ID, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie';
import {
    L10nConfig,
    L10nStorage,
    L10nLocale,
    L10nTranslationLoader,
    L10nProvider,
    L10nValidation,
    L10N_LOCALE,
    L10nNumberFormatOptions,
    L10nDateTimeFormatOptions,
    parseDigits,
    L10nUserLanguage,
    L10nTranslationService
} from 'angular-l10n';

export const l10nConfig: L10nConfig = {
    format: 'language-region',
    providers: [
        { name: 'app', asset: './assets/i18n/app', options: { version: '14.0.0' } }
    ],
    fallback: false,
    cache: true,
    keySeparator: '.',
    defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
    schema: [
        { locale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }, dir: 'ltr', text: 'United States' },
        { locale: { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } }, dir: 'ltr', text: 'Italia' }
    ],
    defaultRouting: true
};

@Injectable() export class AppStorage implements L10nStorage {

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private cookieService: CookieService) { }

    public async read(): Promise<L10nLocale | null> {
        return Promise.resolve(this.cookieService.getObject('locale') as L10nLocale);
    }

    public async write(locale: L10nLocale): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            this.cookieService.putObject('locale', locale);
        }
    }

}

@Injectable() export class AppUserLanguage implements L10nUserLanguage {

    private get translation(): L10nTranslationService {
        return this.injector.get(L10nTranslationService);
    }

    constructor(
        @Optional() @Inject(REQUEST) private request: any,
        @Inject(PLATFORM_ID) private platformId: Object,
        private injector: Injector
    ) { }

    public async get(): Promise<string | null> {
        let browserLanguage = null;

        if (isPlatformBrowser(this.platformId)) {
            browserLanguage = navigator.language;
        } else {
            if (this.request) {
                const acceptsLanguages = this.translation.getAvailableLanguages();
                // Returns the first accepted language of the specified languages.
                browserLanguage = this.request.acceptsLanguages(acceptsLanguages) ?? null;
            }
        }

        return Promise.resolve(browserLanguage);
    }

}

@Injectable() export class HttpTranslationLoader implements L10nTranslationLoader {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(@Optional() private http: HttpClient) { }

    public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
        const url = `${provider.asset}-${language}.json`;
        const options = {
            headers: this.headers,
            params: new HttpParams().set('v', provider.options.version)
        };
        return this.http.get(url, options);
    }

}

@Injectable() export class LocaleValidation implements L10nValidation {

    constructor(@Inject(L10N_LOCALE) private locale: L10nLocale) { }

    public parseNumber(value: string, options?: L10nNumberFormatOptions, language = this.locale.language): number | null {
        if (value === '' || value == null) return null;

        let format = { minimumIntegerDigits: 1, minimumFractionDigits: 0, maximumFractionDigits: 0 };
        if (options && options.digits) {
            format = { ...format, ...parseDigits(options.digits) };
        }

        let decimalSeparator: string;
        switch (language) {
            case 'it-IT':
                decimalSeparator = ',';
                break;
            default:
                decimalSeparator = '.';
        }

        const pattern = `^-?[\\d]{${format.minimumIntegerDigits},}(\\${decimalSeparator}[\\d]{${format.minimumFractionDigits},${format.maximumFractionDigits}})?$`;
        const regex = new RegExp(pattern);
        return regex.test(value) ? parseFloat(value.replace(decimalSeparator, '.')) : null;
    }

    public parseDate(value: string, options?: L10nDateTimeFormatOptions, language = this.locale.language): Date | null {
        return null;
    }

}
