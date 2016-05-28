# Angular 2 Localization
[![npm version](https://badge.fury.io/js/angular2localization.svg)](https://badge.fury.io/js/angular2localization)
> An Angular 2 library to translate messages, dates and numbers.

Sample app built with Angular 2 Material: [demo](http://robisim74.github.io/angular2localization)

Get the changelog: [releases](https://github.com/robisim74/angular2localization/releases)

## Installation
You can add `angular2localization` to your project via [Node and npm](https://nodejs.org):
```
npm install --save angular2localization
```

### Loading via SystemJS
To load the package you have two methods using `SystemJS`:
- Loading the bundle:
```JavaScript
<script src="node_modules/angular2localization/bundles/angular2localization.js"></script>
```
- Using `SystemJS` configuration:
```JavaScript
<script>
    System.config({
        map: {
            ...
            'angular2localization': 'node_modules/angular2localization'
        },
        packages: {
            ...
            'angular2localization': { format: 'cjs', defaultExtension: 'js' }
        }
    });
</script>
```
If you compile your app in `CommonJS`, remember to add your own app to the packages specifying the format:
```JavaScript
'app': { format: 'cjs', main: 'main.js', defaultExtension: 'js' }
```

### Loading via webpack
If you consume the library via `webpack`, simply import the library in your `vendor` file after Angular 2 imports:
```TypeScript
import 'angular2localization/angular2localization';
```

## Getting the translation
This library uses pure pipes. To know the advantages over impure pipes, please see [here](https://angular.io/docs/ts/latest/guide/pipes.html). 

Type | Format | Syntax
---- | ------ | ------
Message | String | `expression | translate:lang`
Date | Date/Number | `expression | localedate[:defaultLocale[:format]]`
Number | Decimal | `expression | localedecimal[:defaultLocale:[digitInfo]]`
Number | Percentage | `expression | localepercent[:defaultLocale:[digitInfo]]`
Number | Currency | `expression | localecurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]`

To know the full use, see the [Wiki](https://github.com/robisim74/angular2localization/wiki/Getting-the-translation) page.

## Scenarios
Scenario | Scope of | Wiki page
-------- | -------- | ---------
First | You need to localize dates and numbers, but no messages | [Wiki](https://github.com/robisim74/angular2localization/wiki/First-scenario)
Second | You only need to translate messages | [Wiki](https://github.com/robisim74/angular2localization/wiki/Second-scenario)
Third | You need to translate messages, dates and numbers | [Wiki](https://github.com/robisim74/angular2localization/wiki/Third-scenario)

## Validation by locales
Type | Directive | Validator | Options | Errors | Wiki page
---- | --------- | --------- | ------- | ------ | ---------
Number | `LocaleNumberValidator` | `validateLocaleNumber=[digitInfo]` | `[minValue]` `[maxValue]` | `format` or `minValue` or `maxValue` | [Wiki](https://github.com/robisim74/angular2localization/wiki/Number-validation)

## Internationalization API
To localize dates and numbers, this library uses `Intl` API, through Angular 2. 
All modern browsers, except Safari, have implemented this API. You can use [Intl.js](https://github.com/andyearnshaw/Intl.js) to extend support to all browsers. 
Just add one script tag in your `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US"></script>
```
When specifying the `features`, you have to specify what locale, or locales to load.

*N.B. When a feature is not supported, however, for example in older browsers, `angular2localization` does not generate an error in the browser, but returns the value without performing operations.*

## Boilerplates
[Angular 2 Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

## Contributing

##License
MIT
