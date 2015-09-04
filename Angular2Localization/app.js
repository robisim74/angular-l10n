/// <reference path="./typings/tsd.d.ts" />
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
var angular2_1 = require('angular2/angular2');
var http_1 = require('http/http');
var home_1 = require('./components/home/home');
var localization_1 = require('./services/localization');
var app = (function () {
    function app(localization) {
        // DIRECT LOADING
        // UNCOMMENT FOLLOWING CODE FOR DIRECT LOADING
        //// initialize localization: direct loading
        //// translations data
        // var translationEN = {
        //    TITLE: 'ANGULAR 2 LOCALIZATION',
        //    CHANGE_LANGUAGE: 'change language',
        //    HELLO: 'hello',
        //    SUBTITLE: "direct loading",
        //    DESCRIPTION: "this translation has been directly loaded"
        //}
        //var translationIT = {
        //    TITLE: 'ANGULAR 2 LOCALIZZAZIONE',
        //    CHANGE_LANGUAGE: 'cambia lingua',
        //    HELLO: 'ciao',
        //    SUBTITLE: "carimento diretto",
        //    DESCRIPTION: "questa traduzione è stata caricata direttamente"
        //}
        //// add a new translation here 
        //     
        //this.localization.addTranslation('en', translationEN); // required (parameters: language, translation)
        //this.localization.addTranslation('it', translationIT);  
        //// add a new language here  
        //this.localization.definePreferredLanguage('en'); // required: define preferred language (parameter: default language)
        //// end localization
        this.localization = localization;
        this.localization.addTranslation('en');
        this.localization.addTranslation('it');
        this.localization.definePreferredLanguage('en');
        this.localization.translationProvider('./resources/locale-');
    }
    app.prototype.translate = function (key) {
        return this.localization.asyncTranslate(key);
    };
    app.prototype.currentLanguage = function () {
        return this.localization.getCurrentLanguage();
    };
    app.prototype.selectLanguage = function (locale) {
        this.localization.setCurrentLanguage(locale);
    };
    app = __decorate([
        angular2_1.Component({
            selector: 'app',
            bindings: [localization_1.Localization]
        }),
        angular2_1.View({
            templateUrl: './app.html',
            directives: [home_1.home, angular2_1.NgIf]
        }), 
        __metadata('design:paramtypes', [localization_1.Localization])
    ], app);
    return app;
})();
angular2_1.bootstrap(app, [http_1.HTTP_BINDINGS]);
