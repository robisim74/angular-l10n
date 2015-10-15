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
var localization_1 = require('../../services/localization'); // localization class
var home = (function () {
    // add a new property here
    function home(localization) {
        this.localization = localization;
        // example of key injection from the component
        this.title = "HELLO"; // set key
        // add a new key here   
    }
    // DIRECT LOADING
    // UNCOMMENT FOLLOWING CODE FOR DIRECT LOADING
    //// translation: direct loading
    //translate(key) {
    //
    //    return this.localization.translate(key);
    //
    //}
    // ASYNCHRONOUS LOADING
    // COMMENT FOLLOWING CODE IF DIRECT LOADING
    // translation: asynchronous loading  
    home.prototype.translate = function (key) {
        return this.localization.asyncTranslate(key);
    };
    home = __decorate([
        // localization class
        angular2_1.Component({
            selector: 'home'
        }),
        angular2_1.View({
            templateUrl: './components/home/home.html'
        }), 
        __metadata('design:paramtypes', [localization_1.Localization])
    ], home);
    return home;
})();
exports.home = home;
