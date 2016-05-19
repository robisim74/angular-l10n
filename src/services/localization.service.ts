/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Services.
import {LocaleService} from './locale.service';
import {IntlSupport} from '../services/Intl-support';

/**
 * LocalizationService class.
 * 
 * Direct loading.
 * 
 * To initialize LocalizationService for the direct loading, add the following code in the body of constructor of the route component:
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
 * To initialize LocalizationService for the asynchronous loading, add the following code in the body of constructor of the route component:
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
     * The path prefix for the asynchronous loading.
     */
    private prefix: string;

    /**
     * The translation data: {languageCode: {key: value}}.
     */
    private translationData: any = {};

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

    constructor(public http: Http, public locale: LocaleService) {

        this.prefix = "";
        this.loadingMode = LoadingMode.Unknown;
        this.languageCode = "";

        // Initializes the loading mode.
        this.loadingMode = LoadingMode.Direct;

        // Initializes the service state.
        this.serviceState = ServiceState.isWaiting;

    }

    /**
     * Direct loading: adds new translation data.
     * 
     * @param language The two-letter code of the language for the translation data
     * @param translation The new translation data
     */
    addTranslation(language: string, translation: any) {

        // Adds the new translation data.
        this.translationData[language] = translation;

    }

    /**
     * Asynchronous loading: defines the translation provider.
     * 
     * @param prefix The path prefix of the json files
     */
    translationProvider(prefix: string) {

        this.prefix = prefix;

        // Updates the loading mode.
        this.loadingMode = LoadingMode.Async;

    }

    /**
     * Gets the json data.
     */
    private getTranslation() {

        // Initializes the translation data & the service state.
        this.translationData = {};
        this.serviceState = ServiceState.isLoading;

        var url: string = this.prefix + this.locale.getCurrentLanguage() + '.json';

        // Angular 2 Http module.
        this.http.get(url)
            .map((res: Response) => res.json())
            .subscribe(

            // Observer or next.
            (res: any) => {

                // Assigns the observer to the translation data.
                this.translationData[this.locale.getCurrentLanguage()] = res;

            },

            // Error.
            (error: any) => {

                console.error("Localization service:", error);

            },

            // Complete.
            () => {

                // Updates the language code of the service.
                this.languageCode = this.locale.getCurrentLanguage();

                // Updates the service state.
                this.serviceState = ServiceState.isReady;

            });

    }

    /**
     * Translates a key.
     * 
     * @param key The key to be translated
     * @return The value of translation
     */
    translate(key: string): string {

        var value: string;

        if (this.translationData[this.languageCode] != null) {

            // Gets the translation by language code. 
            var translation: any = this.translationData[this.languageCode];
            // Gets the value of translation by key.   
            value = translation[key];

        }

        // If the value of translation is not present, the same key is returned (see issue #1).
        if (value == null || value == "") {

            value = key;

        }

        return value;

    }

    /**
     * Translates a key.
     * 
     * @param key The key to be translated
     * @return An observable of the value of translation
     */
    translateAsync(key: string): Observable<string> {

        return new Observable<string>((observer: Observer<string>) => {

            // Gets the value of translation for the key.
            var value: string = this.translate(key);

            observer.next(value);
            observer.complete();

        });

    }

    /**
     * Updates the language code and loads the translation data for the asynchronous loading.
     */
    updateTranslation() {

        if (this.locale.getCurrentLanguage() != "" && this.locale.getCurrentLanguage() != this.languageCode) {

            // Asynchronous loading.
            if (this.loadingMode == LoadingMode.Async) {

                // Updates the translation data.  
                this.getTranslation();

            } else {

                // Updates the language code of the service.
                this.languageCode = this.locale.getCurrentLanguage();

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
    compare(key1: string, key2: string, extension?: string, options?: any): number {

        // Checks for support for Intl.
        if (IntlSupport.Collator(this.languageCode) == false) {

            return 0;

        }

        // Gets the value of translation for the keys.
        var value1: string = this.translate(key1);
        var value2: string = this.translate(key2);;

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
    sort(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Array<any> {

        if (list == null || keyName == null || IntlSupport.Collator(this.languageCode) == false) return list;

        // Gets the value of translation for the keys.
        for (let item of list) {

            // Gets the value of translation for the key.
            var value: string = this.translate(item[keyName]);
            // Adds a new column for translated values.
            var translated: string = keyName.concat("Translated")
            // Updates the value in the list.
            item[translated] = value;

        }

        var locale: string = this.addExtension(this.languageCode, extension);

        // Intl.Collator.
        var collator = new Intl.Collator(locale, options); // It can be passed directly to Array.prototype.sort.

        list.sort((a, b) => {

            return collator.compare(a[translated], b[translated]);

        });

        // Removes the column of translated values.
        var index = list.indexOf(translated, 0);
        if (index > -1) {
            list.splice(index, 1);
        }

        // Descending order.
        if (order != null && order == 'desc') {

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
    sortAsync(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Observable<Array<any>> {

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
    search(s: string, list: Array<any>, keyNames: any[], options: any = { usage: 'search' }): Array<any> {

        if (list == null || keyNames == null || s == "" || IntlSupport.Collator(this.languageCode) == false) return list;

        // Gets the value of translation for the each column.
        var translated = new Array<string>();

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
        var collator = new Intl.Collator(locale, options);

        var matches = list.filter((v) => {

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

            var index = matches.indexOf(translated[i], 0);
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
    searchAsync(s: string, list: Array<any>, keyNames: any[], options: any = { usage: 'search' }): Observable<any> {

        if (list == null) return null;

        if (keyNames == null || s == "" || IntlSupport.Collator(this.languageCode) == false) return new Observable<any>((observer: Observer<any>) => {

            for (let item of list) {

                observer.next(item);

            }

            observer.complete();

        });

        return new Observable<any>((observer: Observer<any>) => {

            // Gets the value of translation for the each column.
            var translated = new Array<string>();

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
            var collator = new Intl.Collator(locale, options);

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

                var index = list.indexOf(translated[i], 0);
                if (index > -1) {
                    list.splice(index, 1);
                }

            };

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

        if (sLength > vLength) return false; // The search string is longer than value.

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
     * Initial state.
     */
    Unknown,
    /**
     * Direct loading.
     */
    Direct,
    /**
     * Asynchronous loading.
     */
    Async

} 