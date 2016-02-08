/**
 * ANGULAR 2 LOCALIZATION
 * An injectable class to translate in the new Angular 2 applications using TypeScript
 * through the direct or asynchronous loading of translations
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */
System.register(['angular2/core', 'angular2/http', 'rxjs/add/operator/map'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, core_2;
    var Localization, LocalizationPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
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
             * class AppComponent {
             *      constructor(public localization: Localization){
             *      ...
             *  }
             * }
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
            Localization = (function () {
                function Localization(http) {
                    this.http = http;
                    this.languagesData = []; // Array of the available languages codes.
                    this.translationsData = {}; // Object of the translations.
                }
                /**
                 * Direct & asynchronous loading: adds a new translation.
                 *
                 * @param locale The language of translation
                 * @param translation Nullable
                 */
                Localization.prototype.addTranslation = function (locale, translation) {
                    this.languagesData.push(locale);
                    if (translation != null) {
                        // Direct loading.
                        this.translationsData[locale] = translation;
                    }
                };
                /**
                 * Defines the preferred language.
                 *
                 * @param defaultLanguage
                 * @param expires Nullable expiry (No days)
                 */
                Localization.prototype.definePreferredLanguage = function (defaultLanguage, expires) {
                    this.expires = expires;
                    // Tries to get the cookie.
                    this.locale = this.getCookie("locale"); // Calls the getCookie method.
                    if (this.locale == null) {
                        // Gets the current browser language or the default language.
                        var browserLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
                        browserLanguage = browserLanguage.substring(0, 2); // Gets the two-letter code.    
                        if (this.languagesData.indexOf(browserLanguage) != -1) {
                            this.locale = browserLanguage;
                        }
                        else {
                            this.locale = defaultLanguage;
                        }
                        this.setCookie("locale", this.locale, this.expires); // Calls the setCookie method.
                    }
                };
                /**
                 * Asinchronous loading: defines the translation provider & gets the json data.
                 *
                 * @param prefix The path prefix
                 */
                Localization.prototype.translationProvider = function (prefix) {
                    var _this = this;
                    this.prefix = prefix;
                    var url = this.prefix + this.locale + '.json';
                    // Angular 2 Http module.
                    this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (res) { return _this.translationsData = res; }, function (exception) { return _this.onError; }, this.onCompleted);
                };
                Localization.prototype.onCompleted = function () {
                    console.log("translationProvider:", "http get method completed.");
                };
                Localization.prototype.onError = function (exception) {
                    console.error("translationProvider:", exception);
                };
                /**
                 * Gets the current language.
                 *
                 * @return The current language.
                 */
                Localization.prototype.getCurrentLanguage = function () {
                    return this.locale;
                };
                /**
                 * Sets the current language.
                 *
                 * @param locale The new language
                 */
                Localization.prototype.setCurrentLanguage = function (locale) {
                    if (this.locale != locale) {
                        this.setCookie("locale", locale, this.expires); // Calls the setCookie method.      
                        this.locale = locale; // Sets the language code.
                        if (this.prefix != null) {
                            this.translationProvider(this.prefix); // Updates the translations data.               
                        }
                    }
                };
                /**
                 * Gets the translation.
                 *
                 * @param key The key to be translated.
                 * @return The value of the translation.
                 */
                Localization.prototype.translate = function (key) {
                    var value;
                    if (this.translationsData[this.locale] == null) {
                        // Gets the translation through asynchronously loading.
                        value = this.translationsData[key]; // Gets the translated value by key.
                    }
                    else {
                        // Gets the translation through direct loading.
                        var translation = this.translationsData[this.locale]; // Gets the translations by locale.       
                        value = translation[key]; // Gets the translated value by key.          
                    }
                    // If the key value is not present, the same key is returned (see issue #1).
                    if (value == null) {
                        value = key;
                    }
                    return value;
                };
                /**
                 * Sets cookie.
                 *
                 * @param name
                 * @param value
                 * @param days Expiry
                 */
                Localization.prototype.setCookie = function (name, value, days) {
                    if (days != null) {
                        var expirationDate = new Date();
                        expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + expirationDate.toUTCString();
                    }
                    else {
                        var expires = "";
                    }
                    document.cookie = name + "=" + value + expires + "; path=/";
                };
                /**
                 * Gets cookie.
                 *
                 * @param name
                 */
                Localization.prototype.getCookie = function (name) {
                    name += "=";
                    var ca = document.cookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return null;
                };
                Localization = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], Localization);
                return Localization;
            })();
            exports_1("Localization", Localization);
            /**
             * Translate pipe function.
             */
            LocalizationPipe = (function () {
                function LocalizationPipe(localization) {
                    this.localization = localization;
                }
                /**
                 * Translate pipe transform method.
                 *
                 * @param key The translation key.
                 * @return The translated value.
                 */
                LocalizationPipe.prototype.transform = function (key) {
                    return this.localization.translate(key);
                };
                LocalizationPipe = __decorate([
                    core_2.Pipe({
                        name: 'translate',
                        pure: false // Required to update the value.
                    }),
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Localization])
                ], LocalizationPipe);
                return LocalizationPipe;
            })();
            exports_1("LocalizationPipe", LocalizationPipe);
        }
    }
});
