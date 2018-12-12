import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { timeout } from 'rxjs/operators';

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

    private cache: { [key: string]: Observable<any> | undefined } = {};

    constructor(@Inject(L10N_CONFIG) private configuration: L10nConfigRef, private http: HttpClient) { }

    public getTranslation(language: string, args: any): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options: any = {
            headers: headers
        };
        if (this.configuration.translation.version) {
            options.params = new HttpParams().set('ver', this.configuration.translation.version);
        }
        let request: Observable<any>;
        let url: string = "";

        switch (args.type) {
            case ProviderType.WebAPI:
                url += args.path + language;
                break;
            default:
                url += args.prefix + language + ".json";
        }

        if (this.configuration.translation.timeout) {
            request = this.http.get(url, options).pipe(
                timeout(this.configuration.translation.timeout)
            );
        } else {
            request = this.http.get(url, options);
        }

        if (this.configuration.translation.caching) {
            return this.caching(url, request);
        }
        return request;
    }

    private caching(key: string, request: Observable<any>): Observable<any> {
        const cached: Observable<any> | undefined = this.cache[key];
        if (cached) return cached;

        const buffer: ReplaySubject<any> = new ReplaySubject<any>(1);
        request.subscribe(
            (value: any) => buffer.next(value),
            (error: any) => {
                buffer.error(error);
                this.cache[key] = undefined;
            },
            () => buffer.complete()
        );

        const response: Observable<any> = buffer.asObservable();
        this.cache[key] = response;
        return response;
    }

}
