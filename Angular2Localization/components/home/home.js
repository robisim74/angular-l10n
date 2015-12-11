var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var localization_1 = require('../../services/localization'); // localization pipe
var home = (function () {
    // add a new property here
    function home() {
        // example of key injection from the component
        this.title = "HELLO"; // set key
        // add a new key here   
    }
    home = __decorate([
        // localization pipe
        angular2_1.Component({
            selector: 'home',
            templateUrl: './components/home/home.html',
            pipes: [localization_1.LocalizationPipe] // add in each component to invoke the transform method
        }), 
        __metadata('design:paramtypes', [])
    ], home);
    return home;
})();
exports.home = home;
