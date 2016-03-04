/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from 'angular2/core';

/**
 * LocaleService class.
 * 
 * Instantiate this class only once in the route component in order to access the data of location from anywhere in the application. 
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocaleService {

    /**
     * Current language code.
     */
    private languageCode: string;
            
    /**
     * The available languages codes.
     */
    private languageCodes: Array<string> = []; 
    
    /**
     * Defines when the cookie will be removed.
     */
    private expiry: number;

    constructor() {

        this.languageCode = "";

    }
    
    /**
     * Asynchronous loading: adds a new language.
     * 
     * @params language The two-letter code of the new language
     */
    addLanguage(language: string) {

        this.languageCodes.push(language);

    }
    
    /**
     * Direct & asynchronous loading: defines the preferred language. 
     * Selects the current language of the browser if it has been added, else the default language. 
     * 
     * @params defaultLanguage The two-letter code of the default language
     * @params expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     */
    definePreferredLanguage(defaultLanguage: string, expiry?: number) {

        this.expiry = expiry;
        
        // Tries to get the cookie "locale".
        this.languageCode = this.getCookie("locale");

        if (this.languageCode == "") {
            
            // Gets the current language of the browser or the default language.
            var browserLanguage: string = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

            browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    
        
            if (this.languageCodes.indexOf(browserLanguage) != -1) {

                this.languageCode = browserLanguage;

            } else {

                this.languageCode = defaultLanguage;

            }
            
            // Sets the cookie "locale".
            this.setCookie("locale", this.languageCode, this.expiry);

        }

    }
    
    /**
     * Gets the current language.
     * 
     * @return The two-letter code of the current language
     */
    getCurrentLanguage(): string {

        return this.languageCode;

    }

    /**
     * Sets the current language.
     * 
     * @params language The two-letter code of the new language
     */
    setCurrentLanguage(language: string) {

        // Checks if the language is changed.
        if (this.languageCode != language) {
            
            // Sets the current language code.
            this.languageCode = language;
            
            // Sets the cookie "locale".
            this.setCookie("locale", language, this.expiry);

        }

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

            // Adds the expiry date (in UTC time).
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
     * @params name The name of the cookie
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