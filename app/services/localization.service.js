/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */
System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', 'rxjs/add/operator/map'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1;
    var LocalizationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_1) {}],
        execute: function() {
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
             * this.localization.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
             *
             * Asynchronous loading.
             *
             * To inizialize the LocalizationService for the asynchronous loading add the following code in the body of the constructor of the route component:
             *
             * this.localization.addTranslation('en'); // Required: adds a new language code.
             * this.localization.addTranslation('it');
             * ...
             *
             * this.localization.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
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
            LocalizationService = (function () {
                function LocalizationService(http) {
                    this.http = http;
                    /**
                     * The available languages codes.
                     */
                    this.localesData = [];
                    /**
                     * The translations data: {locale: {key: value}}.
                     */
                    this.translationsData = {};
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
                LocalizationService.prototype.addTranslation = function (locale, translation) {
                    this.localesData.push(locale);
                    // Direct loading.
                    if (translation != null) {
                        this.translationsData[locale] = translation;
                        // Updates the service state.
                        this.isReady = true;
                    }
                };
                /**
                 * Direct & asynchronous loading: defines the preferred language.
                 * Selects the current language of the browser if it has been added, else the default language.
                 *
                 * @params defaultLanguage
                 * @params expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
                 */
                LocalizationService.prototype.definePreferredLanguage = function (defaultLanguage, expiry) {
                    this.expiry = expiry;
                    // Tries to get the cookie "locale".
                    this.locale = this.getCookie("locale");
                    if (this.locale == "") {
                        // Gets the current language of the browser or the default language.
                        var browserLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
                        browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    
                        if (this.localesData.indexOf(browserLanguage) != -1) {
                            this.locale = browserLanguage;
                        }
                        else {
                            this.locale = defaultLanguage;
                        }
                        // Sets the cookie "locale".
                        this.setCookie("locale", this.locale, this.expiry);
                    }
                };
                /**
                 * Asinchronous loading: defines the translation provider & gets the json data.
                 *
                 * @params prefix The path prefix of the json files
                 */
                LocalizationService.prototype.translationProvider = function (prefix) {
                    var _this = this;
                    // Inizializes the translations data & the service state.
                    this.translationsData = {};
                    this.isReady = false;
                    this.prefix = prefix;
                    var url = this.prefix + this.locale + '.json';
                    // Angular 2 Http module.
                    this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .subscribe(
                    // Observer or next.
                    function (res) {
                        // Assigns the observer to the traslations data.
                        _this.translationsData[_this.locale] = res;
                    }, 
                    // Error.
                    function (error) {
                        console.error("Localization service:", error);
                    }, 
                    // Complete.
                    function () {
                        // Updates the service state.
                        _this.isReady = true;
                        console.log("Localization service:", "Http get method completed.");
                    });
                };
                /**
                 * Gets the current language.
                 *
                 * @return The current language code
                 */
                LocalizationService.prototype.getCurrentLanguage = function () {
                    return this.locale;
                };
                /**
                 * Sets the current language.
                 *
                 * @params locale The new language code
                 */
                LocalizationService.prototype.setCurrentLanguage = function (locale) {
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
                };
                /**
                 * Gets the translation.
                 *
                 * @params key The key to be translated
                 * @return An observable of the value of the translation
                 */
                LocalizationService.prototype.translate = function (key) {
                    var _this = this;
                    return new Observable_1.Observable(function (observer) {
                        var value;
                        if (_this.translationsData[_this.locale] != null) {
                            // Gets the translation by locale. 
                            var translation = _this.translationsData[_this.locale];
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
                };
                /**
                 * Sets the cookie.
                 *
                 * @params name The name of the cookie
                 * @params value The language code
                 * @params days Number of days on the expiry
                 */
                LocalizationService.prototype.setCookie = function (name, value, days) {
                    if (days != null) {
                        // Adds an expiry date (in UTC time).
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
                 * @paramss name The name of the cookie
                 * @return The language code
                 */
                LocalizationService.prototype.getCookie = function (name) {
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
                LocalizationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], LocalizationService);
                return LocalizationService;
            })();
            exports_1("LocalizationService", LocalizationService);
        }
    }
});
