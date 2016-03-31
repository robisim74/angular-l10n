/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library for i18n and l10n that implements a translation service - using TypeScript and SystemJS.
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
 * To initialize the LocalizationService for the direct loading, add the following code in the body of the constructor of the route component:
 *
 * var translationEN = {
 *      TITLE: 'angular 2 localization',
 *      CHANGE_LANGUAGE: 'change language',
 *      ...
 * }
 * // Add a new translation here.
 * 
 * this.localization.addTranslation('en', translationEN); // Required: adds a new translation with the given language code.
 * this.localization.addTranslation('it', translationIT);
 * ...
 * 
 * Asynchronous loading.
 * 
 * To initialize the LocalizationService for the asynchronous loading add the following code in the body of the constructor of the route component:
 * 
 * this.localization.translationProvider('./resources/locale-'); // Required: Initializes the translation provider with the given path prefix.
 * 
 * and create the json files of the translations such as 'locale-en.json':
 * 
 * {
 *     "TITLE": "angular 2 localization",
 *     "CHANGE_LANGUAGE": "change language",
 *     ...
 * }
 *
 * Special characters.
 * 
 * You can use quotes inside a string, as long as they don't match the quotes surrounding the string:
 *
 * "It wasn't a dream."
 *
 * Because strings must be written within quotes, use the '\' escape character to insert special characters into the values of the translations:
 * 
 * "\"What's happened to me?\" he thought."
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocalizationService {

    /**
     * The path prefix for the asynchronous loading.
     */
    private prefix: string;
       
    /**
     * The translations data: {locale: {key: value}}.
     */
    private translationsData: any = {};
    
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
     * @params language The two-letter code of the language for the translation data
     * @params translation The new translation data
     */
    addTranslation(language: string, translation: any) {

        // Adds the new translation data.
        this.translationsData[language] = translation;
            
        // Updates the service state.
        this.isReady = true;

    }
    
    /**
     * Asinchronous loading: defines the translation provider.
     * 
     * @params prefix The path prefix of the json files
     */
    translationProvider(prefix: string) {

        this.prefix = prefix;

    }
    
    /**
     * Gets the json data.
     */
    private getTranslation() {
        
        // Initializes the translations data & the service state.
        this.translationsData = {};
        this.isReady = false;

        var url: string = this.prefix + this.languageCode + '.json';
        
        // Angular 2 Http module.
        this.http.get(url)
            .map((res: Response) => res.json())
            .subscribe(
                
            // Observer or next.
            (res: any) => {
                            
                // Assigns the observer to the traslations data.
                this.translationsData[this.languageCode] = res;

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
     * Translate a key.
     * 
     * @params key The key to be translated
     * @return An observable of the value of the translation
     */
    translate(key: string): Observable<string> {

        return new Observable((observer: Observer<string>) => {

            var value: string;

            if (this.translationsData[this.languageCode] != null) {

                // Gets the translation by language code. 
                var translation: any = this.translationsData[this.languageCode];   
                // Gets the value of the translation by key.   
                value = translation[key];

            }

            // If the value of the translation is not present, the same key is returned (see issue #1).
            if (value == null || value == "") {

                value = key;

            }

            observer.next(value);
            observer.complete();

        });

    }

    /**
     * When the language changes, updates the language code and loads the translations data for the asynchronous loading.
     */
    updateTranslation() {

        // Updates the language code for the service.
        this.languageCode = this.locale.getCurrentLanguage();

        // Asynchronous loading.
        if (this.prefix != "") {                         
            
            // Updates the translations data.  
            this.getTranslation();

        }

    }

}