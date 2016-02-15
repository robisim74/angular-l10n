/**
 * ANGULAR 2 LOCALIZATION
 * An injectable class to translate in the new Angular 2 applications using TypeScript
 * through the direct or asynchronous loading of translations
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Pipe, PipeTransform} from 'angular2/core';
import 'rxjs/add/operator/map';

/**
 * Localization is an injectable class that use the Angular 2 Http module.
 * To start, add in the route component:
 * 
 * @Component({
 *      selector: 'app-component',
 *      ...
 *      providers: [Localization, LocalizationPipe], // Localization providers: inherited by all descendants.
 *      pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
 * })
 * ...
 * export class AppComponent {
 *      constructor(public localization: Localization){
 *      ...
 *  }
 * }
 * 
 * and in the main:
 * 
 * bootstrap(AppComponent, [HTTP_PROVIDERS]);
 *
 * DIRECT LOADING
 * To inizialize the Localization class for the direct loading add the following code in the body of constructor of the route component:
 * 
 * var translationEN = {
 *      EXAMPLE: 'example',
 *      ...
 * }
 * // Add a new translation here.
 * 
 * this.localization.addTranslation('en', translationEN); // Required: adds language and translation.
 * this.localization.addTranslation('it', translationIT);
 * // Add a new language here. 
 * this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
 *
 * ASYNCHRONOUS LOADING
 * To inizialize the Localization class for the asynchronous loading add the following code in the body of constructor of the route component:
 * 
 * this.localization.addTranslation('en'); // Required: adds a new translation.
 * this.localization.addTranslation('it');
 * // Add a new language here.
 * this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
 * this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the path prefix.
 * 
 * and create the json files of the translations such as "locale-en.json"
 * (the URL is obtained concatenating {prefix} + {locale language code} + ".json").
 *
 * GET THE TRANSLATION
 * To get the translation through direct or asyncronous loading add in each component:
 * 
 * @Component({
 *      ...
 *      pipes: [LocalizationPipe]
 * })
 * 
 * and in the template:
 * 
 * <p>{{ 'EXAMPLE' | translate }}</p>
 * 
 * CHANGE LANGUAGE
 * To change language at runtime, add in the component:
 *  
 * selectLanguage(locale) {
 *      this.localization.setCurrentLanguage(locale);
 * }
 * 
 * where the locale parameter is the language code; then add in the view:
 * 
 * <a (click)="selectLanguage('en')">English<</a>
 * ...
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class Localization {

    prefix: string;

    locale: string; // Language code.
    
    languagesData: Array<string> = []; // Array of the available languages codes.
    
    translationsData: any = {}; // Object of the translations.
    
    expires: number; // Defines when the cookie will be removed.

    constructor(public http: Http) { }

    /**
     * Direct & asynchronous loading: adds a new translation.
     * 
     * @param locale The language of translation
     * @param translation Nullable
     */
    addTranslation(locale: string, translation?: any) {

        this.languagesData.push(locale);

        if (translation != null) {
            // Direct loading.
            this.translationsData[locale] = translation;
        }

    }

    /**
     * Defines the preferred language.
     * 
     * @param defaultLanguage
     * @param expires Nullable expiry (No days)
     */
    definePreferredLanguage(defaultLanguage: string, expires?: number) {

        this.expires = expires;
        
        // Tries to get the cookie.
        this.locale = this.getCookie("locale"); // Calls the getCookie method.

        if (this.locale == null) {
            // Gets the current browser language or the default language.
            var browserLanguage: string = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

            browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    
        
            if (this.languagesData.indexOf(browserLanguage) != -1) {
                this.locale = browserLanguage;
            }
            else {
                this.locale = defaultLanguage;
            }

            this.setCookie("locale", this.locale, this.expires); // Calls the setCookie method.
        }

    }
    
    /**
     * Asinchronous loading: defines the translation provider & gets the json data.
     * 
     * @param prefix The path prefix
     */
    translationProvider(prefix: string) {

        this.prefix = prefix;
        var url: string = this.prefix + this.locale + '.json';
        
        // Angular 2 Http module.
        this.http.get(url)
            .map((res: Response) => res.json())
            .subscribe(res => this.translationsData = res, (exception: any) => this.onError, this.onCompleted);

    }
    onCompleted() {

        console.log("translationProvider:", "http get method completed.");

    }
    onError(exception: any) {

        console.error("translationProvider:", exception);

    }
        
    /**
     * Gets the current language.
     * 
     * @return The current language.
     */
    getCurrentLanguage() {

        return this.locale;

    }

    /**
     * Sets the current language.
     * 
     * @param locale The new language
     */
    setCurrentLanguage(locale: string) {

        if (this.locale != locale) { // Checks if the language is changed.
            this.setCookie("locale", locale, this.expires); // Calls the setCookie method.      
            this.locale = locale; // Sets the language code.
            
            if (this.prefix != null) {
                this.translationProvider(this.prefix); // Updates the translations data.               
            }
        }

    }

    /**
     * Gets the translation.
     * 
     * @param key The key to be translated.
     * @return The value of the translation.
     */
    translate(key: string) {

        var value: string;

        if (this.translationsData[this.locale] == null) {
            // Gets the translation through asynchronously loading.
            value = this.translationsData[key]; // Gets the translated value by key.
        }
        else {
            // Gets the translation through direct loading.
            var translation: any = this.translationsData[this.locale]; // Gets the translations by locale.       
            value = translation[key]; // Gets the translated value by key.          
        }
        
        // If the key value is not present, the same key is returned (see issue #1).
        if (value == null) {

            value = key;

        }

        return value;

    }
    
    /**
     * Sets cookie.
     * 
     * @param name
     * @param value
     * @param days Expiry
     */
    private setCookie(name: string, value: string, days?: number) {

        if (days != null) {
            var expirationDate: Date = new Date();
            expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires: string = "; expires=" + expirationDate.toUTCString();
        }
        else {
            var expires: string = "";
        }

        document.cookie = name + "=" + value + expires + "; path=/";

    }
    /**
     * Gets cookie.
     * 
     * @param name
     */
    private getCookie(name: string) {

        name += "=";

        var ca: string[] = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c: string = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return null;

    }

}

/**
 * Translate pipe function.
 */
@Pipe({
    name: 'translate',
    pure: false // Required to update the value.
})

/**
 * Localization pipe class.
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocalizationPipe implements PipeTransform {

    constructor(public localization: Localization) { }

    /**
     * Translate pipe transform method.
     * 
     * @param key The translation key.
     * @return The translated value.
     */
    transform(key: string) {

        return this.localization.translate(key);

    }

}