/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, EventEmitter, Output} from '@angular/core';

/**
 * LocaleService class.
 * 
 * Instantiate this class only once in the route component in order to access the data of location from anywhere in the application: 
 * 
 * FIRST SCENARIO - Dates & numbers.
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *     selector: 'app-component',
 *     ...
 *     providers: [LocaleService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 * 
 *         // Required: default language (ISO 639 two-letter code) and country (ISO 3166 two-letter, uppercase code).
 *         this.locale.definePreferredLocale('en', 'US');
 * 
 *         // Optional: default currency (ISO 4217 three-letter code).
 *         this.locale.definePreferredCurrency('USD');
 * 
 *      }
 * 
 * }
 * 
 * SECOND SCENARIO - Messages.
 * 
 * import {LocaleService, LocalizationService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *     selector: 'app-component',
 *     ...
 *     providers: [LocaleService, LocalizationService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *         // Adds a new language (ISO 639 two-letter code).
 *         this.locale.addLanguage('en');
 *         // Add a new language here.
 * 
 *         // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *         this.locale.definePreferredLanguage('en', 30);
 *           
 *     }
 * 
 * }
 * 
 * THIRD SCENARIO - Messages, dates & numbers.
 * 
 * import {LocaleService, LocalizationService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *     selector: 'app-component',
 *     ...
 *     providers: [LocaleService, LocalizationService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *         // Adds a new language (ISO 639 two-letter code).
 *         this.locale.addLanguage('en');
 *         // Add a new language here.
 * 
 *         // Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *         this.locale.definePreferredLocale('en', 'US', 30);
 *  
 *         // Optional: default currency (ISO 4217 three-letter code).
 *         this.locale.definePreferredCurrency('USD');
 * 
 *     }
 * 
 * }
 * 
 * Changing language.
 * 
 * To change language at runtime, call the following methods:
 *  
 * this.locale.setCurrentLanguage(language);
 * this.localization.updateTranslation(); // Need to update the translation.
 * 
 * where 'language' is the two-letter code of the new language (ISO 639).
 * 
 * 
 * Changing locale.
 * 
 * To change locale at runtime, call the following methods:
 *  
 * this.locale.setCurrentLocale(language, country);
 * this.localization.updateTranslation(); // Need to update the translation.
 * 
 * where 'language' is the two-letter code of the new language (ISO 639)
 * and 'country' is the two-letter, uppercase code of the new country (ISO 3166).
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
     * Output for event current language code changed.
     */
    @Output() languageCodeChanged = new EventEmitter<string>();

    /**
     * Output for event current country code changed.
     */
    @Output() countryCodeChanged = new EventEmitter<string>();

    /**
     * Output for event current currency code changed.
     */
    @Output() currencyCodeChanged = new EventEmitter<string>();

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
     * The available language codes.
     */
    private languageCodes: Array<string> = [];

    /**
     * Defines when the cookie will be removed.
     */
    private expiry: number;
        
    /**
     * Reference counter for the service. 
     */
    private static referenceCounter: number = 0;

    /**
     * Enable/disable cookie.
     */
    public enableCookie: boolean = false;

    constructor() {

        this.languageCode = "";
        this.countryCode = "";
        this.currencyCode = "";
        this.defaultLocale = "";
        
        // Counts the reference to the service.
        LocaleService.referenceCounter++;

        // Enables the cookies only for the first instance of the service (see issue #11).
        if (LocaleService.referenceCounter == 1) {

            this.enableCookie = true;

        }

    }

    /**
     * Adds a new language.
     * 
     * @param language The two-letter code of the new language
     */
    addLanguage(language: string) {

        this.languageCodes.push(language);

    }

    /**
     * Defines the preferred language. 
     * Selects the current language of the browser if it has been added, else the default language. 
     * 
     * @param defaultLanguage The two-letter code of the default language
     * @param expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
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

            if (this.languageCodes.length > 0 && this.languageCodes.indexOf(browserLanguage) != -1) {

                this.languageCode = browserLanguage;

            } else {

                this.languageCode = defaultLanguage.toLowerCase();

            }

            // Sets the default locale.
            this.setDefaultLocale();

            if (this.languageCodes.length > 0) {

                // Sets the cookie "locale".
                this.setCookie("locale", this.defaultLocale, this.expiry);

            }

        } else {

            // Sets the default locale.
            this.setDefaultLocale();

        }

    }

    /**
     * Defines preferred languange and country, regardless of the browser language.
     * 
     * @param defaultLanguage The two-letter code of the default language
     * @param defaultCountry The two-letter, uppercase code of the default country
     * @param expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     */
    definePreferredLocale(defaultLanguage: string, defaultCountry: string, expiry?: number) {

        this.expiry = expiry;

        // Tries to get the cookie "locale".
        var locale: string = this.getCookie("locale");
        // Gets the two-letter code. 
        this.languageCode = locale.substring(0, 2);

        if (this.languageCode == "") {

            this.languageCode = defaultLanguage.toLowerCase();
            this.countryCode = defaultCountry.toUpperCase();

            // Sets the default locale.
            this.setDefaultLocale();

            if (this.languageCodes.length > 0) {

                // Sets the cookie "locale".
                this.setCookie("locale", this.defaultLocale, this.expiry);

            }

        } else {

            // Gets the two-letter, uppercase code.
            this.countryCode = locale.substring(3, 5);

            if (this.countryCode == "") {

                this.countryCode = defaultCountry.toUpperCase();

                // Sets the default locale.
                this.setDefaultLocale();

                if (this.languageCodes.length > 0) {

                    // Sets the cookie "locale".
                    this.setCookie("locale", this.defaultLocale, this.expiry);

                }

            } else {

                // Sets the default locale.
                this.setDefaultLocale();

            }

        }

    }

    /**
     * Defines the preferred currency. 
     * 
     * @param defaultCurrency The three-letter code of the default currency
     */
    definePreferredCurrency(defaultCurrency: string) {

        // Tries to get the cookie "currency".
        this.currencyCode = this.getCookie("currency");

        if (this.currencyCode == "") {

            this.currencyCode = defaultCurrency.toUpperCase();

            if (this.languageCodes.length > 0) {

                // Sets the cookie "currency".
                this.setCookie("currency", this.currencyCode, this.expiry);

            }

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
     * @param language The two-letter code of the new language
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

            // Sends an event.
            this.languageCodeChanged.emit(language);
        }

    }

    /**
     * Sets the current country.
     * 
     * @param country The two-letter, uppercase code of the new country
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

            // Sends an event.
            this.countryCodeChanged.emit(country);
        }

    }

    /**
     * Sets the current locale.
     * 
     * @param language The two-letter code of the new language
     * @param country The two-letter, uppercase code of the new country
     */
    setCurrentLocale(language: string, country: string) {

        language = language.toLowerCase();
        country = country.toUpperCase();

        // Checks if language or country have changed.
        if (this.languageCode != language || this.countryCode != country) {

            // Sets the current language code.
            this.languageCode = language;
            // Sets the current country code.
            this.countryCode = country;

            // Sets the default locale.
            this.setDefaultLocale();

            // Sets the cookie "locale".
            this.setCookie("locale", this.defaultLocale, this.expiry);

            // Sends the events.
            this.countryCodeChanged.emit(country);
            this.languageCodeChanged.emit(language);
        }

    }

    /**
     * Sets the current currency.
     * 
     * @param currency The three-letter code of the new currency
     */
    setCurrentCurrency(currency: string) {

        currency = currency.toUpperCase();

        // Checks if the currency has changed.
        if (this.currencyCode != currency) {

            // Sets the current currency code.
            this.currencyCode = currency;

            // Sets the cookie "currency".
            this.setCookie("currency", this.currencyCode, this.expiry);

            // Sends an event.
            this.currencyCodeChanged.emit(currency);
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
     * @param name The name of the cookie
     * @param value The value of the cookie
     * @param days Number of days on the expiry
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
        if (this.enableCookie == true) {

            document.cookie = name + "=" + value + expires + "; path=/";

        }

    }

    /**
     * Gets the cookie.
     * 
     * @param name The name of the cookie
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