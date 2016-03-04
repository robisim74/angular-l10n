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
    var AdvancedUseComponent;
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
            AdvancedUseComponent = (function () {
                // Instantiates a new LocalizationService for this component and for its descendants.
                function AdvancedUseComponent(localizationAdvancedUse) {
                    this.localizationAdvancedUse = localizationAdvancedUse;
                    this.localizationAdvancedUse.translationProvider('./resources/locale-advanced-use-'); // Required: initializes the translation provider with the given path prefix.
                }
                AdvancedUseComponent = __decorate([
                    core_1.Component({
                        template: "\n            <!--advanced use component view-->\n\n            <div class=\"container\">\n\n                <div class=\"row\">\n\n                    <div class=\"col-sm-6\">\n\n                        <samp>{{ 'DESCRIPTION' | translate }}</samp>\n\n                    </div>\n\n                </div>\n\n            </div>\n            ",
                        providers: [localization_service_1.LocalizationService, localization_pipe_1.LocalizationPipe],
                        pipes: [localization_pipe_1.LocalizationPipe]
                    }), 
                    __metadata('design:paramtypes', [localization_service_1.LocalizationService])
                ], AdvancedUseComponent);
                return AdvancedUseComponent;
            })();
            exports_1("AdvancedUseComponent", AdvancedUseComponent);
        }
    }
});
