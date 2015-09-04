// ANGULAR 2 LOCALIZATION
// an injectable class for localization of angular 2 applications
// by direct or asynchronous loading of translations
// written by roberto simonetti
// MIT license
// https://github.com/robisim74/angular2localization

// dependencies:
// - angular: v2.0.0-alpha.36
// - js-cookie
// tsd & js libraries

/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/js-cookie/js-cookie.d.ts" />

import {Injectable} from 'angular2/angular2';
import {Http} from 'http/http';

/**
 * localization is an injectable class that use angular 2 http module
 * to start, add in route component:
 * 
 * @Component({
 *      selector: 'app',
 *      bindings: [Localization] 
 * })
 * ...
 * class app {
 *      constructor(public localization: Localization){
 *      ...
 *  }
 * }
 * bootstrap(app, [HTTP_BINDINGS]);
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
 * this.localization.definePreferredLanguage('en'); // required: define preferred language (parameter: default language)
 */
 
/**
 * ASYNCHRONOUS LOADING
 * to inizialize localization by asynchronous loading add the following code in the body of constructor of route component:
 * 
 * this.localization.addTranslation('en'); // required: add a new translations (parameter: a new language) 
 * this.localization.addTranslation('it');
 * // add a new language here
 * this.localization.definePreferredLanguage('en'); // required: define preferred language (parameter: default language)
 * this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider (parameter: path prefix)
 * 
 * and create the json files of translations such as "locale-en.json"
 * (url is obtained concatenating {prefix} + {locale language code} + ".json")
 */

@Injectable() export class Localization {

    prefix: string;

    locale: string; // language code
    
    languagesData: Array<string> = []; // array of available languages codes
    
    translationsData: any = {}; // object of translations

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
    definePreferredLanguage(defaultLanguage: string) {

        // get current browser language or default language
        var browserLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

        browserLanguage = browserLanguage.substring(0, 2); // get two-letter code    
        
        if (this.languagesData.indexOf(browserLanguage) != -1) {
            this.locale = browserLanguage;
        }
        else {
            this.locale = defaultLanguage;
        }

        Cookies.set("locale", this.locale); // set session cookie

    }
    
    // asinchronous loading: define translation provider & get json data
    translationProvider(prefix: string) {

        this.prefix = prefix;
        var url = this.prefix + this.locale + '.json';
        
        // angular 2 http module
        this.http.get(url)
            .toRx()
            .map(res => res.json())
            .subscribe(res => this.translationsData = res);

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
            Cookies.set("locale", locale); // set session cookie      
            this.locale = locale; // set language code
            
            if (this.prefix != null) {
                this.translationProvider(this.prefix); // update translations data               
            }
        }

    }

    /**
    * DIRECT LOADING
    * to get translation by direct loading add the following code in each component:
    * 
    * translate(key) {
    *       return this.localization.translate(key);
    * }
    * 
    * and in the view:
    * 
    * <p>{{ translate('EXAMPLE') }}</p>
    */

    // get translation by direct loading
    translate(key: string) {

        var translation = this.translationsData[this.locale]; // get translations by locale       
        var value = translation[key]; // get translated value by key
        return value;

    }
    
    /**
     * ASYNCHRONOUS LOADING
     * to get translation by asynchronous loading add the following code in each component:
     * 
     * translate(key) {
     *      return this.localization.asyncTranslate(key);
     * }
     * 
     * and in the view:
     * 
     * <p>{{ translate('EXAMPLE') }}</p>
     */
    
    // get translation by asynchronously loading
    asyncTranslate(key: string) {

        var value = this.translationsData[key]; // get translated value by key
        return value;

    }

}
// end localization class
