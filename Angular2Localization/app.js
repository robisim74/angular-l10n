System.register(['angular2/core', 'angular2/platform/browser', 'angular2/http', './components/home/home', './services/localization'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, browser_1, http_1, home_1, localization_1;
    var app;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (home_1_1) {
                home_1 = home_1_1;
            },
            function (localization_1_1) {
                localization_1 = localization_1_1;
            }],
        execute: function() {
            app = (function () {
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
                    //this.localization.addTranslation('en', translationEN); // required: add language and translation
                    //this.localization.addTranslation('it', translationIT);  
                    //// add a new language here  
                    //this.localization.definePreferredLanguage('en', 30); // required: define preferred language and expiry (No days) - if omitted, the cookie becomes a session cookie
                    //// end localization
                    this.localization = localization;
                    // ASYNCHRONOUS LOADING
                    // COMMENT FOLLOWING CODE IF DIRECT LOADING
                    // initialize localization: asynchronous loading               
                    this.localization.addTranslation('en'); // required: add a new translations
                    this.localization.addTranslation('it');
                    // add a new language here
                    this.localization.definePreferredLanguage('en', 30); // required: define preferred language and expiry (No days) - if omitted, the cookie becomes a session cookie
                    this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider with the path prefix
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
                    core_1.Component({
                        selector: 'app',
                        templateUrl: './app.html',
                        directives: [home_1.home],
                        providers: [localization_1.Localization, localization_1.LocalizationPipe],
                        pipes: [localization_1.LocalizationPipe] // add in each component to invoke the transform method
                    }), 
                    __metadata('design:paramtypes', [localization_1.Localization])
                ], app);
                return app;
            })();
            browser_1.bootstrap(app, [http_1.HTTP_PROVIDERS]); // http providers
        }
    }
});
