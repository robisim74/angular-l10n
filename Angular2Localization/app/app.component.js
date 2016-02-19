System.register(['angular2/core', '../services/localization.service', './home/home.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, localization_service_1, home_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (localization_service_1_1) {
                localization_service_1 = localization_service_1_1;
            },
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(localization) {
                    // DIRECT LOADING
                    // UNCOMMENT FOLLOWING CODE FOR DIRECT LOADING
                    //// Initializes the LocalizationService class: direct loading.
                    //// Translations data.
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
                    //    SUBTITLE: "caricamento diretto",
                    //    DESCRIPTION: "questa traduzione è stata caricata direttamente"
                    //}
                    //// Add a new translation here. 
                    //     
                    //this.localization.addTranslation('en', translationEN); // Required: adds language and translation.
                    //this.localization.addTranslation('it', translationIT);  
                    //// add a new language here  
                    //this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
                    //// End localization.
                    this.localization = localization;
                    // ASYNCHRONOUS LOADING
                    // COMMENT FOLLOWING CODE IF DIRECT LOADING
                    // Initializes the LocalizationService class: asynchronous loading.               
                    this.localization.addTranslation('en'); // Required: adds a new translation.
                    this.localization.addTranslation('it');
                    // Add a new language here.
                    this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
                    this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the path prefix.
                    // End localization.
                }
                // CHANGE LANGUAGE
                // Returns the current language.
                AppComponent.prototype.currentLanguage = function () {
                    return this.localization.getCurrentLanguage();
                };
                // Sets a new language.
                AppComponent.prototype.selectLanguage = function (locale) {
                    this.localization.setCurrentLanguage(locale);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app-component',
                        templateUrl: './app/app.component.html',
                        directives: [home_component_1.HomeComponent],
                        providers: [localization_service_1.LocalizationService, localization_service_1.LocalizationPipe],
                        pipes: [localization_service_1.LocalizationPipe] // Add in each component to invoke the transform method.
                    }), 
                    __metadata('design:paramtypes', [localization_service_1.LocalizationService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
