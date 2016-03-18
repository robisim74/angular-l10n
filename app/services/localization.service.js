/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */
System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', 'rxjs/add/operator/map', './locale.service'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1, locale_service_1;
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
            function (_1) {},
            function (locale_service_1_1) {
                locale_service_1 = locale_service_1_1;
            }],
        execute: function() {
            /**
             * LocalizationService class.
             *
             * How to use the translation service.
             *
             * // Services.
             * import {LocaleService} from './services/locale.service'; // LocaleService class.
             * import {LocalizationService} from './services/localization.service'; // LocalizationService class.
             * // Pipes.
             * import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.
             *
             * @Component({
             *      selector: 'app-component',
             *      ...
             *      providers: [LocaleService, LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
             *      pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
             * })
             *
             * export class AppComponent {
             *
             *      constructor(public locale: LocaleService, public localization: LocalizationService) {
             *
             *          // Initializes the LocaleService.
             *          this.locale.addLanguage('en'); // Required: adds a new language.
             *          this.locale.addLanguage('it');
             *          ...
             *          this.locale.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
             *
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
             * To initialize the LocalizationService for the direct loading, add the following code in the body of the constructor of the route component:
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
             * Asynchronous loading.
             *
             * To initialize the LocalizationService for the asynchronous loading add the following code in the body of the constructor of the route component:
             *
             * this.localization.translationProvider('./resources/locale-'); // Required: Initializes the translation provider with the given path prefix.
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
             * Use the escape character \ to insert special characters into the values of the translations:
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
             * selectLanguage(language) {
             *
             *      this.locale.setCurrentLanguage(language);
             *
             * }
             *
             * where "language" is the two-letter code of the language; then add in the view:
             *
             * <a (click)="selectLanguage('en')">English</a>
             * ...
             *
             * @author Roberto Simonetti
             */
            LocalizationService = (function () {
                function LocalizationService(http, locale) {
                    this.http = http;
                    this.locale = locale;
                    /**
                     * The translations data: {locale: {key: value}}.
                     */
                    this.translationsData = {};
                    this.prefix = "";
                    this.languageCode = "";
                    // Initializes the service state.
                    this.isReady = false;
                }
                /**
                 * Direct loading: adds new translation data.
                 *
                 * @params language The two-letter code of the language for the translation data
                 * @params translation The new translation data
                 */
                LocalizationService.prototype.addTranslation = function (language, translation) {
                    // Adds the new translation data.
                    this.translationsData[language] = translation;
                    // Updates the service state.
                    this.isReady = true;
                };
                /**
                 * Asinchronous loading: defines the translation provider.
                 *
                 * @params prefix The path prefix of the json files
                 */
                LocalizationService.prototype.translationProvider = function (prefix) {
                    this.prefix = prefix;
                };
                /**
                 * Gets the json data.
                 */
                LocalizationService.prototype.getTranslation = function () {
                    var _this = this;
                    // Initializes the translations data & the service state.
                    this.translationsData = {};
                    this.isReady = false;
                    var url = this.prefix + this.languageCode + '.json';
                    // Angular 2 Http module.
                    this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .subscribe(
                    // Observer or next.
                    function (res) {
                        // Assigns the observer to the traslations data.
                        _this.translationsData[_this.languageCode] = res;
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
                 * Translate a key.
                 *
                 * @params key The key to be translated
                 * @return An observable of the value of the translation
                 */
                LocalizationService.prototype.translate = function (key) {
                    var _this = this;
                    return new Observable_1.Observable(function (observer) {
                        var value;
                        if (_this.translationsData[_this.languageCode] != null) {
                            // Gets the translation by language code. 
                            var translation = _this.translationsData[_this.languageCode];
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
                 * When the language changes, updates the language code and loads the translations data for the asynchronous loading.
                 */
                LocalizationService.prototype.updateTranslation = function () {
                    // Updates the language code for the service.
                    this.languageCode = this.locale.getCurrentLanguage();
                    // Asynchronous loading.
                    if (this.prefix != "") {
                        // Updates the translations data.  
                        this.getTranslation();
                    }
                };
                LocalizationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, locale_service_1.LocaleService])
                ], LocalizationService);
                return LocalizationService;
            }());
            exports_1("LocalizationService", LocalizationService);
        }
    }
});
