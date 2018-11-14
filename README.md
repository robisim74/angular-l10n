# Angular localization
[![Build Status](https://travis-ci.org/robisim74/angular-l10n.svg?branch=master)](https://travis-ci.org/robisim74/angular-l10n) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n) [![npm](https://img.shields.io/npm/dm/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n) [![npm](https://img.shields.io/npm/l/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n)
> An Angular library to translate messages, dates and numbers

This library is for localization of **Angular v7** apps. 
It allows, in addition to translation, to localize numbers and dates of your app, adding _language code_, _country code_, _currency code_, _timezone_ and optionally _script code_, _numbering system_ and _calendar_, through [Internationalization API](https://robisim74.github.io/angular-l10n/spec/configuration/#intl-api). It also implements the validation of numbers by locales.

[Sample app](http://robisim74.github.io/angular-l10n-sample) built with Angular CLI & Material, and its [source code](https://github.com/robisim74/angular-l10n-sample).

Get the changelog by [releases](https://github.com/robisim74/angular-l10n/releases).

## Angular localization features
- More modules to support tree shaking:
    - `TranslationModule` to translate texts
    - `LocalizationModule` to translate texts, dates & numbers
    - `LocaleValidationModule` for number validation by locales
    - `CollatorModule` for sorting and filtering a list by locales
    - `LocaleInterceptorModule` for setting the locale in _Accept-Language_ header on outgoing requests
- Direct loading of translation data (objects)
- Asynchronous loading of translation data (json):
    - Static
    - WebAPI
    - Fallback
    - Custom
- Caching of the http requests
- Composed languages: `language[-script][-country]`
- Language, Default locale & Currency through _ISO codes_
- Timezone through _IANA_ time zone
- Cookies, Session & Local Storage, or custom storage (e.g. for using with _Ionic Storage_) available for storing the _ISO codes_
- _Intl API_ to localize dates & numbers
- Pure pipes to get the translation
- Directives to get the translation:
    - can dynamically change parameters and expressions values as the pipes
    - can translate also attributes
    - work also with complex UI components, like _Material_ or _Ionic_
- Methods to get the translation in component class
- Html tags in translations
- Parameters in translations
- Composed keys in translations (nested objects)
- AoT compliant
- Lazy loading compliant
- Server Side Rendering compliant
- `strict` TypeScript compiler option compliant
- Localized routing for SEO

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

## Usage
- **Angular v7**
    - [Docs](https://robisim74.github.io/angular-l10n)

- **Angular v6 (Angular l10n v5.2.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v6/docs)

- **Angular v5 (Angular l10n v4.2.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v5/docs)

- **Angular v4 (Angular l10n v3.5.2)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v4)

- **Angular v2 (Angular l10n v2.0.11)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v2)

## Contributing
- [Contributing](https://github.com/robisim74/angular-l10n/blob/master/CONTRIBUTING.md)
- [StackBlitz Template](https://stackblitz.com/edit/angular-l10n)

## License
MIT
