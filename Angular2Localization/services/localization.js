/**
 * ANGULAR 2 LOCALIZATION
 * an injectable class to translate in the new angular 2 applications using typescript
 * through direct or asynchronous loading of translations
 * written by roberto simonetti
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
             *
             * DIRECT LOADING
             * to inizialize localization by direct loading add the following code in the body of constructor of route component:
             *
             * var translationEN = {
             *      EXAMPLE: 'example',
             *      ...
             * }
             * // add a new translation here
             *
             * this.localization.addTranslation('en', translationEN); // required: add language and translation
             * this.localization.addTranslation('it', translationIT);
             * // add a new language here
             * this.localization.definePreferredLanguage('en', 30); // required: define preferred language and expiry (No days) - if omitted, the cookie becomes a session cookie
             *
             * ASYNCHRONOUS LOADING
             * to inizialize localization by asynchronous loading add the following code in the body of constructor of route component:
             *
             * this.localization.addTranslation('en'); // required: add a new translations
             * this.localization.addTranslation('it');
             * // add a new language here
             * this.localization.definePreferredLanguage('en', 30); // required: define preferred language and expiry (No days) - if omitted, the cookie becomes a session cookie
             * this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider with the path prefix
             *
             * and create the json files of translations such as "locale-en.json"
             * (the url is obtained concatenating {prefix} + {locale language code} + ".json")
             *
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
             *
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
             *
             * @author roberto simonetti
             */
            Localization = (function () {
                function Localization(http) {
                    this.http = http;
                    this.languagesData = []; // array of available languages codes
                    this.translationsData = {}; // object of translations
                }
                /**
                 * direct & asynchronous loading: add a new translation
                 *
                 * @param locale the language of translation
                 * @param translation nullable
                 */
                Localization.prototype.addTranslation = function (locale, translation) {
                    this.languagesData.push(locale);
                    if (translation != null) {
                        // direct loading
                        this.translationsData[locale] = translation;
                    }
                };
                /**
                 * define preferred language
                 *
                 * @param defaultLanguage
                 * @param expires nullable expires (No days)
                 */
                Localization.prototype.definePreferredLanguage = function (defaultLanguage, expires) {
                    this.expires = expires;
                    // try to get cookie
                    this.locale = this.getCookie("locale"); // call get cookie method
                    if (this.locale == null) {
                        // get current browser language or default language
                        var browserLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
                        browserLanguage = browserLanguage.substring(0, 2); // get two-letter code    
                        if (this.languagesData.indexOf(browserLanguage) != -1) {
                            this.locale = browserLanguage;
                        }
                        else {
                            this.locale = defaultLanguage;
                        }
                        this.setCookie("locale", this.locale, this.expires); // call set cookie method
                    }
                };
                /**
                 * asinchronous loading: define translation provider & get json data
                 *
                 * @param prefix the path prefix
                 */
                Localization.prototype.translationProvider = function (prefix) {
                    var _this = this;
                    this.prefix = prefix;
                    var url = this.prefix + this.locale + '.json';
                    // angular 2 http module
                    this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (res) { return _this.translationsData = res; }, function (exception) { return _this.onError; }, this.onCompleted);
                };
                Localization.prototype.onCompleted = function () {
                    console.log("translationProvider:", "http get completed");
                };
                Localization.prototype.onError = function (exception) {
                    console.error("translationProvider:", exception);
                };
                /**
                 * get current language
                 *
                 * @return the current language
                 */
                Localization.prototype.getCurrentLanguage = function () {
                    return this.locale;
                };
                /**
                 * set current language
                 *
                 * @param locale new language
                 */
                Localization.prototype.setCurrentLanguage = function (locale) {
                    if (this.locale != locale) {
                        this.setCookie("locale", locale, this.expires); // call set cookie method      
                        this.locale = locale; // set language code
                        if (this.prefix != null) {
                            this.translationProvider(this.prefix); // update translations data               
                        }
                    }
                };
                /**
                 * get translation
                 *
                 * @param key of translation
                 * @return value of translation
                 */
                Localization.prototype.translate = function (key) {
                    var value;
                    if (this.translationsData[this.locale] == null) {
                        // get translation by asynchronously loading
                        value = this.translationsData[key]; // get translated value by key
                    }
                    else {
                        // get translation by direct loading
                        var translation = this.translationsData[this.locale]; // get translations by locale       
                        value = translation[key]; // get translated value by key          
                    }
                    // if the key value is not present, the same key is returned (see issue #1)
                    if (value == null) {
                        value = key;
                    }
                    return value;
                };
                /**
                 * set cookie
                 *
                 * @param name
                 * @param value
                 * @param days expiry
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
                 * get cookie
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
             * translate pipe function
             */
            LocalizationPipe = (function () {
                function LocalizationPipe(localization) {
                    this.localization = localization;
                }
                /**
                 * translate pipe transform method
                 *
                 * @param key the translation key
                 * @return the translated value
                 */
                LocalizationPipe.prototype.transform = function (key) {
                    return this.localization.translate(key);
                };
                LocalizationPipe = __decorate([
                    core_2.Pipe({
                        name: 'translate',
                        pure: false // required to update the value
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
