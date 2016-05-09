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

import {LocaleService} from './locale.service';

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

        return new Observable((observer: Observer<string>) => {

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