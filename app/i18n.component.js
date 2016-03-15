System.register(['angular2/core', './services/localization.service', './pipes/localization.pipe'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, localization_service_1, localization_pipe_1;
    var I18nComponent;
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
            }],
        execute: function() {
            I18nComponent = (function () {
                // Instantiates a new LocalizationService for this component and for its descendants.
                function I18nComponent(localizationI18n) {
                    this.localizationI18n = localizationI18n;
                    this.message = "";
                    this.gender = "female";
                    this.inviteMapping = {
                        'male': 'INVITE_HIM',
                        'female': 'INVITE_HER'
                    };
                    this.messages = [];
                    this.messageMapping = {
                        '=0': 'NO_MESSAGES',
                        '=1': 'ONE_MESSAGE',
                        'other': '# MESSAGES'
                    };
                    this.localizationI18n.translationProvider('./resources/locale-i18n-'); // Required: initializes the translation provider with the given path prefix.
                }
                I18nComponent.prototype.addMessage = function (message) {
                    this.messages.push(message);
                    this.message = "";
                };
                I18nComponent = __decorate([
                    core_1.Component({
                        templateUrl: './app/i18n.component.html',
                        providers: [localization_service_1.LocalizationService, localization_pipe_1.LocalizationPipe],
                        pipes: [localization_pipe_1.LocalizationPipe]
                    }), 
                    __metadata('design:paramtypes', [localization_service_1.LocalizationService])
                ], I18nComponent);
                return I18nComponent;
            })();
            exports_1("I18nComponent", I18nComponent);
        }
    }
});
