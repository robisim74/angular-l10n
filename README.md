# Angular localization
[![Build Status](https://travis-ci.org/robisim74/angular-l10n.svg?branch=master)](https://travis-ci.org/robisim74/angular-l10n) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n)
> An Angular library to translate messages, dates and numbers.

This library is for localization of **Angular 2+** apps written in TypeScript, ES6 or ES5. 
It allows, in addition to translation, to localize numbers and dates of your app, adding language code, country code, and optionally script code, numbering system and calendar, through [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). It also implements the validation of numbers by locales.

[Sample app](http://robisim74.github.io/angular-l10n-sample) built with Angular Material, AoT compilation & webpack, and its [source code](https://github.com/robisim74/angular-l10n-sample).

Get the changelog by [releases](https://github.com/robisim74/angular-l10n/releases).

## Angular i18n solutions
| _Feature_ | [Angular](https://angular.io/guide/i18n) _Native_ | [ngx-translate](https://github.com/ngx-translate/core) _External library_ | [angular-l10n](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md) _External library_ |
| --------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
_Messages_ | Html attribute, message ID | directive, impure pipe | directive, pure pipe
_File formats_ | XLIFF, XMB/XTB | JSON | JSON
_No bootstrap (when language changes)_ | no | yes | yes
_Getting the translation in component class_ | not yet | yes | yes
_Numbers_ | pure pipe via Intl | - | directive & pure pipe via Intl
_Dates_ | pure pipe via Intl | - | directive & pure pipe via Intl
_Validation_ | - | - | number validation

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
#### Plain JavaScript
If you build apps in Angular using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular-l10n/bundles/angular-l10n.umd.js"></script>
```
and use global `ng.l10n` namespace.

## AoT compilation, Server-side prerendering & strict
This library is compatible with AoT compilation & Server-side prerendering. It also supports the `strict` TypeScript compiler option.

## Usage
**_Configuration_**
```TypeScript
@NgModule({
    imports: [
        ...
        HttpModule,
        LocalizationModule.forRoot()
    ],
    ...
})
export class AppModule {

    constructor(public locale: LocaleService, public translation: TranslationService) {
        this.locale.addConfiguration()
            .addLanguages(['en', 'it'])
            .setCookieExpiration(30)
            .defineDefaultLocale('en', 'US')
            .defineCurrency('USD');

        this.translation.addConfiguration()
            .addProvider('./assets/locale-');

        this.translation.init();
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

        <p>{{ today | localeDate:defaultLocale:'fullDate' }}</p>       
        <p>{{ pi | localeDecimal:defaultLocale:'1.5-5' }}</p>
        <p>{{ value | localeCurrency:defaultLocale:currency:true:'1.2-2' }}</p>
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
        <p l10nCurrency="1.2-2" [symbol]="true">{{ value }}</p>
    `
})
export class HomeComponent {}
```
See the following documentation to learn more about all the features:

- **Angular v4**
    - [Quick start](https://github.com/robisim74/angular-l10n/blob/master/doc/quick-start.md)
    - [Library specification](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md)
    - [Snippets](https://github.com/robisim74/angular-l10n/wiki/Snippets)

- **Angular v2**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v2)

## Related projects
[Angular Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

## Contributing
- [Contributing](https://github.com/robisim74/angular-l10n/blob/master/CONTRIBUTING.md)
- [Plunker template](http://embed.plnkr.co/UdKFunQFnD3TOkXp2v06/)

## License
MIT
