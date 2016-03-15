System.register(['angular2/core', 'angular2/common', 'angular2/router', './services/locale.service', './services/localization.service', './pipes/localization.pipe', './home.component', './i18n.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, locale_service_1, localization_service_1, localization_pipe_1, home_component_1, i18n_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (locale_service_1_1) {
                locale_service_1 = locale_service_1_1;
            },
            function (localization_service_1_1) {
                localization_service_1 = localization_service_1_1;
            },
            function (localization_pipe_1_1) {
                localization_pipe_1 = localization_pipe_1_1;
            },
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            },
            function (i18n_component_1_1) {
                i18n_component_1 = i18n_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(locale, localization, location) {
                    this.locale = locale;
                    this.localization = localization;
                    this.location = location;
                    // Initializes the LocaleService & LocalizationService: asynchronous loading.           
                    this.locale.addLanguage('en'); // Required: adds a new language.
                    this.locale.addLanguage('it');
                    this.locale.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
                    this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.
                }
                Object.defineProperty(AppComponent.prototype, "currentLanguage", {
                    // Gets the current language.
                    get: function () {
                        return this.locale.getCurrentLanguage();
                    },
                    enumerable: true,
                    configurable: true
                });
                // Sets a new language.
                AppComponent.prototype.selectLanguage = function (language) {
                    this.locale.setCurrentLanguage(language);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app-component',
                        directives: [router_1.ROUTER_DIRECTIVES, common_1.NgClass],
                        templateUrl: './app/app.component.html',
                        providers: [locale_service_1.LocaleService, localization_service_1.LocalizationService, localization_pipe_1.LocalizationPipe],
                        pipes: [localization_pipe_1.LocalizationPipe] // Add in each component to invoke the transform method.
                    }),
                    router_1.RouteConfig([
                        new router_1.AsyncRoute({ path: '/', loader: function () { return Promise.resolve(home_component_1.HomeComponent); }, name: 'Home', useAsDefault: true }),
                        new router_1.AsyncRoute({ path: '/i18n', loader: function () { return Promise.resolve(i18n_component_1.I18nComponent); }, name: 'I18n' })
                    ]), 
                    __metadata('design:paramtypes', [locale_service_1.LocaleService, localization_service_1.LocalizationService, router_1.Location])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
