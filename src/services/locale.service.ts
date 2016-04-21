/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from 'angular2/core';

/**
 * LocaleService class.
 * 
 * Instantiate this class only once in the route component in order to access the data of location from anywhere in the application: 
 * 
 * // Services.
 * import {LocaleService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *      selector: 'app-component',
 *      ...
 *      providers: [LocaleService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *      constructor(public locale: LocaleService) {
 * 
 *          // Initializes LocaleService.
 *          this.locale.addLanguage('en'); // Required: adds a new language (ISO 639 two-letter code).
 *          // Add a new language here.
 *          this.locale.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *          
 *          // Optional: default country for date & numbers (ISO 3166 two-letter, uppercase code). 
 *          this.locale.definePreferredCountry('US');
 *          // Optional: default currency (ISO 4217 three-letter code).
 *          this.locale.definePreferredCurrency('USD');
 * 
 *      }
 * 
 * }
 * 
 * Also add in the main:
 * 
 * bootstrap(AppComponent, [HTTP_PROVIDERS]);
 * 
 * 
 * Changing language.
 * 
 * To change language at runtime, call the following method:
 *  
 * this.locale.setCurrentLanguage(language);
 * 
 * where 'language' is the two-letter code of the new language (ISO 639).
 * 
 * 
 * Changing country.
 * 
 * To change country at runtime, call the following method:
 *  
 * this.locale.setCurrentCountry(country);
 * 
 * where 'country' is the two-letter, uppercase code of the new country (ISO 3166).
 *
 * 
 * Changing currency.
 * 
 * To change currency at runtime, call the following method:
 *  
 * this.locale.setCurrentCurrency(currency);
 * 
 * where 'currency' is the three-letter code of the new currency (ISO 4217).
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocaleService {

    /**
     * Current language code.
     */
    private languageCode: string;

    /**
     * Current country code.
     */
    private countryCode: string;

    /**
     * Current currency code.
     */
    private currencyCode: string;

    /**
     * Default locale.
     */
    private defaultLocale: string;

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
        this.countryCode = "";
        this.currencyCode = "";
        this.defaultLocale = "";

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
        var locale: string = this.getCookie("locale");
        // Gets the two-letter code. 
        this.languageCode = locale.substring(0, 2);

        if (this.languageCode == "") {

            // Gets the current language of the browser or the default language.
            var browserLanguage: string = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

            browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    

            if (this.languageCodes.indexOf(browserLanguage) != -1) {

                this.languageCode = browserLanguage;

            } else {

                this.languageCode = defaultLanguage.toLowerCase();

            }

            // Sets the default locale.
            this.setDefaultLocale();

            // Sets the cookie "locale".
            this.setCookie("locale", this.defaultLocale, this.expiry);

        }

    }

    /**
     * Defines the preferred country. 
     * 
     * @params defaultCountry The two-letter, uppercase code of the default country
     */
    definePreferredCountry(defaultCountry: string) {

        // Tries to get the cookie "locale".
        var locale: string = this.getCookie("locale");
        // Gets the two-letter, uppercase code.
        this.countryCode = locale.substring(3, 5);

        if (this.countryCode == "") {

            this.countryCode = defaultCountry.toUpperCase();

        }

        // Sets the default locale.
        this.setDefaultLocale();

        // Sets the cookie "locale".
        this.setCookie("locale", this.defaultLocale, this.expiry);

    }

    /**
     * Defines the preferred currency. 
     * 
     * @params defaultCurrency The three-letter code of the default currency
     */
    definePreferredCurrency(defaultCurrency: string) {

        // Tries to get the cookie "currency".
        this.currencyCode = this.getCookie("currency");

        if (this.currencyCode == "") {

            this.currencyCode = defaultCurrency.toUpperCase();

        }

        // Sets the cookie "currency".
        this.setCookie("currency", this.currencyCode, this.expiry);

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
     * Gets the current country.
     * 
     * @return The two-letter, uppercase code of the current country
     */
    getCurrentCountry(): string {

        return this.countryCode;

    }

    /**
     * Gets the current currency.
     * 
     * @return The three-letter code of the current currency
     */
    getCurrentCurrency(): string {

        return this.currencyCode;

    }

    /**
     * Sets the current language.
     * 
     * @params language The two-letter code of the new language
     */
    setCurrentLanguage(language: string) {

        language = language.toLowerCase();

        // Checks if the language has changed.
        if (this.languageCode != language) {

            // Sets the current language code.
            this.languageCode = language;

            // Sets the default locale.
            this.setDefaultLocale();

            // Sets the cookie "locale".
            this.setCookie("locale", this.defaultLocale, this.expiry);

        }

    }

    /**
     * Sets the current country.
     * 
     * @params country The two-letter, uppercase code of the new country
     */
    setCurrentCountry(country: string) {

        country = country.toUpperCase();

        // Checks if the country has changed.
        if (this.countryCode != country) {

            // Sets the current country code.
            this.countryCode = country;

            // Sets the default locale.
            this.setDefaultLocale();

            // Sets the cookie "locale".
            this.setCookie("locale", this.defaultLocale, this.expiry);

        }

    }

    /**
     * Sets the current currency.
     * 
     * @params currency The three-letter code of the new currency
     */
    setCurrentcurrency(currency: string) {

        currency = currency.toUpperCase();

        // Checks if the currency has changed.
        if (this.currencyCode != currency) {

            // Sets the current currency code.
            this.currencyCode = currency;

            // Sets the cookie "currency".
            this.setCookie("currency", this.currencyCode, this.expiry);

        }

    }

    /**
     * Gets the default locale.
     * 
     * @return The default locale
     */
    getDefaultLocale(): string {

        return this.defaultLocale;

    }

    private setDefaultLocale() {

        this.defaultLocale = this.languageCode

        if (this.countryCode != "") {

            this.defaultLocale = this.defaultLocale + "-" + this.countryCode;

        }

    }

    /**
     * Sets the cookie.
     * 
     * @params name The name of the cookie
     * @params value The value of the cookie
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
     * @return The value of the cookie
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