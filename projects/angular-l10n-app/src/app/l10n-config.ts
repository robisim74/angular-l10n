import { Injectable, Inject, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    L10nConfig,
    L10nLocale,
    L10nTranslationLoader,
    L10nProvider,
    L10nValidation,
    L10N_LOCALE,
    L10nNumberFormatOptions,
    L10nDateTimeFormatOptions,
    parseDigits,
    L10N_CONFIG,
    L10nLocaleResolver
} from 'angular-l10n';

export const l10nConfig: L10nConfig = {
    format: 'language-region',
    providers: [
        { name: 'app', asset: 'app' }
    ],
    cache: true,
    keySeparator: '.',
    defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { length: 'mile' } },
    schema: [
        { locale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } } },
        { locale: { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } } }
    ]
};

@Injectable() export class LocaleResolver implements L10nLocaleResolver {

    constructor(@Inject(L10N_CONFIG) private config: L10nConfig, private location: Location) { }

    public async get(): Promise<L10nLocale | null> {
        const path = this.location.path();

        for (const schema of this.config.schema) {
            const language = schema.locale.language;
            if (new RegExp(`(\/${language}\/)|(\/${language}$)|(\/(${language})(?=\\?))`).test(path)) {
                return Promise.resolve(schema.locale);
            }
        }
        return Promise.resolve(null);
    }

}

@Injectable() export class HttpTranslationLoader implements L10nTranslationLoader {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(@Optional() private http: HttpClient) { }

    public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
        const url = `./assets/i18n/${language}/${provider.asset}.json`;
        const options = {
            headers: this.headers
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
