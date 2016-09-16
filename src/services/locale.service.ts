/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Injectable, EventEmitter, Output } from '@angular/core';

/**
 * LocaleService class.
 * Defines language, default locale & currency.
 * 
 * Instantiate this class only once in the bootstrap component in order to access the data of location from anywhere in the application: 
 * 
 * FIRST SCENARIO - Dates & numbers.
 * 
 * import {LocaleService} from 'angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 * 
 *         // Required: default language (ISO 639 two-letter or three-letter code) and country (ISO 3166 two-letter, uppercase code).
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
 * import {LocaleService, LocalizationService} from 'angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *         // Adds a new language (ISO 639 two-letter or three-letter code).
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
 * import {LocaleService, LocalizationService} from 'angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *         // Adds a new language (ISO 639 two-letter or three-letter code).
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
 * To change language at runtime, call the following method:
 *  
 * this.locale.setCurrentLanguage(language);
 * 
 * where 'language' is the two-letter or three-letter code of the new language (ISO 639).
 * 
 * 
 * Changing locale.
 * 
 * To change locale at runtime, call the following method:
 *  
 * this.locale.setCurrentLocale(language, country);
 * 
 * where 'language' is the two-letter or three-letter code of the new language (ISO 639)
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
     * Reference counter for the service. 
     */
    private static referenceCounter: number = 0;

    /**
     * Output for event current language code changed.
     */
    @Output() languageCodeChanged: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Output for event current country code changed.
     */
    @Output() countryCodeChanged: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Output for event current currency code changed.
     */
    @Output() currencyCodeChanged: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Output for event script code changed.
     */
    @Output() scriptCodeChanged: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Output for event numbering system changed.
     */
    @Output() numberingSystemChanged: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Output for event calendar changed.
     */
    @Output() calendarChanged: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Enable/disable cookie.
     */
    public enableCookie: boolean = false;

    /**
     * Enable/disable Local Storage.
     */
    public enableLocalStorage: boolean = false;

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
     * The optional script code.
     */
    private scriptCode: string;

    /**
     * The optional numbering system.
     */
    private numberingSystem: string;

    /**
     * The optional calendar.
     */
    private calendar: string;

    constructor() {

        this.languageCode = "";
        this.countryCode = "";
        this.currencyCode = "";
        this.defaultLocale = "";

        this.scriptCode = "";
        this.numberingSystem = "";
        this.calendar = "";

        // Counts the reference to the service.
        LocaleService.referenceCounter++;

        // Enables the cookies for the first instance of the service (see issue #11).
        if (LocaleService.referenceCounter == 1) {

            this.enableCookie = true;

        }

    }

    /**
     * Adds a new language.
     * 
     * @param language The two-letter or three-letter code of the new language
     */
    public addLanguage(language: string): void {

        this.languageCodes.push(language);

    }

    /**
     * Sets Local Storage as default.
     */
    public useLocalStorage(): void {

        this.enableLocalStorage = true;

    }

    /**
     * Defines the preferred language. 
     * Selects the current language of the browser if it has been added, else the default language. 
     * 
     * @param defaultLanguage The two-letter or three-letter code of the default language
     * @param expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     */
    public definePreferredLanguage(defaultLanguage: string, expiry?: number): void {

        this.expiry = expiry;

        // Parses the storage "locale" to extract the codes.
        this.parseStorage("locale");

        if (this.languageCode == "") {

            this.languageCode = defaultLanguage;

            // Verifies browser language.
            var browserLanguage: string = "";

            if (typeof navigator.language != "undefined") {
                browserLanguage = navigator.language;
            }

            // Tries to gets the current language of browser.
            if (browserLanguage != "") {

                var index: number = browserLanguage.indexOf("-");
                if (index != -1) {

                    browserLanguage = browserLanguage.substring(0, index); // Gets the language code.

                }

                if (this.languageCodes.length > 0 && this.languageCodes.indexOf(browserLanguage) != -1) {

                    this.languageCode = browserLanguage;

                }

            }

        }

        // Sets the default locale.
        this.setDefaultLocale();

    }

    /**
     * Defines preferred languange and country, regardless of the browser language.
     * 
     * @param defaultLanguage The two-letter or three-letter code of the default language
     * @param defaultCountry The two-letter, uppercase code of the default country
     * @param expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     * @param script The optional four-letter script code
     * @param numberingSystem The optional numbering system to be used
     * @param calendar The optional calendar to be used
     */
    public definePreferredLocale(defaultLanguage: string, defaultCountry: string, expiry?: number, script: string = "", numberingSystem: string = "", calendar: string = ""): void {

        this.expiry = expiry;

        // Parses the storage "locale" to extract the codes & the extension.
        this.parseStorage("locale");

        if (this.languageCode == "" || this.countryCode == "") {

            this.languageCode = defaultLanguage;
            this.countryCode = defaultCountry;
            this.scriptCode = script;
            this.numberingSystem = numberingSystem;
            this.calendar = calendar;

        }

        // Sets the default locale.
        this.setDefaultLocale();

    }

    /**
     * Defines the preferred currency. 
     * 
     * @param defaultCurrency The three-letter code of the default currency
     */
    public definePreferredCurrency(defaultCurrency: string): void {

        // Parses the storage "currency" to extract the code.
        this.parseStorage("currency");

        if (this.currencyCode == "") {

            this.currencyCode = defaultCurrency;

        }

        // Sets the storage "currency".
        this.setStorage("currency", this.currencyCode);

    }

    /**
     * Gets the current language.
     * 
     * @return The two-letter or three-letter code of the current language
     */
    public getCurrentLanguage(): string {

        return this.languageCode;

    }

    /**
     * Gets the current country.
     * 
     * @return The two-letter, uppercase code of the current country
     */
    public getCurrentCountry(): string {

        return this.countryCode;

    }

    /**
     * Gets the current currency.
     * 
     * @return The three-letter code of the current currency
     */
    public getCurrentCurrency(): string {

        return this.currencyCode;

    }

    /**
     * Gets the script.
     * 
     * @return The four-letter code of the script
     */
    public getScript(): string {

        return this.scriptCode;

    }

    /**
     * Gets the numbering system.
     * 
     * @return The numbering system
     */
    public getNumberingSystem(): string {

        return this.numberingSystem;

    }

    /**
     * Gets the calendar.
     * 
     * @return The calendar
     */
    public getCalendar(): string {

        return this.calendar;

    }

    /**
     * Sets the current language.
     * 
     * @param language The two-letter or three-letter code of the new language
     */
    public setCurrentLanguage(language: string): void {

        // Checks if the language has changed.
        if (this.languageCode != language) {

            // Assigns the value & sends an event.
            this.languageCode = language;
            this.languageCodeChanged.emit(language);

            // Sets the default locale.
            this.setDefaultLocale();

        }

    }

    /**
     * Sets the current locale.
     * 
     * @param language The two-letter or three-letter code of the new language
     * @param country The two-letter, uppercase code of the new country
     * @param script The optional four-letter script code
     * @param numberingSystem The optional numbering system to be used
     * @param calendar The optional calendar to be used
     */
    public setCurrentLocale(language: string, country: string, script: string = "", numberingSystem: string = "", calendar: string = ""): void {

        // Checks if language, country, script or extension have changed.
        if (this.languageCode != language || this.countryCode != country || this.scriptCode != script || this.numberingSystem != numberingSystem || this.calendar != calendar) {

            // Assigns the values & sends the events.
            if (this.languageCode != language) { this.languageCode = language; this.languageCodeChanged.emit(language); }
            if (this.countryCode != country) { this.countryCode = country; this.countryCodeChanged.emit(country); }
            if (this.scriptCode != script) { this.scriptCode = script; this.scriptCodeChanged.emit(script); }
            if (this.numberingSystem != numberingSystem) { this.numberingSystem = numberingSystem; this.numberingSystemChanged.emit(numberingSystem); }
            if (this.calendar != calendar) { this.calendar = calendar; this.calendarChanged.emit(calendar); }

            // Sets the default locale.
            this.setDefaultLocale();

        }

    }

    /**
     * Sets the current currency.
     * 
     * @param currency The three-letter code of the new currency
     */
    public setCurrentCurrency(currency: string): void {

        // Checks if the currency has changed.
        if (this.currencyCode != currency) {

            // Assigns the value & sends an event.
            this.currencyCode = currency;
            this.currencyCodeChanged.emit(currency);

            // Sets the storage "currency".
            this.setStorage("currency", this.currencyCode);

        }

    }

    /**
     * Gets the default locale.
     * 
     * @return The default locale
     */
    public getDefaultLocale(): string {

        return this.defaultLocale;

    }

    /**
     * Builds the default locale.
     */
    private setDefaultLocale(): void {

        this.defaultLocale = this.languageCode;

        this.defaultLocale += this.scriptCode != "" ? "-" + this.scriptCode : "";
        this.defaultLocale += this.countryCode != "" ? "-" + this.countryCode : "";

        // Adds the 'u' (Unicode) extension.
        this.defaultLocale += this.numberingSystem != "" || this.calendar != "" ? "-u" : "";
        // Adds numbering system.
        this.defaultLocale += this.numberingSystem != "" ? "-nu-" + this.numberingSystem : "";
        // Adds calendar.
        this.defaultLocale += this.calendar != "" ? "-ca-" + this.calendar : "";

        // Sets the storage "locale".
        this.setStorage("locale", this.defaultLocale);

    }

    /**
     * Parses the storage to extract the codes & the extension.
     * 
     * @param name The name of the storage
     */
    private parseStorage(name: string): void {

        var storage: string = "";

        if (this.enableLocalStorage && this.verifyLocalStorage) {

            storage = this.getLocalStorage(name);

        } else if (this.enableCookie && this.languageCodes.length > 0 && this.verifyCookie) {

            storage = this.getCookie(name);

        }

        if (storage != "") {

            // Looks for the 'u' (Unicode) extension.
            var index: number = storage.search("-u");
            if (index != -1) {

                var extensions: string[] = storage.substring(index + 1).split("-");
                switch (extensions.length) {

                    case 3:
                        if (extensions[1] == "nu") {
                            this.numberingSystem = extensions[2];
                        } else if (extensions[1] == "ca") {
                            this.calendar = extensions[2];
                        }
                        break;
                    case 5:
                        this.numberingSystem = extensions[2];
                        this.calendar = extensions[4];
                        break;

                }

                // Extracts the codes.
                storage = storage.substring(0, index);

            }

            // Splits the string to each hyphen.
            var codes: string[] = storage.split("-");

            switch (codes.length) {

                case 1:
                    if (name == "locale") {
                        this.languageCode = codes[0];
                    } else if (name == "currency") {
                        this.currencyCode = codes[0];
                    }
                    break;
                case 2:
                    this.languageCode = codes[0];
                    this.countryCode = codes[1];
                    break;
                case 3:
                    this.languageCode = codes[0];
                    this.scriptCode = codes[1];
                    this.countryCode = codes[2];
                    break;

            }

        }

    }

    /**
     * Checks browser support for Local Storage.
     * 
     * @return True if Web Storage is supported.
     */
    private verifyLocalStorage(): boolean {

        return typeof Storage != "undefined";

    }

    /**
     * Checks browser support for cookies.
     * 
     * @return True if cookies are supported.
     */
    private verifyCookie(): boolean {

        return typeof navigator.cookieEnabled != "undefined" && navigator.cookieEnabled;

    }

    /**
     * Sets the storage.
     * 
     * @param name The name of the storage
     * @param value The value of the storage
     */
    private setStorage(name: string, value: string): void {

        if (this.enableLocalStorage && this.verifyLocalStorage) {

            this.setLocalStorage(name, value);

        } else if (this.enableCookie == true && this.languageCodes.length > 0 && this.verifyCookie) {

            this.setCookie(name, value, this.expiry);

        }

    }

    /**
     * Saves Local Storage value.
     * 
     * @param name The name of the storage
     * @param value The value of the storage
     */
    private setLocalStorage(name: string, value: string): void {

        localStorage.setItem(name, value);

    }

    /**
     * Saves Local Storage value.
     * 
     * @param name The name of the storage
     * @return The value of the storage
     */
    private getLocalStorage(name: string): string {

        // If the storage is not found, returns an empty string.
        return localStorage.getItem(name) != null ? localStorage.getItem(name) : "";

    }

    /**
     * Sets the cookie.
     * 
     * @param name The name of the cookie
     * @param value The value of the cookie
     * @param days Number of days on the expiry
     */
    private setCookie(name: string, value: string, days?: number): void {

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
     * @param name The name of the cookie
     * @return The value of the cookie
     */
    private getCookie(name: string): string {

        // The text to search for.
        name += "=";

        // Splits document.cookie on semicolons into an array.
        var ca: string[] = document.cookie.split(";");

        // Loops through the ca array, and reads out each value.
        for (var i: number = 0; i < ca.length; i++) {

            var c: string = ca[i];

            while (c.charAt(0) == " ") {

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
