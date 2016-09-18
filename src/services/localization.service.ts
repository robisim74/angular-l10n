/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Services.
import { LocaleService } from './locale.service';
import { IntlSupport } from './Intl-support';

/**
 * Merges two translation data.
 */
export function extend<A>(a: A): A;
export function extend<A, B>(a: A, b: B): A & B;
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C;
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D;
export function extend(...args: any[]): any {
    const newObj: any = {};
    for (let obj of args) {
        for (let key in obj) {
            // Copies all the fields.
            newObj[key] = obj[key];
        }
    }
    return newObj;
};

/**
 * LocalizationService class.
 * Gets the translation data and performs operations.
 * 
 * Direct loading.
 * 
 * To initialize LocalizationService for the direct loading, add the following code in the body of constructor of the bootstrap component:
 *
 * var translationEN = {
 *      TITLE: 'Angular 2 Localization',
 *      CHANGE_LANGUAGE: 'Change language',
 *      ...
 * }
 * // Add a new translation here.
 * 
 * // Required: adds a new translation with the given language code.
 * this.localization.addTranslation('en', translationEN);
 * // Add a new translation with the given language code here.
 * this.localization.updateTranslation(); // Need to update the translation.
 * 
 * Asynchronous loading.
 * 
 * To initialize LocalizationService for the asynchronous loading, add the following code in the body of constructor of the bootstrap component:
 * 
 * // Required: initializes the translation provider with the given path prefix.
 * this.localization.translationProvider('./resources/locale-');
 * this.localization.updateTranslation(); // Need to update the translation.
 * 
 * and create the json files of the translations such as 'locale-en.json':
 * 
 * {
 *     "TITLE": "Angular 2 Localization",
 *     "CHANGE_LANGUAGE": "Change language",
 *     ...
 * }
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocalizationService {

    /**
     * Output for event translation changed.
     */
    @Output() translationChanged: EventEmitter<any> = new EventEmitter<any>();

    /**
     * The language code for the service.
     */
    public languageCode: string;

    /**
     * The loading mode for the service.
     */
    public loadingMode: LoadingMode;

    /**
     * The service state. 
     */
    public serviceState: ServiceState;

    /**
     * The providers for the asynchronous loading.
     */
    private providers: Array<Provider> = [];

    /**
     * The translation data: {languageCode: {key: value}}.
     */
    private translationData: any = {};

    /**
     * Requests counter.
     */
    private counter: number;

    constructor(public http: Http, public locale: LocaleService) {

        this.languageCode = "";

        // Initializes the loading mode.
        this.loadingMode = LoadingMode.Direct;

        // Initializes the service state.
        this.serviceState = ServiceState.isWaiting;

        // When the language changes, subscribes to the event & call updateTranslation method.
        this.locale.languageCodeChanged.subscribe(

            // Generator or next.
            (language: string) => this.updateTranslation(language)

        );

    }

    /**
     * Direct loading: adds new translation data.
     * 
     * @param language The two-letter code of the language for the translation data
     * @param translation The new translation data
     */
    public addTranslation(language: string, translation: any): void {

        // Adds the new translation data.
        this.addData(translation, language);

    }

    /**
     * Asynchronous loading: adds a translation provider.
     * 
     * @param prefix The path prefix of the json files
     * @param dataFormat Data format: default value is 'json'.
     * @param webAPI True if the asynchronous loading uses a Web API to get the data.
     */
    public addProvider(prefix: string, dataFormat: string = "json", webAPI: boolean = false): void {

        this.providers.push({ prefix, dataFormat, webAPI });

        // Updates the loading mode.
        if (this.providers.length == 1) { this.loadingMode = LoadingMode.Async; }

    }

    /**
     * Translates a key.
     * 
     * @param key The key to be translated
     * @params args Parameters
     * @return The value of translation
     */
    public translate(key: string, args?: any): string {

        var value: string;

        if (this.translationData[this.languageCode] != null) {

            // Gets the translation by language code. 
            var translation: any = this.translationData[this.languageCode];

            // Checks for composed key (see issue #21).
            var keys: string[] = key.split(".");
            do {
                key = keys.shift();
                if (translation[key] != null && (typeof translation[key] == "object")) {
                    translation = translation[key];
                }
            } while (keys.length > 0);

            // Gets the value of translation by key.   
            value = translation[key];

        }

        // If the value of translation is not present, the same key is returned (see issue #1).
        if (value == null || value == "") {

            return key;

        } else if (args != null) { // Parameters (see issue #19).

            const TEMPLATE_REGEXP: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

            return value.replace(TEMPLATE_REGEXP, (substring: string, parsedKey: string) => {
                var response: string = <string>args[parsedKey];
                return (typeof response !== 'undefined') ? response : substring;
            });

        }

        return value;

    }

    /**
     * Translates a key.
     * 
     * @param key The key to be translated
     * @params args Parameters
     * @return An observable of the value of translation
     */
    public translateAsync(key: string, args?: any): Observable<string> {

        return new Observable<string>((observer: Observer<string>) => {

            // Gets the value of translation for the key.
            var value: string = this.translate(key, args);

            observer.next(value);
            observer.complete();

        });

    }

    /**
     * Updates the language code and loads the translation data for the asynchronous loading.
     * 
     * @param language The two-letter or three-letter code of the language: default is the current language
     */
    public updateTranslation(language: string = this.locale.getCurrentLanguage()): void {

        if (language != "" && language != this.languageCode) {

            // Asynchronous loading.
            if (this.loadingMode == LoadingMode.Async) {

                // Updates the translation data.  
                this.getTranslation(language);

            } else {

                // Updates the language code of the service.
                this.languageCode = language;

                // Updates the service state.
                this.serviceState = ServiceState.isReady;

            }

        }

    }

    /* Intl.Collator */

    /**
     * Compares two keys by the value of translation & the current language code.
     * 
     * @param key1, key2 The keys of the values to compare
     * @param extension
     * @param options
     * @return A negative value if the value of translation of key1 comes before the value of translation of key2; a positive value if key1 comes after key2; 0 if they are considered equal or Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    public compare(key1: string, key2: string, extension?: string, options?: any): number {

        // Checks for support for Intl.
        if (IntlSupport.Collator(this.languageCode) == false) {

            return 0;

        }

        // Gets the value of translation for the keys.
        var value1: string = this.translate(key1);
        var value2: string = this.translate(key2);

        var locale: string = this.addExtension(this.languageCode, extension);

        return new Intl.Collator(locale).compare(value1, value2);

    }

    /**
     * Sorts an array of objects or an array of arrays by the current language code.
     * 
     * @param list The array to be sorted
     * @param keyName The column that contains the keys of the values to be ordered
     * @param order 'asc' or 'desc'. The default value is 'asc'.
     * @param extension
     * @param options
     * @return The same sorted list or the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    public sort(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Array<any> {

        if (list == null || keyName == null || IntlSupport.Collator(this.languageCode) == false) { return list; }

        // Gets the value of translation for the keys.
        for (let item of list) {

            // Gets the value of translation for the key.
            var value: string = this.translate(item[keyName]);
            // Adds a new column for translated values.
            var translated: string = keyName.concat("Translated");
            // Updates the value in the list.
            item[translated] = value;

        }

        var locale: string = this.addExtension(this.languageCode, extension);

        // Intl.Collator.
        var collator: Intl.Collator = new Intl.Collator(locale, options); // It can be passed directly to Array.prototype.sort.

        list.sort((a: any, b: any) => {

            return collator.compare(a[translated], b[translated]);

        });

        // Removes the column of translated values.
        var index: number = list.indexOf(translated, 0);
        if (index > -1) {
            list.splice(index, 1);
        }

        // Descending order.
        if (order != null && order == "desc") {

            list.reverse();

        }

        return list;

    }

    /**
     * Sorts an array of objects or an array of arrays by the current language code.
     * 
     * @param list The array to be sorted
     * @param keyName The column that contains the keys of the values to be ordered
     * @param order 'asc' or 'desc'. The default value is 'asc'.
     * @param extension
     * @param options
     * @return An observable of the sorted list or of the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    public sortAsync(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Observable<Array<any>> {

        return new Observable<any>((observer: Observer<Array<any>>) => {

            // Gets the sorted list.
            observer.next(this.sort(list, keyName, order, extension, options));
            observer.complete();

        });

    }

    /**
     * Matches a string into an array of objects or an array of arrays.
     * 
     * @param s The string to search
     * @param list The array to look for
     * @param keyNames An array that contains the columns to look for
     * @param options
     * @return A filtered list or the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    public search(s: string, list: Array<any>, keyNames: any[], options: any = { usage: 'search' }): Array<any> {

        if (list == null || keyNames == null || s == "" || IntlSupport.Collator(this.languageCode) == false) { return list; }

        // Gets the value of translation for the each column.
        var translated: Array<string> = new Array<string>();

        var i: number = 0;
        for (var i: number = 0; i < keyNames.length; i++) {

            // Adds a new column for translated values.
            translated.push(keyNames[i].concat("Translated"));

            for (let item of list) {

                // Gets the values of translation for the column.
                var value: string = this.translate(item[keyNames[i]]);
                // Updates the value in the list.
                item[translated[i]] = value;

            }

        }

        var locale: string = this.languageCode;

        // Intl.Collator.
        var collator: Intl.Collator = new Intl.Collator(locale, options);

        var matches: Array<any> = list.filter((v: any) => {

            var found: boolean = false;
            for (var i: number = 0; i < translated.length; i++) {

                // Calls matching algorithm.
                if (this.match(v[translated[i]], s, collator)) {

                    found = true;
                    break;

                }

            }

            return found;

        });

        // Removes the columns of translated values.
        for (var i: number = 0; i < translated.length; i++) {

            var index: number = matches.indexOf(translated[i], 0);
            if (index > -1) {
                matches.splice(index, 1);
            }

        }

        return matches;

    }

    /**
     * Matches a string into an array of objects or an array of arrays.
     * 
     * @param s The string to search
     * @param list The array to look for
     * @param keyNames An array that contains the columns to look for
     * @param options
     * @return An observable for each element of the filtered list or the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    public searchAsync(s: string, list: Array<any>, keyNames: any[], options: any = { usage: 'search' }): Observable<any> {

        if (list == null) { return null; }

        if (keyNames == null || s == "" || IntlSupport.Collator(this.languageCode) == false) {

            return new Observable<any>((observer: Observer<any>) => {

                for (let item of list) {

                    observer.next(item);

                }

                observer.complete();

            });

        }

        return new Observable<any>((observer: Observer<any>) => {

            // Gets the value of translation for the each column.
            var translated: Array<string> = new Array<string>();

            var i: number = 0;
            for (var i: number = 0; i < keyNames.length; i++) {

                // Adds a new column for translated values.
                translated.push(keyNames[i].concat("Translated"));

                for (let item of list) {

                    // Gets the values of translation for the column.
                    var value: string = this.translate(item[keyNames[i]]);
                    // Updates the value in the list.
                    item[translated[i]] = value;

                }

            }

            var locale: string = this.languageCode;

            // Intl.Collator.
            var collator: Intl.Collator = new Intl.Collator(locale, options);

            for (let v of list) {

                for (var i: number = 0; i < translated.length; i++) {

                    // Calls matching algorithm.
                    if (this.match(v[translated[i]], s, collator)) {

                        observer.next(v);
                        break;

                    }

                }

            }

            // Removes the columns of translated values.
            for (var i: number = 0; i < translated.length; i++) {

                var index: number = list.indexOf(translated[i], 0);
                if (index > -1) {
                    list.splice(index, 1);
                }

            }

            observer.complete();

        });

    }

    private addExtension(locale: string, extension?: string): string {

        // Adds extension.
        if (extension != null && extension != "") {

            locale = locale + "-" + extension;

        }

        return locale;

    }

    /**
     * Matching algorithm.
     * 
     * @param v The value
     * @param s The string to search
     * return True if match, otherwise false
     */
    private match(v: string, s: string, collator: Intl.Collator): boolean {

        var vLength: number = v.length;
        var sLength: number = s.length;

        if (sLength > vLength) { return false; } // The search string is longer than value.

        if (sLength == vLength) {

            return collator.compare(v, s) === 0;

        }

        // Tries to search the substring.
        var found: boolean = false;
        for (var i: number = 0; i < vLength - (sLength - 1); i++) {

            var str: string = v.substr(i, sLength);
            if (collator.compare(str, s) === 0) {

                found = true;
                break;

            }

        }

        return found;

    }

    /**
     * Asynchronous loading: gets translation data.
     */
    private getTranslation(language: string): void {

        // Initializes the translation data & the service state.
        this.translationData = {};
        this.serviceState = ServiceState.isLoading;

        // Get translation data for all providers.
        this.counter = this.providers.length;

        for (let provider of this.providers) {

            // Builds the URL.
            var url: string = provider.prefix;

            if (provider.webAPI == true) {

                // Absolute URL for Web API.
                url += language;

            } else {

                // Relative server path for 'json' files.
                url += language + "." + provider.dataFormat;

            }

            // Angular 2 Http module.
            this.http.get(url)
                .map((res: Response) => res.json())
                .subscribe(

                // Observer or next.
                (res: any) => {

                    // Adds response to the translation data.
                    this.addData(res, language);

                },

                // Error.
                (error: any) => {

                    console.error("Localization service:", error);

                },

                // Complete.
                () => {

                    this.counter--;

                    // Checks for the last one request.
                    if (this.counter <= 0) {

                        // Updates the service state.
                        this.serviceState = ServiceState.isReady;

                        // Updates the language code of the service: all the translate pipe will invoke the trasform method.
                        this.languageCode = language;

                        // Sends an event for the components.
                        this.translationChanged.emit(null);

                    }

                });

        }

    }

    // Adds or extends translation data.
    private addData(data: any, language: string): void {

        this.translationData[language] = (typeof this.translationData[language] != "undefined") ? extend(this.translationData[language], data) : data;

    }

}

/**
 * Defines the provider for asynchronous loading of the translation data.
 */
class Provider {

    prefix: string;

    dataFormat: string;

    webAPI: boolean;

}

/**
 * Defines the service state.
 */
export enum ServiceState {

    /**
     * The translation data has been loaded.
     */
    isReady,
    /**
     * The service is loading the data.
     */
    isLoading,
    /**
     * The service is waiting for the data.
     */
    isWaiting

}

/**
 * Defines the loading mode.
 */
export enum LoadingMode {

    /**
     * Direct loading.
     */
    Direct,
    /**
     * Asynchronous loading.
     */
    Async

}
