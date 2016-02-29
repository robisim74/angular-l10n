/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Pipe, PipeTransform} from 'angular2/core';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * LocalizationService class.
 * 
 * How to use the localization service.
 * 
 * // Services.
 * import {LocalizationService} from './services/localization.service'; // LocalizationService class.
 * // Pipes.
 * import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.
 *
 * @Component({
 *      selector: 'app-component',
 *      ...
 *      providers: [LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
 *      pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
 * })
 * 
 * export class AppComponent {
 * 
 *      constructor(public localization: LocalizationService) {
 *      ...
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
 * To inizialize the LocalizationService for the direct loading, add the following code in the body of the constructor of the route component:
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
 * this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *
 * Asynchronous loading.
 * 
 * To inizialize the LocalizationService for the asynchronous loading add the following code in the body of the constructor of the route component:
 * 
 * this.localization.addTranslation('en'); // Required: adds a new language code.
 * this.localization.addTranslation('it');
 * ...
 * 
 * this.localization.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If omitted, the cookie becomes a session cookie.
 * 
 * this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.
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
 * Use the escape character (\) to insert special characters into the values of the translations:
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
 * selectLanguage(locale) {
 * 
 *      this.localization.setCurrentLanguage(locale);
 * 
 * }
 * 
 * where "locale" is the language code; then add in the view:
 * 
 * <a (click)="selectLanguage('en')">English</a>
 * ...
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocalizationService {

    /**
     * The path prefix.
     */
    private prefix: string;

    /**
     * Current language code.
     */
    private locale: string;
    
    /**
     * The available languages codes.
     */
    private localesData: Array<string> = []; 
    
    /**
     * The translations data: {locale: {key: value}}.
     */
    private translationsData: any = {};
    
    /**
     * Defines when the cookie will be removed.
     */
    private expiry: number;
    
    /**
     * The service state. 
     */
    public isReady;

    constructor(public http: Http) {

        this.prefix = "";
        this.locale = "";
                
        // Inizializes the service state.
        this.isReady = false;

    }

    /**
     * Direct & asynchronous loading: adds a new translation.
     * 
     * @params locale The language code of translation
     * @params translation Only for direct loading
     */
    addTranslation(locale: string, translation?: any) {

        this.localesData.push(locale);

        // Direct loading.
        if (translation != null) {

            this.translationsData[locale] = translation;
            
            // Updates the service state.
            this.isReady = true;

        }

    }

    /**
     * Direct & asynchronous loading: defines the preferred language. 
     * Selects the current language of the browser if it has been added, else the default language. 
     * 
     * @params defaultLanguage
     * @params expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     */
    definePreferredLanguage(defaultLanguage: string, expiry?: number) {

        this.expiry = expiry;
        
        // Tries to get the cookie "locale".
        this.locale = this.getCookie("locale");

        if (this.locale == "") {
            
            // Gets the current language of the browser or the default language.
            var browserLanguage: string = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

            browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    
        
            if (this.localesData.indexOf(browserLanguage) != -1) {

                this.locale = browserLanguage;

            } else {

                this.locale = defaultLanguage;

            }
            
            // Sets the cookie "locale".
            this.setCookie("locale", this.locale, this.expiry);

        }

    }
    
    /**
     * Asinchronous loading: defines the translation provider & gets the json data.
     * 
     * @params prefix The path prefix of the json files
     */
    translationProvider(prefix: string) {
        
        // Inizializes the translations data & the service state.
        this.translationsData = {};
        this.isReady = false;

        this.prefix = prefix;
        var url: string = this.prefix + this.locale + '.json';
        
        // Angular 2 Http module.
        this.http.get(url)
            .map((res: Response) => res.json())
            .subscribe(
                
            // Observer or next.
            (res: any) => {
                            
                // Assigns the observer to the traslations data.
                this.translationsData[this.locale] = res;

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
     * Gets the current language.
     * 
     * @return The current language code
     */
    getCurrentLanguage(): string {

        return this.locale;

    }

    /**
     * Sets the current language.
     * 
     * @params locale The new language code
     */
    setCurrentLanguage(locale: string) {

        // Checks if the language is changed.
        if (this.locale != locale) {

            // Sets the cookie "locale".
            this.setCookie("locale", locale, this.expiry);
            
            // Sets the language code.
            this.locale = locale; 
            
            // Asinchronous loading.
            if (this.prefix != "") {
                
                // Updates the translations data.  
                this.translationProvider(this.prefix);

            }
        }

    }

    /**
     * Gets the translation.
     * 
     * @params key The key to be translated
     * @return An observable of the value of the translation
     */
    translate(key: string): Observable<string> {

        return new Observable((observer: Observer<string>) => {

            var value: string;

            if (this.translationsData[this.locale] != null) {

                // Gets the translation by locale. 
                var translation: any = this.translationsData[this.locale];   
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
     * Sets the cookie.
     * 
     * @params name The name of the cookie
     * @params value The language code
     * @params days Number of days on the expiry
     */
    private setCookie(name: string, value: string, days?: number) {

        if (days != null) {

            // Adds an expiry date (in UTC time).
            var expirationDate: Date = new Date();

            expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));

            var expires: string = "; expires=" + expirationDate.toUTCString();

        } else {

            // By default, the cookie is deleted when the browser is closed.
            var expires: string = "";

        }

        // Creates the cookie.
        document.cookie = name + "=" + value + expires + "; path=/";

    }
    
    /**
     * Gets the cookie.
     * 
     * @paramss name The name of the cookie
     * @return The language code
     */
    private getCookie(name: string): string {

        // The text to search for.
        name += "=";

        // Splits document.cookie on semicolons into an array.
        var ca: string[] = document.cookie.split(';');

        // Loops through the ca array, and reads out each value.
        for (var i = 0; i < ca.length; i++) {

            var c: string = ca[i];

            while (c.charAt(0) == ' ') {

                c = c.substring(1);

            }
            // If the cookie is found, returns the value of the cookie.
            if (c.indexOf(name) == 0) {

                return c.substring(name.length, c.length);

            }
        }

        // If the cookie is not found, returns an empty string.
        return "";

    }

}