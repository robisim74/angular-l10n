# Angular localization
[![Build Status](https://travis-ci.org/robisim74/angular-l10n.svg?branch=master)](https://travis-ci.org/robisim74/angular-l10n) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n) [![npm](https://img.shields.io/npm/dm/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n) [![npm](https://img.shields.io/npm/l/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n)
> An Angular library to translate messages, dates and numbers

This library is for localization of **Angular v5** apps written in TypeScript, ES6 or ES5. 
It allows, in addition to translation, to localize numbers and dates of your app, adding _language code_, _country code_, _currency code_, _timezone_ and optionally _script code_, _numbering system_ and _calendar_, through [Internationalization API](https://robisim74.github.io/angular-l10n/spec/configuration/#intl-api). It also implements the validation of numbers by locales.

[Sample app](http://robisim74.github.io/angular-l10n-sample) built with Angular CLI & Material, and its [source code](https://github.com/robisim74/angular-l10n-sample).

Get the changelog by [releases](https://github.com/robisim74/angular-l10n/releases).

## Angular localization features
- A module to translate texts & a module to translate texts, dates & numbers
- A module for validation by locales (numbers)
- Direct & Asynchronous loading of translation data
- Available providers for Asynchronous loading:
    - Static (json files)
    - WebAPI (json format)
    - Fallback
    - Custom
- Caching of the http requests
- Composed languages (e.g. languageCode-countryCode)
- Language, Default locale & Currency through _ISO codes_
- Timezone through _IANA_ time zone
- Cookies, Session & Local Storage, or custom storage (e.g. for using with _Ionic Storage_) available for storing the _ISO codes_
- _Intl API_ to localize dates & numbers
- Pure pipes & Directives to get the translation
- Decorators or class inheritance for the _ISO codes_ used by the pure pipes
- Html tags in translations
- Parameters in translations
- Composed keys in translations (nested objects)
- Directives can dynamically change parameters and expressions values as the pipes
- Directives can translate also attributes
- Directives work also with complex UI components, like _Material_ or _Ionic_
- Methods to translate in component class
- Custom translation handler for translated values
- Support for lazy loading
- Collator for sorting and filtering a list by locales

## Angular i18n solutions
| _Feature_ | [Angular](https://angular.io/guide/i18n) _Official_ | [ngx-translate](http://www.ngx-translate.com) _External library_ | [angular-l10n](https://robisim74.github.io/angular-l10n) _External library_ |
| --------- |:---------:|:---------:|:---------:|
_Messages_ | Html attributes, message IDs | directives, impure pipes | directives, pure pipes
_File formats_ | XLIFF, XMB/XTB | JSON | JSON
_No bootstrap (when language changes)_ | not yet | yes | yes
_Getting the translation in component class_ | not yet | yes | yes
_Numbers_ | pure pipes using CLDR | - | directives & pure pipes via Intl API
_Dates_ | pure pipes using CLDR | - | directives & pure pipes via Intl API
_Validation_ | - | - | numbers validation via Intl API

## Installing
You can add `angular-l10n` to your project using `npm`:
```Shell
npm install angular-l10n --save 
```
To install a pre-release package:
```Shell
npm install --save angular-l10n@next
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
#### Angular CLI
No need to set up anything, just import it in your code.
#### Rollup or webpack
No need to set up anything, just import it in your code.
#### Plain JavaScript
If you build apps in Angular using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular-l10n/bundles/angular-l10n.umd.js"></script>
```
and use global `ng.l10n` namespace.

## AoT compilation, Server Side Rendering & strict
This library is compatible with AoT compilation & [Server Side Rendering](https://robisim74.github.io/angular-l10n/quick-start/#appendix-d-using-angular-universal). It also supports the `strict` TypeScript compiler option.

## Usage
- **Angular v5**
    - [Docs](https://robisim74.github.io/angular-l10n)

- **Angular v4**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v4)

- **Angular v2**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v2)

## Contributing
- [Contributing](https://github.com/robisim74/angular-l10n/blob/master/CONTRIBUTING.md)
- [StackBlitz Template](https://stackblitz.com/edit/angular-l10n)

## License
MIT
