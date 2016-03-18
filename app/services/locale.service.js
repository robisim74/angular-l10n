/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */
System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var LocaleService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * LocaleService class.
             *
             * Instantiate this class only once in the route component in order to access the data of location from anywhere in the application.
             *
             * @author Roberto Simonetti
             */
            LocaleService = (function () {
                function LocaleService() {
                    /**
                     * The available languages codes.
                     */
                    this.languageCodes = [];
                    this.languageCode = "";
                }
                /**
                 * Asynchronous loading: adds a new language.
                 *
                 * @params language The two-letter code of the new language
                 */
                LocaleService.prototype.addLanguage = function (language) {
                    this.languageCodes.push(language);
                };
                /**
                 * Direct & asynchronous loading: defines the preferred language.
                 * Selects the current language of the browser if it has been added, else the default language.
                 *
                 * @params defaultLanguage The two-letter code of the default language
                 * @params expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
                 */
                LocaleService.prototype.definePreferredLanguage = function (defaultLanguage, expiry) {
                    this.expiry = expiry;
                    // Tries to get the cookie "locale".
                    this.languageCode = this.getCookie("locale");
                    if (this.languageCode == "") {
                        // Gets the current language of the browser or the default language.
                        var browserLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
                        browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    
                        if (this.languageCodes.indexOf(browserLanguage) != -1) {
                            this.languageCode = browserLanguage;
                        }
                        else {
                            this.languageCode = defaultLanguage;
                        }
                        // Sets the cookie "locale".
                        this.setCookie("locale", this.languageCode, this.expiry);
                    }
                };
                /**
                 * Gets the current language.
                 *
                 * @return The two-letter code of the current language
                 */
                LocaleService.prototype.getCurrentLanguage = function () {
                    return this.languageCode;
                };
                /**
                 * Sets the current language.
                 *
                 * @params language The two-letter code of the new language
                 */
                LocaleService.prototype.setCurrentLanguage = function (language) {
                    // Checks if the language is changed.
                    if (this.languageCode != language) {
                        // Sets the current language code.
                        this.languageCode = language;
                        // Sets the cookie "locale".
                        this.setCookie("locale", language, this.expiry);
                    }
                };
                /**
                 * Sets the cookie.
                 *
                 * @params name The name of the cookie
                 * @params value The language code
                 * @params days Number of days on the expiry
                 */
                LocaleService.prototype.setCookie = function (name, value, days) {
                    if (days != null) {
                        // Adds the expiry date (in UTC time).
                        var expirationDate = new Date();
                        expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + expirationDate.toUTCString();
                    }
                    else {
                        // By default, the cookie is deleted when the browser is closed.
                        var expires = "";
                    }
                    // Creates the cookie.
                    document.cookie = name + "=" + value + expires + "; path=/";
                };
                /**
                 * Gets the cookie.
                 *
                 * @params name The name of the cookie
                 * @return The language code
                 */
                LocaleService.prototype.getCookie = function (name) {
                    // The text to search for.
                    name += "=";
                    // Splits document.cookie on semicolons into an array.
                    var ca = document.cookie.split(';');
                    // Loops through the ca array, and reads out each value.
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
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
                };
                LocaleService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], LocaleService);
                return LocaleService;
            }());
            exports_1("LocaleService", LocaleService);
        }
    }
});
