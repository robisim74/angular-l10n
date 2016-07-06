# Angular 2 Localization
[![npm version](https://badge.fury.io/js/angular2localization.svg)](https://badge.fury.io/js/angular2localization)
> An Angular 2 library to translate messages, dates and numbers.

This library is developed using TypeScript and Angular 2 for i18n and l10n of Angular 2 apps written in TypeScript, ES5 or ES6. 
It allows, in addition to translation, to localize numbers and dates of your app, adding language code, country code, and optionally script code, numbering system and calendar, through [Internationalization API](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Intl). It also implements the validation of numbers by locales. 
Because it is only a branch of Angular 2, the goal is the complete integration with the native solutions of Angular 2.

[Sample app](http://robisim74.github.io/angular2localization) built with Angular 2 Material & webpack, and its [source code](https://github.com/robisim74/angular2localization/tree/gh-pages).

Get the changelog by [releases](https://github.com/robisim74/angular2localization/releases).

Compatible with Angular 2.0.0-rc.4 & forms 0.2.0.

## Installing
You can add `angular2localization` to your project using `npm`:
```
npm install --save angular2localization
```

## Loading
#### Using SystemJS configuration
```JavaScript
var map = {
    'app': 'app',
    ...
    'angular2localization': 'node_modules'
};

var packages = {
    'app': { format: 'cjs', main: 'main.js', defaultExtension: 'js' },
    ...
    'angular2localization/angular2localization': { main: '/bundles/angular2localization.umd.min.js', defaultExtension: 'js' }
};
```

#### Via webpack
Import the library in your `vendor` file after Angular 2 imports:
```TypeScript
import 'angular2localization/angular2localization';
```

#### Plain JavaScript
If you build apps in Angular 2 using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular2localization/bundles/angular2localization.umd.min.js"></script>
```
and using global `ng.angular2localization` namespace.

## Usage
See [library specification](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md).

## Related projects
[Angular 2 Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

## Building
In order to build the library if you want to contribute:
```Shell
npm install
typings install
npm run build
```
To test locally the npm package:
```Shell
npm pack ./dist
```
Then you can install it in your app to test it:
```Shell
npm install [path]angular2localization-[version].tgz
```

##License
MIT
