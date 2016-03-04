/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
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
 * How to use the translation service.
 * 
 * // Services.
 * import {LocaleService} from './services/locale.service'; // LocaleService class.
 * import {LocalizationService} from './services/localization.service'; // LocalizationService class.
 * // Pipes.
 * import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.
 *
 * @Component({
 *      selector: 'app-component',
 *      ...
 *      providers: [LocaleService, LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
 *      pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
 * })
 * 
 * export class AppComponent {
 * 
 *      constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *          // Initializes the LocaleService.
 *          this.locale.addLanguage('en'); // Required: adds a new language.
 *          this.locale.addLanguage('it');
 *          ...
 *          this.locale.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *
 *      }
 * 
 * }
 * 
 * Also add in the main:
 * 
 * bootstrap(AppComponent, [HTTP_PROVIDERS]);
 *
 * Direct loading.
 * 
 * To initialize the LocalizationService for the direct loading, add the following code in the body of the constructor of the route component:
 *
 * var translationEN = {
 *      TITLE: 'ANGULAR 2 LOCALIZATION',
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
 * and create the json files of the translations such as "locale-en.json":
 * 
 * {
 *     "TITLE": "angular 2 localization",
 *     "CHANGE_LANGUAGE": "change language",
 *     ...
 * }
 *
 * Special characters.
 * 
 * Use the escape character \ to insert special characters into the values of the translations:
 * 
 * \'	single quote
 * \"	double quote
 * 
 * Getting the translation.
 * 
 * To get the translation, add in the template:
 * 
 * {{ 'EXAMPLE' | translate }}
 * 
 * and in each component:
 * 
 * @Component({
 *      ...
 *      pipes: [LocalizationPipe]
 * })
 *  
 * Changing language.
 * 
 * To change language at runtime, add in the component:
 *  
 * selectLanguage(language) {
 * 
 *      this.locale.setCurrentLanguage(language);
 * 
 * }
 * 
 * where "language" is the two-letter code of the language; then add in the view:
 * 
 * <a (click)="selectLanguage('en')">English</a>
 * ...
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
    public isReady;

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