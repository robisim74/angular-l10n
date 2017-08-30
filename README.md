# Angular localization
[![Build Status](https://travis-ci.org/robisim74/angular-l10n.svg?branch=master)](https://travis-ci.org/robisim74/angular-l10n) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n)
> An Angular library to translate messages, dates and numbers.

This library is for localization of **Angular 2+** apps written in TypeScript, ES6 or ES5. 
It allows, in addition to translation, to localize numbers and dates of your app, adding _language code_, _country code_, _currency code_, _timezone_ and optionally _script code_, _numbering system_ and _calendar_, through [Internationalization API](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md#2.9). It also implements the validation of numbers by locales.

[Sample app](http://robisim74.github.io/angular-l10n-sample) built with Angular Material, AoT compilation & webpack, and its [source code](https://github.com/robisim74/angular-l10n-sample).

Get the changelog by [releases](https://github.com/robisim74/angular-l10n/releases).

## Angular i18n solutions
| _Feature_ | [Angular](https://angular.io/guide/i18n) _Official_ | [ngx-translate](https://github.com/ngx-translate/core) _External library_ | [angular-l10n](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md) _External library_ |
| --------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
_Messages_ | Html attributes, message IDs | directives, impure pipes | directives, pure pipes
_File formats_ | XLIFF, XMB/XTB | JSON | JSON
_No bootstrap (when language changes)_ | no | yes | yes
_Getting the translation in component class_ | not yet | yes | yes
_Numbers_ | pure pipes using CLDR | - | directives & pure pipes via Intl API
_Dates_ | pure pipes using CLDR | - | directives & pure pipes via Intl API
_Validation_ | - | - | numbers validation via Intl API

## Installing
You can add `angular-l10n` to your project using `npm`:
```Shell
npm install angular-l10n --save 
```
To install the pre-release package:
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
This library is compatible with AoT compilation & Server Side Rendering. It also supports the `strict` TypeScript compiler option.

## Usage
**_Configuration_**
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        languages: [
            { code: 'en', dir: 'ltr' },
            { code: 'it', dir: 'ltr' }
        ],
        defaultLocale: { languageCode: 'en', countryCode: 'US' },
        currency: 'USD',
        storage: StorageStrategy.Cookie
    },
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ],
        caching: true,
        missingValue: 'No key'
    }
};

@NgModule({
    imports: [
        ...
        HttpClientModule,
        LocalizationModule.forRoot(l10nConfig)
    ],
    ...
})
export class AppModule {

    constructor(public l10nLoader: L10nLoader) {
        this.l10nLoader.load();
    }

}
```
**_Pure pipes with Decorators_**
```TypeScript
@Component({
    ...
    template: `
        <p>{{ 'Greeting' | translate:lang }}</p>

        <p title="{{ 'Greeting' | translate:lang }}">{{ 'Title' | translate:lang }}</p>

        <p>{{ today | l10nDate:defaultLocale:'fullDate' }}</p>  
        <p>{{ pi | l10nDecimal:defaultLocale:'1.5-5' }}</p>
        <p>{{ value | l10nCurrency:defaultLocale:currency:'symbol':'1.2-2' }}</p>
    `
})
export class HomeComponent implements OnInit {

    @Language() lang: string;
    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;
    
    ngOnInit(): void { }

}
```
**_Directives_**
```TypeScript
@Component({
    ...
    template: `
        <p l10nTranslate>Greeting</p>

        <p l10n-title title="Greeting" l10nTranslate>Title</p>

        <p l10nDate="fullDate">{{ today }}</p>    
        <p l10nDecimal="1.5-5">{{ pi }}</p>
        <p l10nCurrency="1.2-2" [currencyDisplay]="'symbol'">{{ value }}</p>
    `
})
export class HomeComponent {}
```
**_In component class_**
```TypeScript
@Component({
    ...
    template: `
        <h1>{{ title }}</h1>
    `
})
export class AppComponent implements OnInit {

    title: string;

    constructor(public translation: TranslationService) { }

    ngOnInit(): void {
        this.translation.translationChanged().subscribe(
            () => { this.title = this.translation.translate('Title'); }
        );
    }

}
```
See the following documentation to learn more about all the features:

- **Angular v5**
    - [Quick start](https://github.com/robisim74/angular-l10n/blob/master/doc/quick-start.md)
    - [Library specification](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md)
    - [Snippets](https://github.com/robisim74/angular-l10n/wiki/Snippets)

- **Angular v4**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v4)

- **Angular v2**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v2)

## Related projects
[Angular Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

## Contributing
- [Contributing](https://github.com/robisim74/angular-l10n/blob/master/CONTRIBUTING.md)
- [Plunker template](http://embed.plnkr.co/UdKFunQFnD3TOkXp2v06/)

## License
MIT
