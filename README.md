# Angular 2 Localization
[![Build Status](https://travis-ci.org/robisim74/angular2localization.svg?branch=master)](https://travis-ci.org/robisim74/angular2localization) [![npm version](https://badge.fury.io/js/angular2localization.svg)](https://badge.fury.io/js/angular2localization)
> An Angular 2 library to translate messages, dates and numbers.

This library is developed using TypeScript and Angular 2 for i18n and l10n of Angular 2 apps written in TypeScript, ES5 or ES6. 
It allows, in addition to translation, to localize numbers and dates of your app, adding language code, country code, and optionally script code, numbering system and calendar, through [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). It also implements the validation of numbers by locales. 

[Sample app](http://robisim74.github.io/angular2localization) built with Angular 2 Material, AoT compilation & webpack, and its [source code](https://github.com/robisim74/angular2localization/tree/gh-pages).

Get the changelog by [releases](https://github.com/robisim74/angular2localization/releases).

**Angular version: ^2.4.0**

## Angular 2 i18n solutions
| _Feature_ | [Angular 2](https://angular.io/docs/ts/latest/cookbook/i18n.html) _Native_ | [ng2-translate](https://github.com/ocombe/ng2-translate) _External library_ | [angular2localization](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md) _External library_ |
| --------- | -------------------------------- | ------------------------------------ | ------------------------------------------- |
_Messages_ | Html attribute, Message ID | Html attribute, impure pipe | Html attribute, pure pipe
_File formats_ | XLIFF, XMB/XTB | JSON | JSON
_No bootstrap (when language changes)_ | no | yes | yes
_Getting the translation in component class_ | not yet | yes | yes
_Numbers_ | pure pipe via Intl | - | Html attribute & pure pipe via Intl
_Dates_ | pure pipe via Intl | - | Html attribute & pure pipe via Intl
_Validation_ | - | - | numbers validation 

## Installing
You can add `angular2localization` to your project using `npm`:
```Shell
npm install --save angular2localization
```

## Loading
#### Using SystemJS configuration
```JavaScript
System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            app: 'app',
            // angular bundles
            ...
            // other libraries
            'rxjs': 'npm:rxjs',
            'angular2localization': 'npm:angular2localization/bundles/angular2localization.umd.min.js'
        },
        packages: {
            app: {
                format: 'cjs',
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            }
        }
    });
```

#### Angular-CLI
No need to set up anything, just import it in your code.

#### Tree shaking via rollup or webpack
No need to set up anything, just import it in your code.

#### Ionic 2
[Using Ionic 2](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md#Appendix%20A) with this library.

#### Angular 2 Meteor
[Using Angular 2 Meteor](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md#Appendix%20B) with this library.

#### Plain JavaScript
If you build apps in Angular 2 using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular2localization/bundles/angular2localization.umd.min.js"></script>
```
and using global `ng.angular2localization` namespace. For a basic usage, see this [ES5 example](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md#Appendix%20C).

## AoT compilation
This library is compatible with AoT compilation, just import it in your code.

## Usage
See [quick start](https://github.com/robisim74/angular2localization/blob/master/doc/quick-start.md) and [library specification](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md).

## Related projects
[Angular 2 Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

## Building
In order to build the library if you want to contribute to it:
```Shell
npm install

npm test

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
