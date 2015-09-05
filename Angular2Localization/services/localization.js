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
/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/js-cookie/js-cookie.d.ts" />
var angular2_1 = require('angular2/angular2');
var http_1 = require('http/http');
var Localization = (function () {
    function Localization(http) {
        this.http = http;
        this.languagesData = [];
        this.translationsData = {};
    }
    Localization.prototype.addTranslation = function (locale, translation) {
        this.languagesData.push(locale);
        if (translation != null) {
            this.translationsData[locale] = translation;
        }
    };
    Localization.prototype.definePreferredLanguage = function (defaultLanguage, expires) {
        this.expires = expires;
        this.locale = Cookies.get("locale");
        if (this.locale == null) {
            var browserLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
            browserLanguage = browserLanguage.substring(0, 2);
            if (this.languagesData.indexOf(browserLanguage) != -1) {
                this.locale = browserLanguage;
            }
            else {
                this.locale = defaultLanguage;
            }
            Cookies.set("locale", this.locale, { expires: this.expires });
        }
    };
    Localization.prototype.translationProvider = function (prefix) {
        var _this = this;
        this.prefix = prefix;
        var url = this.prefix + this.locale + '.json';
        this.http.get(url)
            .toRx()
            .map(function (res) { return res.json(); })
            .subscribe(function (res) { return _this.translationsData = res; });
    };
    Localization.prototype.getCurrentLanguage = function () {
        return this.locale;
    };
    Localization.prototype.setCurrentLanguage = function (locale) {
        if (this.locale != locale) {
            Cookies.set("locale", locale, { expires: this.expires });
            this.locale = locale;
            if (this.prefix != null) {
                this.translationProvider(this.prefix);
            }
        }
    };
    Localization.prototype.translate = function (key) {
        var translation = this.translationsData[this.locale];
        var value = translation[key];
        return value;
    };
    Localization.prototype.asyncTranslate = function (key) {
        var value = this.translationsData[key];
        return value;
    };
    Localization = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Localization);
    return Localization;
})();
exports.Localization = Localization;
