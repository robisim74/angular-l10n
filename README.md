# Angular localization
[![Build Status](https://travis-ci.org/robisim74/angular-l10n.svg?branch=master)](https://travis-ci.org/robisim74/angular-l10n) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n)
> An Angular library to translate messages, dates and numbers.

This library is for localization of **Angular 2+** apps written in TypeScript, ES6 or ES5. 
It allows, in addition to translation, to localize numbers and dates of your app, adding language code, country code, and optionally script code, numbering system and calendar, through [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). It also implements the validation of numbers by locales.

[Sample app](http://robisim74.github.io/angular-l10n-sample) built with Angular Material, AoT compilation & webpack, and its [source code](https://github.com/robisim74/angular-l10n-sample).

Get the changelog by [releases](https://github.com/robisim74/angular-l10n/releases).

## Angular i18n solutions
| _Feature_ | [Angular](https://angular.io/docs/ts/latest/cookbook/i18n.html) _Native_ | [ng2-translate](https://github.com/ocombe/ng2-translate) _External library_ | [angular-l10n](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md) _External library_ |
| --------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
_Messages_ | attribute, message ID | directive, impure pipe | directive, pure pipe
_File formats_ | XLIFF, XMB/XTB | JSON | JSON
_No bootstrap (when language changes)_ | no | yes | yes
_Getting the translation in component class_ | not yet | yes | yes
_Numbers_ | pure pipe via Intl | - | directive & pure pipe via Intl
_Dates_ | pure pipe via Intl | - | directive & pure pipe via Intl
_Validation_ | - | - | numbers validation 

## Installing
You can add `angular-l10n` to your project using `npm`:
```Shell
npm install angular-l10n --save 
```

## Loading
#### Using SystemJS configuration
```JavaScript
System.config({
    map: {
        'angular-l10n': 'node_modules/angular-l10n/bundles/angular-l10n.umd.js'
    }
});
```
#### Angular-CLI
No need to set up anything, just import it in your code.
#### Rollup or webpack
No need to set up anything, just import it in your code.
#### AoT compilation
This library is compatible with AoT compilation, just import it in your code.
#### Plain JavaScript
If you build apps in Angular using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular-l10n/bundles/angular-l10n.umd.js"></script>
```
and use global `ng.l10n` namespace.

## Usage
See [quick start](https://github.com/robisim74/angular-l10n/blob/master/doc/quick-start.md) and [library specification](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md).

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
npm install [path]angular-l10n-[version].tgz
```

##License
MIT
