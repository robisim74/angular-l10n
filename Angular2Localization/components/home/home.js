System.register(['angular2/core', '../../services/localization'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, localization_1;
    var home;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (localization_1_1) {
                localization_1 = localization_1_1;
            }],
        execute: function() {
            home = (function () {
                // add a new property here
                function home() {
                    // example of key injection from the component
                    this.title = "HELLO"; // set key
                    // add a new key here   
                }
                home = __decorate([
                    // localization pipe
                    core_1.Component({
                        selector: 'home',
                        templateUrl: './components/home/home.html',
                        pipes: [localization_1.LocalizationPipe] // add in each component to invoke the transform method
                    }), 
                    __metadata('design:paramtypes', [])
                ], home);
                return home;
            })();
            exports_1("home", home);
        }
    }
});
