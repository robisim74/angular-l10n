System.register(['angular2/core', './pipes/localization.pipe'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, localization_pipe_1;
    var HomeComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (localization_pipe_1_1) {
                localization_pipe_1 = localization_pipe_1_1;
            }],
        execute: function() {
            HomeComponent = (function () {
                function HomeComponent() {
                }
                HomeComponent = __decorate([
                    core_1.Component({
                        template: "\n            <!--home component view-->\n\n            <div class=\"container\">\n\n                <div class=\"row\">\n\n                    <div class=\"col-sm-6\">\n\n                        <blockquote class=\"blockquote-reverse\">\n\n                            <p>{{ 'DUMMY_TEXT' | translate }}</p>\n                            <footer>{{ 'AUTHOR' | translate }},&nbsp;<cite title=\"Source Title\">{{ 'SOURCE_TITLE' | translate }}</cite></footer>\n\n                        </blockquote>\n\n                    </div>\n\n                </div>\n\n            </div>\n            ",
                        pipes: [localization_pipe_1.LocalizationPipe]
                    }), 
                    __metadata('design:paramtypes', [])
                ], HomeComponent);
                return HomeComponent;
            })();
            exports_1("HomeComponent", HomeComponent);
        }
    }
});
