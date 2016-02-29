System.register(['angular2/core', './services/localization.service', './pipes/localization.pipe', './home.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, localization_service_1, localization_pipe_1, home_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (localization_service_1_1) {
                localization_service_1 = localization_service_1_1;
            },
            function (localization_pipe_1_1) {
                localization_pipe_1 = localization_pipe_1_1;
            },
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(localization) {
                    this.localization = localization;
                    // Initializes the LocalizationService: asynchronous loading.               
                    this.localization.addTranslation('en'); // Required: adds a new language code.
                    this.localization.addTranslation('it');
                    this.localization.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
                    this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.
                }
                // Gets the current language.
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
                        directives: [home_component_1.HomeComponent],
                        templateUrl: './app/app.component.html',
                        providers: [localization_service_1.LocalizationService, localization_pipe_1.LocalizationPipe],
                        pipes: [localization_pipe_1.LocalizationPipe] // Add in each component to invoke the transform method.
                    }), 
                    __metadata('design:paramtypes', [localization_service_1.LocalizationService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
