# Angular localization library specification
Library version: 3.3.0

## Table of contents
* [1 Library structure](#1)
* [2 Configuration](#2)
    * [2.1 First scenario: you only need to translate messages](#2.1)
    * [2.2 Second scenario: you need to translate messages, dates & numbers](#2.2)
    * [2.3 Loading the translation data](#2.3)
    * [2.4 Using a custom provider](#2.4)
    * [2.5 Default locale](#2.5)
    * [2.6 Intl API](#2.6)
* [3 Getting the translation](#3)
    * [3.1 Pure pipes](#3.1)
        * [3.1.1 Messages](#3.1.1)
        * [3.1.2 Dates & Numbers](#3.1.2)
        * [3.1.3 Translation & Localization classes](#3.1.3)
        * [3.1.4 OnPush ChangeDetectionStrategy](#3.1.4)
    * [3.2 Directives](#3.2)
    * [3.3 Using Html tags in translation](#3.3)
    * [3.4 Getting the translation in component class](#3.4)
* [4 Changing language, default locale or currency at runtime](#4)
* [5 Lazy loading](#5)
* [6 Validation by locales](#6)
    * [6.1 Validating a number](#6.1)
        * [6.1.1 Parsing a number](#6.1.1)
        * [6.1.2 FormBuilder](#6.1.2)
* [7 Collator](#7)
* [8 Services APIs](#8)
    * [8.1 TranslationModule](#8.1)
    * [8.2 LocalizationModule](#8.2)
    * [8.3 LocaleValidationModule](#8.3)
    * [8.4 ILocaleService](#8.4)
    * [8.5 ITranslationService](#8.5)
    * [8.6 TranslationProvider](#8.6)
    * [8.7 Translation](#8.7)
    * [8.8 Localization](#8.8)
    * [8.9 ILocaleValidation](#8.9)
    * [8.10 ICollator](#8.10)
    * [8.11 IntlAPI](#8.11)

## <a name="1"/>1 Library structure
Main modules of the library:

Class | Contract
----- | --------
`TranslationModule` | Provides dependencies, pipes & directives for translating messages
`LocalizationModule` | Provides dependencies, pipes & directives for translating messages, dates & numbers
`LocaleValidationModule` | Provides dependencies & directives for locale validation

Main services of the library:

Class | Contract
----- | --------
`LocaleService` | Manages language, default locale & currency
`TranslationService` | Manages the translation data
`TranslationProvider` | Class-interface to create a custom provider for translation data
`Translation` | Provides _lang_ to the _translate_ pipe
`Localization` | Provides _lang_ to the _translate_ pipe, _defaultLocale_ & _currency_ to _localeDecimal_, _localePercent_ & _localeCurrency_ pipes
`LocaleValidation` | Provides the methods to convert strings according to default locale
`Collator` | Intl.Collator APIs
`IntlAPI` | Provides the methods to check if Intl APIs are supported

## <a name="2"/>2 Configuration
### <a name="2.1"/>2.1 First scenario: you only need to translate messages
Import the modules you need and configure the services in the application root module:
```TypeScript
@NgModule({
    imports: [
        ...
        HttpModule,
        TranslationModule.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(public locale: LocaleService, public translation: TranslationService) {
        this.locale.addConfiguration()
            .addLanguages(['en', 'it'])
            .setCookieExpiration(30)
            .defineLanguage('en');
        this.locale.init();

        this.translation.addConfiguration()
            .addProvider('./assets/locale-');
        this.translation.init();
    }

}
```
### <a name="2.2"/>2.2 Second scenario: you need to translate messages, dates & numbers
Import the modules you need and configure the services in the application root module:
```TypeScript
@NgModule({
    imports: [
        ...
        HttpModule,
        LocalizationModule.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(public locale: LocaleService, public translation: TranslationService) {
        this.locale.addConfiguration()
            .addLanguages(['en', 'it'])
            .setCookieExpiration(30)
            .defineDefaultLocale('en', 'US')
            .defineCurrency('USD');
        this.locale.init();

        this.translation.addConfiguration()
            .addProvider('./assets/locale-');
        this.translation.init();
    }

}
```

#### ILocaleConfigAPI 
Method | Function
------ | --------
`addLanguage(languageCode: string, textDirection?: string)` | Adds a language to use in the app, specifying the layout direction
`addLanguages(languageCodes: string[])` | Adds the languages to use in the app
`disableStorage()` | Disables the browser storage for language, default locale & currency
`setCookieExpiration(days?: number)` | If the cookie expiration is omitted, the cookie becomes a session cookie
`useLocalStorage()` | Sets browser LocalStorage as default for language, default locale & currency
`useSessionStorage()` | Sets browser SessionStorage as default for language, default locale & currency
`defineLanguage(languageCode: string)` | Defines the language to be used
`defineDefaultLocale(languageCode: string, countryCode: string, scriptCode?: string, numberingSystem?: string, calendar?: string)` | Defines the default locale to be used, regardless of the browser language
`defineCurrency(currencyCode: string)` | Defines the currency to be used

#### ITranslationConfigAPI
Method | Function
------ | --------
`addTranslation(languageCode: string, translation: any)` | Direct loading: adds translation data
`addProvider(prefix: string, dataFormat?: string)` |  Asynchronous loading: adds a translation provider
`addWebAPIProvider(path: string, dataFormat?: string)` |  Asynchronous loading: adds a Web API provider
`addCustomProvider(args: any)` |  Asynchronous loading: adds a custom provider
`useLocaleAsLanguage()` | Sets the use of locale (`languageCode-countryCode`) as language
`setMissingValue(value: string)` | Sets the value to use for missing keys
`setMissingKey(key: string)` | Sets the key to use for missing keys
`setComposedKeySeparator(keySeparator: string)` | Sets composed key separator. Default is the point '.'
`disableI18nPlural()` | Disables the translation of numbers that are contained at the beginning of the keys

### <a name="2.3"/>2.3 Loading the translation data
#### Direct loading
You can use `addTranslation` when you configure the service, 
adding all the translation data:
```TypeScript
const translationEN: any = {
    Title: "Angular localization"
}
const translationIT: any = {
    Title: "Localizzazione in Angular"
}

this.translation.addConfiguration()
    .addTranslation('en', translationEN)
    .addTranslation('it', translationIT);
```

#### Asynchronous loading of json files
You can add all the providers you need:
```TypeScript
this.translation.addConfiguration()
    .addProvider('./assets/locale-')
    .addProvider('./assets/global-');
```
*You can't use Direct and Asynchronous loading at the same time.*

#### Asynchronous loading through a Web API
You can also load the data through a Web API:
```TypeScript
this.translation.addConfiguration()
    .addWebAPIProvider('http://localhost:54703/api/values/');

this.translation.translationError.subscribe((error: any) => console.log(error));

this.translation.init();
```
`[path]{languageCode}` will be the URL used by the Http GET requests. So the example URI will be something like: `http://localhost:54703/api/values/en`.

The example above also showed as you can perform a custom action if you get a bad response.

### <a name="2.4"/>2.4 Using a custom provider
If you need, you can create a custom provider to load translation data.

Use the `addCustomProvider(args: any)` method during the configuration of the service:
```TypeScript
this.translation.addConfiguration()
    .addCustomProvider({ ... });
this.translation.init();
```
Implement `TranslationProvider` class-interface and the `getTranslation` method with the logic to retrieve the data:
```TypeScript
@Injectable() export class CustomTranslationProvider implements TranslationProvider {

    /**
     * This method must contain the logic of data access.
     * @param language The current language
     * @param args The parameter of addCustomProvider method
     * @return An observable of an object of translation data: {key: value}
     */
    public getTranslation(language: string, args: any): Observable<any> {
        // Custom data access.
        return ...
    }

}
```
Note that the method must return an _observable_ of an _object_. Then provide the class in the module:
```TypeScript
@NgModule({
    imports: [
        ...
        HttpModule,
        TranslationModule.forRoot({ translationProvider: CustomTranslationProvider })
    ],
    ...
})
```
As you can see from the example above, you can pass any object to the `addCustomProvider` method: it will be returned to `getTranslation` method along with the current language. In this way, you can call the `addCustomProvider` method several times with different parameters. All the data retrieved will be merged by the `TranslationService`.

### <a name="2.5"/>2.5 Default locale
The default locale contains the current language and culture. It consists of:
* `language code`: ISO 639 two-letter or three-letter code of the language
* `country code`: ISO 3166 two-letter, uppercase code of the country

and optionally:
- `script code`: used to indicate the script or writing system variations that distinguish the written forms of a language or its dialects. It consists of four letters and was defined according to the assignments found in ISO 15924
- `numbering system`: possible values include: "arab", "arabext", "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr", "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt"
- `calendar`: possible values include: "buddhist", "chinese", "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic", "islamicc", "iso8601", "japanese", "persian", "roc"

For more information see [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

### <a name="2.6"/>2.6 Intl API
To localize dates and numbers, this library uses [Intl API](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Intl), through Angular. 
All modern browsers have implemented this API. You can use [Intl.js](https://github.com/andyearnshaw/Intl.js) to extend support to all browsers. 
Just add one script tag in your `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US"></script>
```
When specifying the `features`, you have to specify what locale, or locales to load.

*When a feature is not supported, however, for example in older browsers, Angular localization does not generate an error in the browser, but returns the value without performing operations.*

## <a name="3"/>3 Getting the translation
To get the translation, this library uses _pure pipes_ (to know the difference between _pure_ and _impure pipes_ see [here](https://angular.io/docs/ts/latest/guide/pipes.html)) or _directives_. 
You can also get the translation in component class.

### <a name="3.1"/>3.1 Pure pipes
Type | Format | Pipe syntax
---- | ------ | -----------
Message | String | `expression \| translate:lang`
Date | Date/Number/ISO string | `expression \| localeDate[:defaultLocale[:format]]`
Number | Decimal | `expression \| localeDecimal[:defaultLocale[:digitInfo]]`
Number | Percentage | `expression \| localePercent[:defaultLocale[:digitInfo]]`
Number | Currency | `expression \| localeCurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]`

#### <a name="3.1.1"/>3.1.1 Messages
Implement _Language_ decorator in the component to provide the parameter to the _translate_ pipe:
```TypeScript
export class HomeComponent implements OnInit {

    @Language() lang: string;

    ngOnInit(): void {
        //
    }

}
```
*To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.*
```
expression | translate:lang
```
where `expression` is a string key that indicates the message to translate:
```Html
{{ 'Title' | translate:lang }}
```
_Json_:
```
{
    "Title": "Angular localization"
}
```
##### Composed keys
```Html
{{ 'Home.Title' | translate:lang }}
```
_Json_:
```
{
    "Home": {
        "Title": "Angular localization"
    }
}
```
##### Parameters
```Html
{{ 'User notifications' | translate:lang:{ user: username, NoMessages: messages.length } }}
```
_Json_:
```
{
    "User notifications": "{{ user }}, you have {{ NoMessages }} new messages"
}
```

#### <a name="3.1.2"/>3.1.2 Dates & Numbers
Implement _DefaultLocale_ & _Currency_ decorators in the component to provide the parameters to _localeDecimal_, _localePercent_ & _localeCurrency_ pipes.
```TypeScript
export class HomeComponent implements OnInit {

    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;

    ngOnInit(): void {
        //
    }

}
```
*To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.*
##### Dates
```
expression | localeDate[:defaultLocale[:format]]
```
where `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string, and `format` indicates which date/time components to include. 
See Angular [DatePipe](https://angular.io/docs/ts/latest/api/common/index/DatePipe-pipe.html) for further information.
```Html
{{ today | localeDate:defaultLocale:'fullDate' }}
```
##### Decimals
```
expression | localeDecimal[:defaultLocale:[digitInfo]]
```
where `expression` is a number and `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. 
See Angular [DecimalPipe](https://angular.io/docs/ts/latest/api/common/index/DecimalPipe-pipe.html) for further information.

```Html
{{ value | localeDecimal:defaultLocale:'1.5-5' }}
```
##### Percentages
```
expression | localePercent[:defaultLocale:[digitInfo]]
```
```Html
{{ value | localePercent:defaultLocale:'1.1-1' }}
```
##### Currencies
```
expression | localeCurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
```
where `symbolDisplay` is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 
```Html
{{ value | localeCurrency:defaultLocale:currency:true:'1.2-2' }}
```
*You can dynamically change parameters and expressions values.*

#### <a name="3.1.3"/>3.1.3 Translation & Localization classes
When using _pipes_, alternatively to _decorators_ you can 
extend `Translation` or `Localization` classes.

Extend `Translation` class in the component to provide _lang_ to the _translate_ pipe:
```TypeScript
export class HomeComponent extends Translation { }
```
Extend `Localization` class in the component to provide _lang_ to the _translate_ pipe, _defaultLocale_ & _currency_ 
to the _localeDecimal_, _localePercent_ & _localeCurrency_ pipes.
```TypeScript
export class HomeComponent extends Localization { } 
```
To cancel subscriptions for the params, you can call the `cancelParamSubscriptions` method into `ngOnDestroy`.

#### <a name="3.1.4"/>3.1.4 OnPush ChangeDetectionStrategy
_Pure pipes_ don't need to set `ChangeDetectionStrategy` to `OnPush`. If into your components you need to use it, you have to extend `Translation` or `Localization` class and pass `ChangeDetectorRef`:
```TypeScript
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Translation, TranslationService } from './src/angular-l10n'

@Component({
    ...
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends Translation {

    constructor(public translation: TranslationService, public ref: ChangeDetectorRef) {
        super(translation, ref);
        ...
    }

} 
```
That's because we need to know the component reference that implements the `OnPush` strategy.

### <a name="3.2"/>3.2 Directives
Type | Format | Html syntax
---- | ------ | -----------
Message | String | `<tagname translate>expression</tagname>` or `<tagname l10nTranslate>expression</tagname>`
Date | Date/Number/ISO string | `<tagname localeDate="[format]">expression</tagname>`
Number | Decimal | `<tagname localeDecimal="[digitInfo]">expression</tagname>`
Number | Percentage | `<tagname localePercent="[digitInfo]">expression</tagname>`
Number | Currency | `<tagname localeCurrency="[digitInfo]" [symbol]="[symbolDisplay]">expression</tagname>`

##### Messages
```Html
<h1 translate>Title</h1>
```
Parameters:
```Html
<p [translate]="{ user: username, NoMessages: messages.length }">User notifications</p>
```
##### Dates & numbers
```Html
<p localeDate>{{ today }}</p>
<p localeDate="fullDate">{{ today }}</p>

<p localeDecimal>{{ value }}</p>
<p localeDecimal="1.5-5">{{ value }}</p>

<p localePercent>{{ value }}</p>
<p localePercent="1.1-1">{{ value }}</p>

<p localeCurrency>{{ value }}</p>
<p localeCurrency="1.2-2" [symbol]="true">{{ value }}</p>
```
*You can dynamically change attributes, parameters and expressions values, as with pipes.*

*You can properly translate UI components like Angular material:*
```Html
<a routerLinkActive="active-link" md-list-item routerLink="/home" translate>App.Home</a>
```
rendered as:
```Html
<a md-list-item="" role="listitem" routerlink="/home" routerlinkactive="active-link" translate="" href="#/home" class="active-link">
    <div class="md-list-item">
        <div class="md-list-text"></div>
        App.Home
    </div>
</a>
```
*If you use in the component only the directives and not the pipes, you don't need to use decorators.*

### <a name="3.3"/>3.3 Using Html tags in translation
If you have Html tags in translation like this:
```
"Strong subtitle": "<strong>It's a small world</strong>"
```
you have to use `innerHTML` attribute.

Using _pipes_:
```Html
<p [innerHTML]="'Strong subtitle' | translate:lang"></p>
```
Using _directives_:
```Html
<p [innerHTML]="'Strong subtitle'" translate></p>
```

### <a name="3.4"/>3.4 Getting the translation in component class
To get the translation in component class, `TranslationService` has the following methods:
* `translate(key: string, args?: any, lang?: string): string`
* `translateAsync(key: string, args?: any, lang?: string): Observable<string>`

When you use those methods, _you must be sure that the Http request is completed_, and the translation file has been loaded:

```TypeScript
@Component({
    ...
    template: `
        <h1>{{ title }}</h1>
        <button (click)="getTranslation()">Translate</button>
    `
})
export class HomeComponent {

    title: string;

    constructor(public translation: TranslationService) { }

    getTranslation(): void {
        this.title = this.translation.translate('Title');
    }

}
```

To get the translation _when the component is loaded_ and _when the current language changes_, 
_you must also_ subscribe to the following event:
* `translationChanged: EventEmitter<string>`

```TypeScript
@Component({
    ...
    template: `<h1>{{ title }}</h1>`
})
export class HomeComponent implements OnInit {

    title: string = this.translation.translate('Title');

    constructor(public translation: TranslationService) { }

    ngOnInit(): void {
        this.translation.translationChanged.subscribe(
            () => { this.title = this.translation.translate('Title'); }
        );
    }

}
```

To get the translation of dates and numbers, you have the `getDefaultLocale` method of `LocaleService`, and the `defaultLocaleChanged` event to know when `defaultLocale` changes. You can use the `transform` method of the corresponding pipe to get the translation, but you could use the _Intl APIs_ directly (or also use other specific libraries):
```TypeScript
@Component({
    ...
    template: `<p>{{ value }}</p>`
})
export class HomeComponent {
  
    pipe: LocaleDecimalPipe = new LocaleDecimalPipe();
    value: number = pipe.transform(1234.5, this.locale.getDefaultLocale(), '1.2-2');

    constructor(public locale: LocaleService) { }

    ngOnInit(): void {
        this.locale.defaultLocaleChanged.subscribe(
            () => {
                this.value = pipe.transform(1234.5, this.locale.getDefaultLocale(), '1.2-2');
            }
        );
    }

}
```

## <a name="4"/>4 Changing language, default locale or currency at runtime
To change language, default locale or currency at runtime, `LocaleService` has the following methods:
* `setCurrentLanguage(languageCode: string): void`
* `setDefaultLocale(languageCode: string, countryCode: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void`
* `setCurrentCurrency(currencyCode: string): void`

## <a name="5"/>5 Lazy loading
You can create an instance of `TranslationService` with its own translation data for every _lazy loaded_ module, as shown:
![LazyLoading](images/LazyLoading.png)
You can create a new instance of `TranslationService` calling the `forChild` method of the module you are using, 
and configure the service with the new providers:

```TypeScript
@NgModule({
    imports: [
        ...
        TranslationModule.forChild() // New instance of TranslationService.
    ],
    declarations: [ListComponent]
})
export class ListModule {

    constructor(public translation: TranslationService) {
        this.translation.addConfiguration()
            .addProvider('./assets/locale-list-');
        this.translation.init();
    }

}
```
In this way, application performance and memory usage are optimized.

## <a name="6"/>6 Validation by locales
Import the modules you need in the application root module:
```TypeScript
@NgModule({
    imports: [
        ...
        LocalizationModule.forRoot(),
        LocaleValidationModule.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### <a name="6.1"/>6.1 Validating a number
Directive | Validator | Options | Errors
--------- | --------- | ------- | ------
`LocaleNumberValidator` | `validateLocaleNumber=[digitInfo]` | `[minValue]` `[maxValue]` | `format` or `minValue` or `maxValue`

where `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`, and `minValue` and `maxValue` attributes are optional:
```Html
<input validateLocaleNumber="1.2-2" [minValue]="0" [maxValue]="1000" name="decimal" [(ngModel)]="decimal">
```
or, if you use variables:
```Html
<input [validateLocaleNumber]="digits" [minValue]="minValue" [maxValue]="maxValue" name="decimal" [(ngModel)]="decimal">
```

#### <a name="6.1.1"/>6.1.1 Parsing a number
When the number is valid, you can get its value by the `parseNumber` method of `LocaleValidation`:
```TypeScript
parsedValue: number = null;

constructor(private localeValidation: LocaleValidation) { }

onSubmit(value: string): void {
    this.parsedValue = this.localeValidation.parseNumber(value);
}
```

#### <a name="6.1.2"/>6.1.2 FormBuilder
If you use `validateLocaleNumber` with `FormBuilder`, you have to invoke the following function:
```TypeScript
validateLocaleNumber(digits: string, MIN_VALUE?: number, MAX_VALUE?: number): Function
```

## <a name="7"/>7 Collator
`Collator` class has the following methods for sorting and filtering a list by locales:
* `sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]`
* `sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>`
* `search(s: string, list: any[], keyNames: any[], options?: any): any[]`
* `searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>`

These methods use the [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) object, a constructor for collators, objects that enable language sensitive string comparison.

*This feature is not supported by all browsers, even with the use of `Intl.js`.*

## <a name="8"/>8 Services APIs

### <a name="8.1"/>8.1 TranslationModule
Method | Function
------ | --------
`static forRoot(token?: Token): ModuleWithProviders` | Use in `AppModule`: new instances of `LocaleService` & `TranslationService`
`static forChild(token?: Token): ModuleWithProviders` | Use in feature modules with lazy loading: new instance of `TranslationService`

### <a name="8.2"/>8.2 LocalizationModule
Method | Function
------ | --------
`static forRoot(token?: Token): ModuleWithProviders` | Use in `AppModule`: new instances of `LocaleService` & `TranslationService`
`static forChild(token?: Token): ModuleWithProviders` | Use in feature modules with lazy loading: new instance of `TranslationService`

### <a name="8.3"/>8.3 LocaleValidationModule
Method | Function
------ | --------
`static forRoot(): ModuleWithProviders` | Use in `AppModule`: new instance of `LocaleValidation`

### <a name="8.4"/>8.4 ILocaleService
Property | Value
---------- | -----
`languageCodeChanged: EventEmitter<string>` |
`defaultLocaleChanged: EventEmitter<string>` |
`currencyCodeChanged: EventEmitter<string>` |
`loadTranslation: Subject<any>` |

Method | Function
------ | --------
`addConfiguration(): ILocaleConfigAPI` | Configure the service in the application root module or in a feature module with lazy loading
`getConfiguration(): ILocaleConfig` |
`init(): void` | Call this method after the configuration to initialize the service
`getAvailableLanguages(): string[]` |
`getLanguageDirection(languageCode?: string): string` |
`getCurrentLanguage(): string` |
`getCurrentCountry(): string` |
`getCurrentScript(): string` |
`getCurrentNumberingSystem(): string` |
`getCurrentCalendar(): string` |
`getDefaultLocale(): string` |
`getCurrentCurrency(): string` |
`setCurrentLanguage(languageCode: string): void` |
`setDefaultLocale(languageCode: string, countryCode: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void` |
`setCurrentCurrency(currencyCode: string): void` |

### <a name="8.5"/>8.5 ITranslationService
Property | Value
---------- | -----
`translationChanged: EventEmitter<string>` |
`translationError: EventEmitter<any>` |
`serviceState: ServiceState` |

Method | Function
------ | --------
`addConfiguration(): ITranslationConfigAPI` | Configure the service in the application root module or in a feature module with lazy loading
`getConfiguration(): ITranslationConfig` |
`init(): void` | Call this method after the configuration to initialize the service
`getLanguage(): string` | The language of `TranslationService` is updated when the translation data has been loaded
`translate(key: string, args?: any, lang?: string): string` |
`translateAsync(key: string, args?: any, lang?: string): Observable<string>` |

### <a name="8.6"/>8.6 TranslationProvider
Method | Function
------ | --------
`abstract getTranslation(language: string, args: any): Observable<any>` | This method must contain the logic of data access

### <a name="8.7"/>8.7 Translation
Property | Value
---------- | -----
`lang: string` |
`protected paramSubscriptions: ISubscription[]` |

Method | Function
------ | --------
`protected cancelParamSubscriptions(): void` |

### <a name="8.8"/>8.8 Localization
Property | Value
---------- | -----
`defaultLocale: string` |
`currency: string` |

### <a name="8.9"/>8.9 ILocaleValidation
Method | Function
------ | --------
`parseNumber(s: string): number \| null` | Converts a string to a number according to default locale

### <a name="8.10"/>8.10 ICollator
Method | Function
------ | --------
`compare(key1: string, key2: string, extension?: string, options?: any): number` | Compares two keys by the value of translation according to the current language
`sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]` | Sorts an array of objects or an array of arrays according to the current language
`sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>` | Sorts asynchronously an array of objects or an array of arrays according to the current language
`search(s: string, list: any[], keyNames: any[], options?: any): any[]` | Matches a string into an array of objects or an array of arrays according to the current language
`searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>` | Matches asynchronously a string into an array of objects or an array of arrays according to the current language

### <a name="8.11"/>8.11 IntlAPI
Method | Function
------ | --------
`static hasDateTimeFormat(): boolean` |
`static hasNumberFormat(): boolean` |
`static hasCollator(): boolean` |
