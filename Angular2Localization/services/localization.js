// ANGULAR 2 LOCALIZATION
// an injectable class for localization of angular 2 applications
// by direct or asynchronous loading of translations
// written by roberto simonetti
// MIT license
// https://github.com/robisim74/angular2localization
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// dependencies:
// - angular: v2.0.0-alpha.44
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
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
 * bootstrap(app, [HTTP_PROVIDERS]);
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
 * this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
 */
/**
 * ASYNCHRONOUS LOADING
 * to inizialize localization by asynchronous loading add the following code in the body of constructor of route component:
 *
 * this.localization.addTranslation('en'); // required: add a new translations (parameter: a new language)
 * this.localization.addTranslation('it');
 * // add a new language here
 * this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
 * this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider (parameter: path prefix)
 *
 * and create the json files of translations such as "locale-en.json"
 * (url is obtained concatenating {prefix} + {locale language code} + ".json")
 */
var Localization = (function () {
    function Localization(http) {
        this.http = http;
        this.languagesData = []; // array of available languages codes
        this.translationsData = {}; // object of translations
    }
    // direct & asynchronous loading: add a new translation
    Localization.prototype.addTranslation = function (locale, translation) {
        this.languagesData.push(locale);
        if (translation != null) {
            // direct loading
            this.translationsData[locale] = translation;
        }
    };
    // define preferred language
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
    // asinchronous loading: define translation provider & get json data
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
    // get current language
    Localization.prototype.getCurrentLanguage = function () {
        return this.locale;
    };
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
    Localization.prototype.translate = function (key) {
        var translation = this.translationsData[this.locale]; // get translations by locale       
        var value = translation[key]; // get translated value by key
        return value;
    };
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
    Localization.prototype.asyncTranslate = function (key) {
        var value = this.translationsData[key]; // get translated value by key
        return value;
    };
    // cookies methods
    // set cookie
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
    // get cookie
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
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Localization);
    return Localization;
})();
exports.Localization = Localization;
// end localization class
