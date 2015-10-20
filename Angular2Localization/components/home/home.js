var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
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
