import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { L10nConfig, L10nLoader, L10nTranslationLoader, L10nProvider } from 'angular-l10n';

export const l10nConfig: L10nConfig = {
    format: 'language',
    providers: [
        { name: 'app', asset: './assets/i18n/app', options: { version: '9.0.0' } },
        { name: 'lazy', asset: './assets/i18n/lazy', options: { version: '9.0.0' } }
    ],
    cache: true,
    keySeparator: '.',
    defaultLocale: { language: 'en' },
    schema: [
        { locale: { language: 'en' }, dir: 'ltr', text: 'United States' },
        { locale: { language: 'it' }, dir: 'ltr', text: 'Italia' }
    ]
};

export function initL10n(l10nLoader: L10nLoader): () => Promise<void> {
    return () => l10nLoader.init();
}

@Injectable() export class L10nHttpTranslationLoader implements L10nTranslationLoader {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(@Optional() private http: HttpClient) { }

    public getTranslation(language: string, provider: L10nProvider): Observable<any> {
        const url = `${provider.asset}-${language}.json`;
        const options = {
            headers: this.headers,
            params: new HttpParams().set('v', provider.options.version)
        };
        return this.http.get(url, options);
    }

}
