import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Caching } from '../models/caching';
import { L10N_CONFIG, L10nConfigRef } from "../models/l10n-config";
import { ProviderType } from '../models/types';

/**
 * Implement this class-interface to create a custom provider for translation data.
 */
@Injectable() export abstract class TranslationProvider {

    /**
     * This method must contain the logic of data access.
     * @param language The current language
     * @param args The object set during the configuration of 'providers'
     * @return An observable of an object of translation data: {key: value}
     */
    public abstract getTranslation(language: string, args: any): Observable<any>;

}

@Injectable() export class L10nTranslationProvider implements TranslationProvider {

    private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    private options: any = {};

    constructor(
        @Optional() private http: HttpClient,
        @Inject(L10N_CONFIG) private configuration: L10nConfigRef,
        private caching: Caching
    ) { }

    public getTranslation(language: string, args: any): Observable<any> {
        this.setOptions();

        let url: string = "";
        switch (args.type) {
            case ProviderType.WebAPI:
                url += args.path + language;
                break;
            default:
                url += args.prefix + language + ".json";
        }

        return this.getRequest(url);
    }

    private setOptions(): void {
        this.options = {
            headers: this.headers,
            params: this.configuration.translation.version ? new HttpParams().set('ver', this.configuration.translation.version) : undefined
        };
    }

    private getRequest(url: string): Observable<any> {
        let request: Observable<any>;
        if (this.configuration.translation.timeout) {
            request = this.http.get(url, this.options).pipe(
                timeout(this.configuration.translation.timeout)
            );
        } else {
            request = this.http.get(url, this.options);
        }

        if (this.configuration.translation.caching) {
            return this.caching.read(url, request);
        }
        return request;
    }

}
