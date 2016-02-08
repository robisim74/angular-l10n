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
    var HomeComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (localization_1_1) {
                localization_1 = localization_1_1;
            }],
        execute: function() {
            HomeComponent = (function () {
                // Add a new property here.
                function HomeComponent() {
                    // Example of key injection from the component.
                    this.title = "HELLO"; // Sets the key.
                    // Add a new key here.   
                }
                HomeComponent = __decorate([
                    // Localization pipe.
                    core_1.Component({
                        selector: 'home-component',
                        templateUrl: './components/home/home.component.html',
                        pipes: [localization_1.LocalizationPipe] // Add in each component to invoke the transform method.
                    }), 
                    __metadata('design:paramtypes', [])
                ], HomeComponent);
                return HomeComponent;
            })();
            exports_1("HomeComponent", HomeComponent);
        }
    }
});
