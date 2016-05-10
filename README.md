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
To load the package you have two methods:
- Loading the bundle:
```Html
<script src="node_modules/angular2localization/bundles/angular2localization.js"></script>
```
- Using SystemJS:
```Html
<script>
    System.config({
        map: {
            ...
            'angular2localization': 'node_modules/angular2localization'
        },
        packages: {
            ...
            'angular2localization': { defaultExtension: 'js' }
        }
    });
</script>
```

## Getting the translation
Now this library uses pure pipes. To know the advantages over impure pipes, please see [here](https://angular.io/docs/ts/latest/guide/pipes.html). 

### Messages
```
expression | translate:lang
```
where `expression` is a string key that indicates the message to translate and `lang` is the language code for the `LocalizationService`.

For example, to get the translation, add in the template:
```Html
{{ 'TITLE' | translate:lang }}
```
and include in the component:
```TypeScript
import {LocalizationService, TranslatePipe} from 'angular2localization/angular2localization';

@Component({
    ...
    pipes: [TranslatePipe]
})

export class AppComponent {

    constructor(public localization: LocalizationService) {
        ...
    }

    // Gets the language code for the LocalizationService.
    get lang(): string {

        return this.localization.languageCode;
     
    }

}
```
With Angular 2 `I18nSelectPipe` that displays the string that matches the current value:
```Html
{{ expression | i18nSelect:mapping | translate:lang }}
```
With Angular 2 `I18nPluralPipe` that pluralizes the value properly:
```Html
{{ expression | i18nPlural:mapping | translate:lang }}
```

### Dates
```
expression | localedate[:defaultLocale[:format]]
```
where `expression` is a date object or a number (milliseconds since UTC epoch), `defaultLocale` is the default locale and `format` indicates which date/time components to include. See Angular 2 `DatePipe` for further information.

For example, to get the local date, add in the template:
```Html
{{ today | localedate:defaultLocale:'fullDate' }}
```
and include in the component:
```TypeScript
import {LocalizationService, LocaleDatePipe} from 'angular2localization/angular2localization';

@Component({
    ...
    pipes: [LocaleDatePipe]
})

export class AppComponent {

    constructor(public locale: LocaleService) {
        ...
    }

    // Gets the default locale.
    get defaultLocale(): string {

        return this.locale.getDefaultLocale();

    }

}
```

### Numbers
#### Decimals
```
expression | localedecimal[:defaultLocale:[digitInfo]]
```
where `expression` is a number, `defaultLocale` is the default locale and `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. See Angular 2 `DecimalPipe` for further information.

For example, to get the local decimal, add in the template:
```Html
{{ pi | localedecimal:defaultLocale:'1.5-5' }}
```
and include `LocaleDecimalPipe` and `get defaultLocale()` in the component.
#### Percentages
```
expression | localepercent[:defaultLocale:[digitInfo]]
```

For example, to get the local percentage, add in the template:
```Html
{{ a | localepercent:defaultLocale:'1.1-1' }}
```
and include `LocalePercentPipe` and `get defaultLocale()` in the component.
#### Currencies
```
expression | localecurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
```
where `currency` is the current currency and `symbolDisplay` is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 

For example, to get the local currency, add in the template:
```Html
{{ b | localecurrency:defaultLocale:currency:true:'1.2-2' }}
```
and include `LocaleCurrencyPipe`, `get defaultLocale()` and `get currency()` in the component:
```TypeScript
// Gets the current currency.
get currency(): string {

    return this.locale.getCurrentCurrency();
   
}
```

### List
Now you can localize a list simply. For example:
```Html
<md-card *ngFor="let item of DATA">
    <md-card-title>{{ item.name }}</md-card-title>
    <md-card-content>
        <md-list>
            <md-list-item>
                <h3 md-line>{{ item.position | translate:lang }}</h3>
                <p md-line>{{ item.salary | localecurrency:defaultLocale:currency:true:'1.0-0' }}</p>
                <p md-line>{{ item.startDate | localedate:defaultLocale:'mediumDate' }}</p>
            </md-list-item>
        </md-list>
    </md-card-content>
</md-card>
```

### Advanced use
If you want, you can avoid including `get lang()`, `get defaultLocale()` or `get currency()` by extending the `Locale` superclass in components:
```TypeScript
import {Locale, LocaleService, LocalizationService} from 'angular2localization/angular2localization';
...
export class AppComponent extends Locale {

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        super(locale, localization);
        ...
    }

} 
```

## First scenario
> You need to localize dates and numbers, but no messages.

Add in the route component in order to access the data of location from anywhere in the application:
```TypeScript
import {LocaleService} from 'angular2localization/angular2localization';

@Component({
    selector: 'app-component',
    ...
    providers: [LocaleService], // Inherited by all descendants.
})

export class AppComponent {

    constructor(public locale: LocaleService,) {

        // Required: default language (ISO 639 two-letter code) and country (ISO 3166 two-letter, uppercase code).
        this.locale.definePreferredLocale('en', 'US');

        // Optional: default currency (ISO 4217 three-letter code).
        this.locale.definePreferredCurrency('USD');

    }

}
```

## Second scenario
> You only need to translate messages.

Add in the route component in order to access the data of location from anywhere in the application:
```TypeScript
import {LocaleService, LocalizationService} from 'angular2localization/angular2localization';

@Component({
    selector: 'app-component',
    ...
    providers: [LocaleService, LocalizationService], // Inherited by all descendants.
})

export class AppComponent {

    constructor(public locale: LocaleService, public localization: LocalizationService) {

        // Adds a new language (ISO 639 two-letter code).
        this.locale.addLanguage('en');
        // Add a new language here.

        // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        this.locale.definePreferredLanguage('en', 30);

    }

}
```
Also add in the main:
```TypeScript
bootstrap(AppComponent, [HTTP_PROVIDERS]);
```

### Direct loading
To initialize `LocalizationService` for the direct loading, add the following code in the body of constructor of the route component:
```TypeScript
var translationEN = {
     TITLE: 'Angular 2 Localization',
     CHANGE_LANGUAGE: 'Change language',
     ...
}
// Add a new translation here.
 
// Required: adds a new translation with the given language code.
this.localization.addTranslation('en', translationEN);
// Add a new translation with the given language code here.
this.localization.updateTranslation(); // Need to update the translation.
```

### Asynchronous loading
Alternatively, to initialize `LocalizationService` for the asynchronous loading add the following code in the body of constructor of the route component:
```TypeScript
// Required: initializes the translation provider with the given path prefix.
this.localization.translationProvider('./resources/locale-');
this.localization.updateTranslation(); // Need to update the translation.
```
and create the `json` files of the translations such as `locale-en.json`:
```
{
    "TITLE": "Angular 2 Localization",
    "CHANGE_LANGUAGE": "Change language",
    ...
}
```
N.B. Resource files must be saved in `UTF-8` format.

### Special characters
You can use quotes inside a string, as long as they don't match the quotes surrounding the string:
```
"It wasn't a dream."
```
Because strings must be written within quotes, use the `\` escape character to insert special characters into the values of the translations:
```
"\"What's happened to me?\" he thought."
```

### Changing language
To change language at runtime, call the following method:
```TypeScript
this.locale.setCurrentLanguage(language);
this.localization.updateTranslation(); // Need to update the translation.
```
where `language` is the two-letter code of the new language (ISO 639).

## Third scenario
> You need to translate messages, dates and numbers.

Unlike what said for messages, use the following code in the body of constructor of the route component:
```TypeScript
// Adds a new language (ISO 639 two-letter code).
this.locale.addLanguage('en');
// Add a new language here.

// Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
this.locale.definePreferredLocale('en', 'US', 30);

// Optional: default currency (ISO 4217 three-letter code).
this.locale.definePreferredCurrency('USD');
```

### Changing locale and currency
To change locale at runtime, call the following method:
```TypeScript
this.locale.setCurrentLocale(language, country);
this.localization.updateTranslation(); // Need to update the translation.
```
where `language` is the two-letter code of the new language (ISO 639) and `country` is the two-letter, uppercase code of the new country (ISO 3166).

To change currency at runtime, call the following method:
```TypeScript
this.locale.setCurrentCurrency(currency);
```
where `currency` is the three-letter code of the new currency (ISO 4217).

## Internationalization API
To localize dates and numbers, this library uses `Intl` API, through Angular 2. 
All modern browsers, except Safari, have implemented this API. You can use [Intl.js](https://github.com/andyearnshaw/Intl.js) to extend support to all browsers. 
Just add one script tag in your `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US"></script>
```
When specifying the `features`, you have to specify what locale, or locales to load.

## Boilerplates
[Angular 2 Localization with an ASP.NET CORE MVC Service](https://damienbod.com/2016/04/29/angular-2-localization-with-an-asp-net-core-mvc-service/) @damienbod

##License
MIT