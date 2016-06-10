# Angular 2 Localization
[![npm version](https://badge.fury.io/js/angular2localization.svg)](https://badge.fury.io/js/angular2localization)
> An Angular 2 library to translate messages, dates and numbers.

This library is developed using [TypeScript](https://www.typescriptlang.org/) and [Angular 2](https://angular.io/) for i18n and l10n of Angular 2 applications. 
It allows, in addition to translation, to localize the numbers and dates of your app, adding language code, country code, and optionally script code, numbering system and calendar, through [Internationalization API](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Intl). It also implements the validation of numbers by locales. 
Because it is only a branch of Angular2, the goal is the complete integration with the native solutions of Angular 2.

[Sample app](http://robisim74.github.io/angular2localization) built with Angular 2 Material & webpack, and its [source code](https://github.com/robisim74/angular2localization/tree/gh-pages).

Get the changelog by [releases](https://github.com/robisim74/angular2localization/releases).

## Installing
You can add `angular2localization` to your project via [Node and npm](https://nodejs.org):
```
npm install --save angular2localization
```

### Loading via SystemJS
To load the package you have two methods using [SystemJS](https://github.com/systemjs/systemjs):
- Loading the bundle:
```JavaScript
<script src="node_modules/angular2localization/bundles/angular2localization.js"></script>
```
- Using SystemJS configuration:
```JavaScript
var map = {
    'app': 'app',
    ...
    'angular2localization': 'node_modules/angular2localization'
};

var packages = {
    'app': { format: 'cjs', main: 'main.js', defaultExtension: 'js' },
    ...
    'angular2localization': { format: 'cjs', defaultExtension: 'js' }
};
```

### Loading via webpack
If you consume the library via [webpack](https://webpack.github.io/), simply import the library in your `vendor` file after Angular 2 imports:
```TypeScript
import 'angular2localization/angular2localization';
```

## Usage
See [library specification](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md).

## Related projects
[Angular 2 Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

## Building
In order to build the library, clone or download the latest version of this repository:
```
npm install
typings install
npm run build
```
To test locally the npm package:
```
npm pack
```
Then you can install it in your app to test it:
```
npm install [path]angular2localization-[version].tgz
```

##License
MIT
