// ANGULAR 2 LOCALIZATION
// an injectable class for localization of angular 2 applications
// by direct or asynchronous loading of translations
// written by roberto simonetti
// MIT license
// https://github.com/robisim74/angular2localization

// dependencies:
// - angular: v2.0.0-alpha.44

import {Injectable} from 'angular2/angular2';
import {Http} from 'angular2/http';
import {Pipe, PipeTransform} from 'angular2/angular2';

/**
 * localization is an injectable class that use angular 2 http module
 * to start, add in route component:
 * 
 * @Component({
 *      selector: 'app',
 *      ...
 *      providers: [Localization, LocalizationPipe], // localization providers: inherited by all descendants
 *      pipes: [LocalizationPipe] // add in each component to invoke the transform method
 * })
 * ...
 * class app {
 *      constructor(public localization: Localization){
 *      ...
 *  }
 * }
 * bootstrap(app, [HTTP_PROVIDERS]);
 */

/**
 * DIRECT LOADING
 * to inizialize localization by direct loading add the following code in the body of constructor of route component:
 * 
 * var translationEN = {
 *      EXAMPLE: 'example',
 *      ...
 * }
 * // add a new translation here
 * 
 * this.localization.addTranslation('en', translationEN); // required (parameters: language, translation)
 * this.localization.addTranslation('it', translationIT);
 * // add a new language here 
 * this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
 */
 
/**
 * ASYNCHRONOUS LOADING
 * to inizialize localization by asynchronous loading add the following code in the body of constructor of route component:
 * 
 * this.localization.addTranslation('en'); // required: add a new translations (parameter: a new language) 
 * this.localization.addTranslation('it');
 * // add a new language here
 * this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
 * this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider (parameter: path prefix)
 * 
 * and create the json files of translations such as "locale-en.json"
 * (url is obtained concatenating {prefix} + {locale language code} + ".json")
 */

/**
 * GET TRANSLATION
 * to get translation by direct or asyncronous loading add in each component:
 * 
 * @Component({
 *      ...
 *      pipes: [LocalizationPipe]
 * })
 * 
 * and in the template:
 * 
 * <p>{{ 'EXAMPLE' | translate }}</p>
 */

// localization class
@Injectable() export class Localization {

    prefix: string;

    locale: string; // language code
    
    languagesData: Array<string> = []; // array of available languages codes
    
    translationsData: any = {}; // object of translations
    
    expires: number; // define when the cookie will be removed

    constructor(public http: Http) { }
            
    // direct & asynchronous loading: add a new translation
    addTranslation(locale: string, translation?: any) {

        this.languagesData.push(locale);

        if (translation != null) {
            // direct loading
            this.translationsData[locale] = translation;
        }

    }
    
    // define preferred language
    definePreferredLanguage(defaultLanguage: string, expires?: number) {

        this.expires = expires;
        
        // try to get cookie
        this.locale = this.getCookie("locale"); // call get cookie method

        if (this.locale == null) {
            // get current browser language or default language
            var browserLanguage: string = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

            browserLanguage = browserLanguage.substring(0, 2); // get two-letter code    
        
            if (this.languagesData.indexOf(browserLanguage) != -1) {
                this.locale = browserLanguage;
            }
            else {
                this.locale = defaultLanguage;
            }

            this.setCookie("locale", this.locale, this.expires); // call set cookie method
        }

    }
    
    // asinchronous loading: define translation provider & get json data
    translationProvider(prefix: string) {

        this.prefix = prefix;
        var url: string = this.prefix + this.locale + '.json';
        
        // angular 2 http module
        this.http.get(url)
            .map(res => res.json())
            .subscribe(res => this.translationsData = res, (exception: any) => this.onError, this.onCompleted);

    }
    onCompleted() {

        console.log("translationProvider:", "http get completed");

    }
    onError(exception: any) {

        console.error("translationProvider:", exception);

    }
        
    // get current language
    getCurrentLanguage() {

        return this.locale;

    }
    
    /**
     * CHANGE LANGUAGE
     * to change language at runtime, add in the component:
     *  
     * selectLanguage(locale) {
     *      this.localization.setCurrentLanguage(locale);
     * }
     * 
     * where locale parameter is the language code; then add in the view:
     * 
     * <a (click)="selectLanguage('en')">English<</a>
     * ...
     */
        
    // set current language
    setCurrentLanguage(locale: string) {

        if (this.locale != locale) { // check if language is changed
            this.setCookie("locale", locale, this.expires); // call set cookie method      
            this.locale = locale; // set language code
            
            if (this.prefix != null) {
                this.translationProvider(this.prefix); // update translations data               
            }
        }

    }

    // get translation
    translate(key: string) {

        var value: string;

        if (this.translationsData[this.locale] == null) {
            // get translation by asynchronously loading
            value = this.translationsData[key]; // get translated value by key
        }
        else {
            // get translation by direct loading
            var translation: any = this.translationsData[this.locale]; // get translations by locale       
            value = translation[key]; // get translated value by key          
        }

        return value;

    }
    
    // cookies methods
    // set cookie
    setCookie(name: string, value: string, days?: number) {

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
    // get cookie
    getCookie(name: string) {

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
// end localization class

// translate pipe function
@Pipe({
    name: 'translate',
    pure: false // required to update the value
})

// localization pipe class
@Injectable() export class LocalizationPipe implements PipeTransform {

    constructor(public localization: Localization) { }

    // translate pipe transform method
    transform(key: string) {

        return this.localization.translate(key);

    }

}
// end localization pipe class