/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
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
 * 
 * Asynchronous loading.
 * 
 * To initialize LocalizationService for the asynchronous loading, add the following code in the body of constructor of the route component:
 * 
 * // Required: initializes the translation provider with the given path prefix.
 * this.localization.translationProvider('./resources/locale-');
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
     * The service state. 
     */
    public isReady: boolean;

    constructor(public http: Http, public locale: LocaleService) {

        this.prefix = "";
        this.languageCode = "";

        // Initializes the service state.
        this.isReady = false;

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

        // Updates the service state.
        this.isReady = true;

    }

    /**
     * Asinchronous loading: defines the translation provider.
     * 
     * @param prefix The path prefix of the json files
     */
    translationProvider(prefix: string) {

        this.prefix = prefix;

    }

    /**
     * Gets the json data.
     */
    private getTranslation() {

        // Initializes the translation data & the service state.
        this.translationData = {};
        this.isReady = false;

        var url: string = this.prefix + this.languageCode + '.json';

        // Angular 2 Http module.
        this.http.get(url)
            .map((res: Response) => res.json())
            .subscribe(

            // Observer or next.
            (res: any) => {

                // Assigns the observer to the translation data.
                this.translationData[this.languageCode] = res;

            },

            // Error.
            (error: any) => {

                console.error("Localization service:", error);

            },

            // Complete.
            () => {

                // Updates the service state.
                this.isReady = true;

                console.log("Localization service:", "Http get method completed.");

            });

    }

    /**
     * Translates a key.
     * 
     * @param key The key to be translated
     * @return An observable of the value of translation
     */
    translate(key: string): Observable<string> {

        return new Observable((observer: Observer<string>) => {

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

            observer.next(value);
            observer.complete();

        });

    }

    /**
     * When the language changes, updates the language code and loads the translation data for the asynchronous loading.
     */
    updateTranslation() {

        // Updates the language code for the service.
        this.languageCode = this.locale.getCurrentLanguage();

        // Asynchronous loading.
        if (this.prefix != "") {

            // Updates the translation data.  
            this.getTranslation();

        }

    }

}