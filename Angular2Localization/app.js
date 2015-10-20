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
var http_1 = require('angular2/http'); // http module
var home_1 = require('./components/home/home');
var localization_1 = require('./services/localization'); // localization class & pipe
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
        //this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
        //// end localization
        this.localization = localization;
        // ASYNCHRONOUS LOADING
        // COMMENT FOLLOWING CODE IF DIRECT LOADING
        // initialize localization: asynchronous loading               
        this.localization.addTranslation('en'); // required: add a new translations (parameter: a new language)
        this.localization.addTranslation('it');
        // add a new language here
        this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
        this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider (parameter: path prefix)
        // end localization
    }
    // CHANGE LANGUAGE
    // return the current language
    app.prototype.currentLanguage = function () {
        return this.localization.getCurrentLanguage();
    };
    // select language
    app.prototype.selectLanguage = function (locale) {
        this.localization.setCurrentLanguage(locale);
    };
    app = __decorate([
        // localization class & pipe
        angular2_1.Component({
            selector: 'app',
            templateUrl: './app.html',
            directives: [home_1.home, angular2_1.NgIf],
            providers: [localization_1.Localization, localization_1.LocalizationPipe],
            pipes: [localization_1.LocalizationPipe] // add in each component to invoke the transform method
        }), 
        __metadata('design:paramtypes', [localization_1.Localization])
    ], app);
    return app;
})();
angular2_1.bootstrap(app, [http_1.HTTP_PROVIDERS]); // http providers
