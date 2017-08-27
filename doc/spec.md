# Angular localization library specification
Library version: 4.0.0-beta.0

## Table of contents
* [1 Library structure](#1)
* [2 Configuration](#2)
    * [2.1 First scenario: you only need to translate messages](#2.1)
    * [2.2 Second scenario: you need to translate messages, dates & numbers](#2.2)
    * [2.3 Configuration settings](#2.3)
    * [2.4 Loading the translation data](#2.4)
        * [2.4.1 Direct loading](#2.4.1)
        * [2.4.2 Asynchronous loading of json files](#2.4.2)
        * [2.4.3 Asynchronous loading through a Web API](#2.4.3)
        * [2.4.4 Using fallback providers](#2.4.4)
        * [2.4.5 Using a custom provider](#2.4.5)
    * [2.5 Using a composed language](#2.5)
    * [2.6 Default locale](#2.6)
    * [2.7 Storage](#2.7)
    * [2.8 Chaching](#2.8)
    * [2.9 Intl API](#2.9)
* [3 Getting the translation](#3)
    * [3.1 Pure pipes](#3.1)
        * [3.1.1 Messages](#3.1.1)
        * [3.1.2 Dates & Numbers](#3.1.2)
        * [3.1.3 Translation & Localization classes](#3.1.3)
        * [3.1.4 OnPush ChangeDetectionStrategy](#3.1.4)
    * [3.2 Directives](#3.2)
        * [3.2.1 Messages](#3.2.1)
        * [3.2.2 Dates & Numbers](#3.2.2)
        * [3.2.3 Attributes](#3.2.3)
        * [3.2.4 UI components](#3.2.4)
    * [3.3 Using Html tags in translation](#3.3)
    * [3.4 Getting the translation in component class](#3.4)
    * [3.5 Handle the translation](#3.5)
* [4 Changing language, default locale or currency at runtime](#4)
* [5 Lazy loaded modules & Shared modules](#5)
    * [5.1 Lazy loaded modules with the router](#5.1)
    * [5.2 Shared modules](#5.2)
* [6 Validation by locales](#6)
    * [6.1 Validating a number](#6.1)
        * [6.1.1 Parsing a number](#6.1.1)
        * [6.1.2 FormBuilder](#6.1.2)
* [7 Collator](#7)
* [8 Unit testing](#8)
* [9 Services APIs](#9)

## <a name="1"/>1 Library structure
##### Main modules
Class | Contract
----- | --------
`TranslationModule` | Provides dependencies, pipes & directives for translating messages
`LocalizationModule` | Provides dependencies, pipes & directives for translating messages, dates & numbers
`LocaleValidationModule` | Provides dependencies & directives for locale validation

##### Main services
Class | Contract
----- | --------
`L10nLoader` | Initializes the services
`LocaleService` | Manages language, default locale & currency
`TranslationService` | Manages the translation data
`Translation` | Provides _lang_ to the _translate_ pipe
`Localization` | Provides _lang_ to the _translate_ pipe, _defaultLocale_ & _currency_ to _localeDecimal_, _localePercent_ & _localeCurrency_ pipes
`LocaleValidation` | Provides the methods to convert strings according to default locale
`Collator` | Intl.Collator APIs
`IntlAPI` | Provides the methods to check if Intl APIs are supported

##### Main class-interfaces
Class | Contract
----- | --------
`LocaleStorage` | Class-interface to create a custom storage for default locale & currency
`TranslationProvider` | Class-interface to create a custom provider for translation data
`TranslationHandler` | Class-interface to create a custom handler for translated values

## <a name="2"/>2 Configuration
### <a name="2.1"/>2.1 First scenario: you only need to translate messages
Import the modules you need and configure the library in the application root module:
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        languages: [
            { code: 'en', dir: 'ltr' },
            { code: 'it', dir: 'ltr' }
        ],
        language: 'en',
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
        BrowserModule,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig)
    ],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(public l10nLoader: L10nLoader) {
        this.l10nLoader.load();
    }

}
```
### <a name="2.2"/>2.2 Second scenario: you need to translate messages, dates & numbers
Import the modules you need and configure the library in the application root module:
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
        BrowserModule,
        HttpClientModule,
        LocalizationModule.forRoot(l10nConfig)
    ],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(public l10nLoader: L10nLoader) {
        this.l10nLoader.load();
    }

}
```

### <a name="2.3"/>2.3 Configuration settings
The `L10nConfig` interface contains an interface to configure `LocaleService` and one to configure `TranslationService`.
#### LocaleConfig 
Property | Value
-------- | -----
`languages?: Language[]` | Adds the languages to use in the app
`language?: string` | Defines the language ISO 639 two-letter or three-letter code to be used, if the language is not found in the browser
`defaultLocale?: DefaultLocaleCodes` |Defines the default locale to be used, regardless of the browser language
`currency?: string` | Defines the currency ISO 4217 three-letter code to be used
`storage?: StorageStrategy` | Defines the storage to be used for language, default locale & currency
`cookieExpiration?: number` | If the cookie expiration is omitted, the cookie becomes a session cookie

#### TranslationConfig
Property | Value
-------- | -----
`translationData?: Array<{ languageCode: string; languageCode: string; }>` | Direct loading: adds translation data
`providers?: any[]` |  Asynchronous loading: adds translation providers
`caching?: Boolean` |  Asynchronous loading: disables/enables the cache for translation providers
`composedLanguage?: ISOCode[]` |  Sets a composed language for translations
`missingValue?: string` | Sets the value to use for missing keys
`missingKey?: string` | Sets the key to use for missing keys
`composedKeySeparator?: string` | Sets composed key separator
`i18nPlural?: boolean` | Disables/enables the translation of numbers that are contained at the beginning of the keys

>There aren't default values: you must explicitly set each parameter you need.

### <a name="2.4"/>2.4 Loading the translation data
#### <a name="2.4.1"/>2.4.1 Direct loading
You can use `translationData` setting when you configure the service, 
adding all the translation data:
```TypeScript
const translationEN: any = {
    Title: "Angular localization"
};
const translationIT: any = {
    Title: "Localizzazione in Angular"
};

const l10nConfig: L10nConfig = {
    ...
    translation: {
        translationData: [
            { languageCode: 'en', data: translationEN },
            { languageCode: 'it', data: translationIT }
        ]
    }
};
```

#### <a name="2.4.2"/>2.4.2 Asynchronous loading of json files
You can add all the providers you need:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './assets/global-' },
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ]
    }
};
```

>You can't use Direct and Asynchronous loading at the same time.

#### <a name="2.4.3"/>2.4.3 Asynchronous loading through a Web API
You can also load the data through a Web API:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        providers: [
            { type: ProviderType.WebAPI, path: 'http://localhost:54703/api/values/' }
        ]
    }
};
...
export class AppModule {
    constructor(private translation: TranslationService) {
        this.translation.translationError.subscribe((error: any) => console.log(error));
    }
}
```
`[path]{languageCode}` will be the URL used by the Http GET requests. So the example URI will be something like: `http://localhost:54703/api/values/en`.

The example above also showed as you can perform a custom action if you get a bad response.

#### <a name="2.4.4"/>2.4.4 Using fallback providers
if you need a cascade fallback when the key is not found, you can use fallback providers:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        providers: [
            { type: ProviderType.Fallback, prefix: './assets/global', fallbackLanguage: [] },
            { type: ProviderType.Fallback, prefix: './assets/locale-', fallbackLanguage: [ISOCode.Language] },
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ],
        composedLanguage: [ISOCode.Language, ISOCode.Country]
    }
};
```
and create the _json_ files such as `global.json`, `locale-en.json`, `locale-en-US.json`. When you set a fallback provider, _the translation data will be merged in order_: if a key is found in the _en-US_ file, it is used, otherwise the key in _en_ file and finally the key in _global_ file.

#### <a name="2.4.5"/>2.4.5 Using a custom provider
If you need, you can create a custom provider to load translation data.

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
        ...
        return ...
    }

}
```
Note that the method must return an _observable_ of an _object_. Then provide the class in the module:
```TypeScript
@NgModule({
    imports: [
        ...
        TranslationModule.forRoot(
            l10nConfig,
            { translationProvider: CustomTranslationProvider }
        )
    ],
    ...
})
```
`args` will be the object set during the configuration of `providers`.

See also [TranslationProvider](https://github.com/robisim74/angular-l10n/blob/master/src/services/translation-provider.ts) code.

### <a name="2.5"/>2.5 Using a composed language
By default, the `languageCode` is added as extension to the translation files. If you set `composedLanguage` during the configuration, the combination of supplied codes will be used as language:
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        languages: [
            { code: 'en', dir: 'ltr' }
        ],
        defaultLocale: { languageCode: 'en', countryCode: 'US' }
    },
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ],
        composedLanguage: [ISOCode.Language, ISOCode.Country]
    }
};
```
Your _json_ files should be something like: `./assets/locale-en-US.json` and so on. The available ISO codes are: _language_, _country_, _script_.

### <a name="2.6"/>2.6 Default locale
The default locale contains the current language and culture. It consists of:
* `language code`: ISO 639 two-letter or three-letter code of the language
* `country code`: ISO 3166 two-letter, uppercase code of the country

and optionally:
- `script code`: used to indicate the script or writing system variations that distinguish the written forms of a language or its dialects. It consists of four letters and was defined according to the assignments found in ISO 15924
- `numbering system`: possible values include: "arab", "arabext", "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr", "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt"
- `calendar`: possible values include: "buddhist", "chinese", "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic", "islamicc", "iso8601", "japanese", "persian", "roc"

For more information see [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

### <a name="2.7"/>2.7 Storage
The `defaultLocale` and the `currency` chosen by the user are stored, and retrieved at the next access. During the configuration, you can choose your `StorageStrategy`: _Session_, _Local_, _Cookie_, _Disabled_. If you don't provide a different expiration using `cookieExpiration`, the cookie becomes a session cookie.

You can also create a custom storage.

Implement `LocaleStorage` class-interface and the `read` and `write` methods:
```TypeScript
@Injectable() export class CustomStorage implements LocaleStorage {

    /**
     * This method must contain the logic to read the storage.
     * @param name 'defaultLocale' or 'currency'
     * @return A promise with the value of the given name
     */
    public async read(name: string): Promise<string | null> {
        ...
        return ...
    }

    /**
     * This method must contain the logic to write the storage.
     * @param name 'defaultLocale' or 'currency'
     * @param value The value for the given name
     */
    public async write(name: string, value: string): Promise<void> {
        ...
    }

}
```
Note that the `read` method must return a _promise_. Then provide the class in the module:
```TypeScript
@NgModule({
    imports: [
        ...
        TranslationModule.forRoot(
            l10nConfig,
            { localeStorage: CustomStorage }
        )
    ],
    ...
})
```
See also [LocaleStorage](https://github.com/robisim74/angular-l10n/blob/master/src/services/locale-storage.ts) code.

### <a name="2.8"/>2.8 Caching
You can enable the cache during configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './assets/global-' },
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ],
        caching: true
    }
};
```
The next time a translation file will be required, will be taken from the cache without making a new _http request_, with a significant performance improvement:
- if the user returns to a language already selected;
- if you use a global file shared across _lazy loaded modules_.

### <a name="2.9"/>2.9 Intl API
To localize dates and numbers, this library uses the [Intl API](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Intl). 
_All modern browsers have implemented this API_. You can use [Intl.js](https://github.com/andyearnshaw/Intl.js) to extend support to old browsers. 
Just add one script tag in your `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US"></script>
```
When specifying the `features`, you have to specify what locale, or locales to load.

>When a feature is not supported, however, for example in older browsers, Angular localization does not generate an error in the browser, but returns the value without performing operations.

## <a name="3"/>3 Getting the translation
To get the translation, this library uses _pure pipes_ (to know the difference between _pure_ and _impure pipes_ see [here](https://angular.io/guide/pipes#pure-and-impure-pipes)) or _directives_. 
You can also get the translation in component class.

### <a name="3.1"/>3.1 Pure pipes
Pipe | Type | Format | Pipe syntax
---- | ---- | ------ | -----------
Translate | Message | String | `expression \| translate:lang`
L10nDate | Date | Date/Number/ISO string | `expression \| L10nDate[:defaultLocale[:format]]`
L10nDecimal | Number | Decimal | `expression \| L10nDecimal[:defaultLocale[:digitInfo]]`
L10nPercent | Number | Percentage | `expression \| L10nPercent[:defaultLocale[:digitInfo]]`
L10nCurrency | Number | Currency | `expression \| L10nCurrency[:defaultLocale[:currency[:currencyDisplay[:digitInfo]]]]`

>You can dynamically change parameters and expressions values.

#### <a name="3.1.1"/>3.1.1 Messages
Implement _Language_ decorator in the component to provide the parameter to the _translate_ pipe:
```TypeScript
export class HomeComponent implements OnInit {

    @Language() lang: string;

    ngOnInit(): void { }

}
```

>To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

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
Set `composedKeySeparator` during the configuration, e.g. to `'.'`:
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

    ngOnInit(): void { }

}
```

>To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

##### Dates
```
expression | L10nDate[:defaultLocale[:format]]
```
Where:
- `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string: https://www.w3.org/TR/NOTE-datetime.
- `format` indicates which date/time components to include. The format can be predefined as
  shown below or custom as shown in the table.
  - `'medium'`: equivalent to `'yMMMdjms'` (e.g. `Sep 3, 2010, 12:05:08 PM` for `en-US`)
  - `'short'`: equivalent to `'yMdjm'` (e.g. `9/3/2010, 12:05 PM` for `en-US`)
  - `'fullDate'`: equivalent to `'yMMMMEEEEd'` (e.g. `Friday, September 3, 2010` for `en-US`)
  - `'longDate'`: equivalent to `'yMMMMd'` (e.g. `September 3, 2010` for `en-US`)
  - `'mediumDate'`: equivalent to `'yMMMd'` (e.g. `Sep 3, 2010` for `en-US`)
  - `'shortDate'`: equivalent to `'yMd'` (e.g. `9/3/2010` for `en-US`)
  - `'mediumTime'`: equivalent to `'jms'` (e.g. `12:05:08 PM` for `en-US`)
  - `'shortTime'`: equivalent to `'jm'` (e.g. `12:05 PM` for `en-US`)

| Component | Symbol | Narrow | Short Form   | Long Form                 | Numeric   | 2-digit    |
|-----------|:------:|--------|--------------|---------------------------|-----------|------------|
| era       |   G    | G (A)  | GGG (AD)     | GGGG (Anno Domini)        | -         | -          |
| year      |   y    | -      | -            | -                         | y (2015)  | yy (15)    |
| month     |   M    | L (S)  | MMM (Sep)    | MMMM (September)          | M (9)     | MM (09)    |
| day       |   d    | -      | -            | -                         | d (3)     | dd (03)    |
| weekday   |   E    | E (S)  | EEE (Sun)    | EEEE (Sunday)             | -         | -          |
| hour      |   j    | -      | -            | -                         | j (13)    | jj (13)    |
| hour12    |   h    | -      | -            | -                         | h (1 PM)  | hh (01 PM) |
| hour24    |   H    | -      | -            | -                         | H (13)    | HH (13)    |
| minute    |   m    | -      | -            | -                         | m (5)     | mm (05)    |
| second    |   s    | -      | -            | -                         | s (9)     | ss (09)    |
| timezone  |   z    | -      | -            | z (Pacific Standard Time) | -         | -          |
| timezone  |   Z    | -      | Z (GMT-8:00) | -                         | -         | -          |
| timezone  |   a    | -      | a (PM)       | -                         | -         | -          |

```Html
{{ today | L10nDate:defaultLocale:'fullDate' }}
```
##### Decimals
```
expression | L10nDecimal[:defaultLocale:[digitInfo]]
```
where `expression` is a number and `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`.

```Html
{{ value | L10nDecimal:defaultLocale:'1.5-5' }}
```
##### Percentages
```
expression | L10nPercent[:defaultLocale:[digitInfo]]
```
```Html
{{ value | L10nPercent:defaultLocale:'1.1-1' }}
```
##### Currencies
```
expression | L10nCurrency[:defaultLocale[:currency[:currencyDisplay[:digitInfo]]]]
```
where `currencyDisplay` is the currency formatting. Possible values are _'symbol'_ to use a localized currency symbol such as _€_, _'code'_ to use the ISO currency code, _'name'_ to use a localized currency name such as _dollar_; the default is _'symbol'_. 
```Html
{{ value | L10nCurrency:defaultLocale:currency:'symbol':'1.2-2' }}
```

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

import { Translation } from 'angular-l10n'

@Component({
    ...
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends Translation {

    constructor(public ref: ChangeDetectorRef) {
        super(ref);
        ...
    }

} 
```
That's because we need to know the component reference that implements the `OnPush` strategy.

### <a name="3.2"/>3.2 Directives
Directive | Selectors
--------- | ---------
Translate | `l10nTranslate`, `translate`
L10nDate | `l10nDate`
L10nDecimal | `l10nDecimal`
L10nPercent | `l10nPercent`
L10nCurrency | `l10nCurrency`

Directive | Type | Format | Html syntax
--------- | ---- | ------ | -----------
Translate | Message | String | `<tag l10n-attribute attribute="expr1" l10nTranslate>expr2</tag>`
L10nDate | Date | Date/Number/ISO string | `<tag l10n-attribute attribute="expr1" l10nDate="[format]">expr2</tag>`
L10nDecimal | Number | Decimal | `<tag l10n-attribute attribute="expr1" l10nDecimal="[digitInfo]">expr2</tag>`
L10nPercent | Number | Percentage | `<tag l10n-attribute attribute="expr1" l10nPercent="[digitInfo]">expr2</tag>`
L10nCurrency | Number | Currency | `<tag l10n-attribute attribute="expr1" l10nCurrency="[digitInfo]" [currencyDisplay]="[currencyDisplay]">expr2</tag>`

>You can dynamically change parameters and expressions values as with pipes. How does it work? To observe the expression change (not the parameters), a `MutationObserver` is used: the observer is added only if detected in the browser. If you want to use this feature also reaching older browsers, we recommend using pipes.

>If you use in the component only the directives and not the pipes, you don't need to use decorators.

#### <a name="3.2.1"/>3.2.1 Messages
```Html
<h1 l10nTranslate>Title</h1>
```
##### Parameters
```Html
<p [l10nTranslate]="{ user: username, NoMessages: messages.length }">User notifications</p>
```

#### <a name="3.2.2"/>3.2.2 Dates & Numbers
```Html
<p l10nDate>{{ today }}</p>
<p l10nDate="fullDate">{{ today }}</p>

<p l10nDecimal>{{ value }}</p>
<p l10nDecimal="1.5-5">{{ value }}</p>

<p l10nPercent>{{ value }}</p>
<p l10nPercent="1.1-1">{{ value }}</p>

<p l10nCurrency>{{ value }}</p>
<p l10nCurrency="1.2-2" [currencyDisplay]="'symbol'">{{ value }}</p>
```

#### <a name="3.2.3"/>3.2.3 Attributes
```Html
<p l10n-title title="Greeting" l10nTranslate>Title</p>
```
All attributes will be translated according to the master directive: `l10nTranslate`, `l10nDate` and so on.

>You can't dynamically change expressions in attributes.

##### Parameters
```Html
<p l10n-title title="Greeting" [l10nTranslate]="{ user: username, NoMessages: messages.length }">User notifications</p>
```
_Json_:
```
{
    "Greeting": "Hi {{ user }}",
    "User notifications": "{{ user }}, you have {{ NoMessages }} new messages"
}
```

#### <a name="3.2.4"/>3.2.4 UI components
You can properly translate UI components like Angular material or Ionic:
```Html
<a routerLinkActive="active-link" md-list-item routerLink="/home" l10nTranslate>App.Home</a>
```
rendered as:
```Html
<a md-list-item="" role="listitem" routerlink="/home" routerlinkactive="active-link" l10nTranslate="" href="#/home" class="active-link">
    <div class="md-list-item">
        <div class="md-list-text"></div>
        App.Home
    </div>
</a>
```

>How does it work? The algorithm searches the text in the subtree. If there is a depth higher than 4 (in the example above the text to translate has a depth 2), we recommend using pipes.

### <a name="3.3"/>3.3 Using Html tags in translation
If you have Html tags in translation like this:
```
"Strong subtitle": "<strong>It's a small world</strong>"
```
you have to use `innerHTML` property.

Using _pipes_:
```Html
<p [innerHTML]="'Strong subtitle' | translate:lang"></p>
```
Using _directives_:
```Html
<p [innerHTML]="'Strong subtitle'" l10nTranslate></p>
```

### <a name="3.4"/>3.4 Getting the translation in component class
##### Messages
To get the translation in component class, `TranslationService` has the following methods:
* `translate(keys: string | string[], args?: any, lang?: string): string | any`
* `translateAsync(keys: string | string[], args?: any, lang?: string): Observable<string | any>`

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
_you must_ subscribe to the following method:
* `translationChanged(): Observable<string>`

```TypeScript
@Component({
    ...
    template: `<h1>{{ title }}</h1>`
})
export class HomeComponent implements OnInit {

    title: string;

    constructor(public translation: TranslationService) { }

    ngOnInit(): void {
        this.translation.translationChanged().subscribe(
            () => { this.title = this.translation.translate('Title'); }
        );
    }

}
```
##### Dates & numbers
To get the translation of dates and numbers, you have the `getDefaultLocale` method of `LocaleService`, and the `defaultLocaleChanged` event to know when `defaultLocale` changes. You can use the `transform` method of the corresponding pipe to get the translation, but you could use the _Intl APIs_ directly (or also use other specific libraries):
```TypeScript
@Component({
    ...
    template: `<p>{{ value }}</p>`
})
export class HomeComponent {
  
    pipe: L10nDecimalPipe = new L10nDecimalPipe();
    value: number;

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

### <a name="3.5"/>3.5 Handle the translation
The default translation handler does not perform operations on the translated values: it handles the missing keys returning the path of the key or the value set by `missingValue` during the configuration, and replaces parameters.

To perform custom operations, you can implement `TranslationHandler` class-interface and the `parseValue` method:
```TypeScript
@Injectable() export class CustomTranslationHandler implements TranslationHandler {

    /**
     * This method must contain the logic to parse the translated value.
     * @param path The path of the key
     * @param key The key that has been requested
     * @param value The translated value
     * @param args The parameters passed along with the key
     * @param lang The current language
     * @return The parsed value
     */
    public parseValue(path: string, key: string, value: string | null, args: any, lang: string): string {
        ..
        return ...
    }

}
```
Then provide the class in the module:
```TypeScript
@NgModule({
    imports: [
        ...
        TranslationModule.forRoot(
            l10nConfig,
            { translationHandler: CustomTranslationHandler }
        )
    ],
    ...
})
```
See also [TranslationHandler](https://github.com/robisim74/angular-l10n/blob/master/src/services/translation-handler.ts) code.


## <a name="4"/>4 Changing language, default locale or currency at runtime
To change language, default locale or currency at runtime, `LocaleService` has the following methods:
* `setCurrentLanguage(languageCode: string): void`
* `setDefaultLocale(languageCode: string, countryCode: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void`
* `setCurrentCurrency(currencyCode: string): void`

## <a name="5"/>5 Lazy loaded modules & Shared modules
Before you start using this configuration, you need to know how _lazy-loading_ works: [Lazy-loading modules with the router](https://angular.io/guide/ngmodule#lazy-loading-modules-with-the-router).

### <a name="5.1"/>5.1 Lazy loaded modules with the router
You can create an instance of `TranslationService` with its own translation data for every _lazy loaded_ module, as shown:
![LazyLoading](images/LazyLoading.png)
You can create a new instance of `TranslationService` calling the `forChild` method of the module you are using, 
and configure the service with the new providers:

```TypeScript
const l10nConfig: L10nConfig = {
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './src/assets/locale-' },
            { type: ProviderType.Static, prefix: './src/assets/locale-list-' }
        ],
        ...
    }
};

@NgModule({
    imports: [
        ...
        TranslationModule.forChild(l10nConfig) // New instance of TranslationService.
    ],
    declarations: [ListComponent]
})
export class ListModule {

    constructor(public l10nLoader: L10nLoader) {
        this.l10nLoader.load();
    }

}
```
>If you use a global file shared across _lazy loaded modules_, you can enable the `caching` during the configuration in `AppModule`.

In this way, application performance and memory usage are optimized.

### <a name="5.2"/>5.2 Shared modules
If you don't want a new instance of `TranslationService` with its own translation data for each feature module, but you want it to be _singleton_ and shared by other modules, you have to call `forRoot` method of the module you are using once in `AppModule`:
```TypeScript
@NgModule({
    imports: [
        ...
        SharedModule,
        TranslationModule.forRoot(l10nConfig)
    ],
    ...
})
export class AppModule { }
```
Import/export `TranslationModule` or `LocalizationModule` _without methods_ in a shared module: 
```TypeScript
const sharedModules: any[] = [
    ...
    TranslationModule
];

@NgModule({
    imports: sharedModules,
    exports: sharedModules
})

export class SharedModule { }
```
Then in the feature module (also if it is _lazy loaded_):
```TypeScript
@NgModule({
    imports: [
        ...
        SharedModule
    ],
    ...
})
export class ListModule { }
```
You must provide the configuration only in `AppModule`.

## <a name="6"/>6 Validation by locales
Import the modules you need in the application root module:
```TypeScript
@NgModule({
    imports: [
        ...
        LocalizationModule.forRoot(l10nConfig),
        LocaleValidationModule.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### <a name="6.1"/>6.1 Validating a number
Directive | Selectors
--------- | ---------
`L10nNumberValidator` | `l10nValidateNumber`

Directive | Validator | Options | Errors
--------- | --------- | ------- | ------
`L10nNumberValidator` | `l10nValidateNumber=[digitInfo]` | `[minValue]` `[maxValue]` | `format` or `minValue` or `maxValue`

where `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`, and `minValue` and `maxValue` attributes are optional:
```Html
<input l10nValidateNumber="1.2-2" [minValue]="0" [maxValue]="1000" name="decimal" [(ngModel)]="decimal">
```
or, if you use variables:
```Html
<input [l10nValidateNumber]="digits" [minValue]="minValue" [maxValue]="maxValue" name="decimal" [(ngModel)]="decimal">
```

The number can be entered with or without the thousands separator.

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
If you use `FormBuilder`, you have to invoke the following function:
```TypeScript
l10nValidateNumber(digits: string, MIN_VALUE?: number, MAX_VALUE?: number): Function
```

## <a name="7"/>7 Collator
`Collator` class has the following methods for sorting and filtering a list by locales:
* `sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]`
* `sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>`
* `search(s: string, list: any[], keyNames: any[], options?: any): any[]`
* `searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>`

These methods use the [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) object, a constructor for collators, objects that enable language sensitive string comparison.

>Only modern browsers support this API.

## <a name="8"/>8 Unit testing
There are several ways to test an app that implements this library. To provide the data, you could use:
- a _MockBackend_
- real services
- mock services

During the configuration of _Jasmine_, you could do something like this:
```TypeScript
describe('Component: HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    let l10nLoader: L10nLoader;

    const l10nConfig: L10nConfig = {
        locale: {
            languages: [
                { code: 'en', dir: 'ltr' }
            ],
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            currency: 'USD',
            storage: StorageStrategy.Disabled
        },
        translation: {
            providers: [
                // Karma serves files from 'base' relative path.
                { type: ProviderType.Static, prefix: 'base/src/assets/locale-' }
            ],
            ...
        }
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                ...
                HttpClientModule,
                LocalizationModule.forRoot(l10nConfig)
            ],
            declarations: [HomeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        comp = fixture.componentInstance;
    });

    beforeEach((done: any) => {
        l10nLoader = TestBed.get(L10nLoader);
        l10nLoader.load().then(() => done());
    });

    it('should render translated text', (() => {
        fixture.detectChanges();

        expect(...);
    }));

});
```
In this case the real services are injected, importing `LocalizationModule.forRoot` method.

The loading of configuration is in a dedicated `beforeEach`, that will be released only when the _promise_ of the `load` method of `L10nLoader` will be resolved.

## <a name="9"/>9 Services APIs
#### TranslationModule
Method | Function
------ | --------
`static forRoot(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders` | Use in `AppModule`: new instances of `LocaleService` & `TranslationService`
`static forChild(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders` | Use in feature modules with lazy loading: new instance of `TranslationService`

#### LocalizationModule
Method | Function
------ | --------
`static forRoot(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders` | Use in `AppModule`: new instances of `LocaleService` & `TranslationService`
`static forChild(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders` | Use in feature modules with lazy loading: new instance of `TranslationService`

#### LocaleValidationModule
Method | Function
------ | --------
`static forRoot(): ModuleWithProviders` | Use in `AppModule`: new instance of `LocaleValidation`

#### L10nLoader
Method | Function
------ | --------
`load(): Promise<void>` |

#### ILocaleService
Property | Value
-------- | -----
`languageCodeChanged: EventEmitter<string>` |
`defaultLocaleChanged: EventEmitter<string>` |
`currencyCodeChanged: EventEmitter<string>` |
`loadTranslation: Subject<any>` |

Method | Function
------ | --------
`getConfiguration(): LocaleConfig` |
`init(): Promise<void>` |
`getBrowserLanguage(): string | null` |
`getAvailableLanguages(): string[]` |
`getLanguageDirection(languageCode?: string): string` |
`getCurrentLanguage(): string` |
`getCurrentCountry(): string` |
`getCurrentLocale(): string` |
`getCurrentScript(): string` |
`getCurrentNumberingSystem(): string` |
`getCurrentCalendar(): string` |
`getDefaultLocale(): string` |
`getCurrentCurrency(): string` |
`setCurrentLanguage(languageCode: string): void` |
`setDefaultLocale(languageCode: string, countryCode: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void` |
`setCurrentCurrency(currencyCode: string): void` |

#### ITranslationService
Property | Value
-------- | -----
`translationError: Subject<any>` |

Method | Function
------ | --------
`getConfiguration(): TranslationConfig` |
`init(): Promise<void>` | 
`translationChanged(): Observable<string>` | Fired when the translation data has been loaded. Returns the translation language
`translate(keys: string \| string[], args?: any, lang?: string): string \| any` | Translates a key or an array of keys
`translateAsync(keys: string \| string[], args?: any, lang?: string): Observable<string \| any>` |

#### Translation
Property | Value
-------- | -----
`lang: string` |
`protected paramSubscriptions: ISubscription[]` |

Method | Function
------ | --------
`protected cancelParamSubscriptions(): void` |

#### Localization
Property | Value
-------- | -----
`defaultLocale: string` |
`currency: string` |
`protected paramSubscriptions: ISubscription[]` |

Method | Function
------ | --------
`protected cancelParamSubscriptions(): void` |

#### ILocaleValidation
Method | Function
------ | --------
`parseNumber(s: string): number \| null` | Converts a string to a number according to default locale

#### ICollator
Method | Function
------ | --------
`compare(key1: string, key2: string, extension?: string, options?: any): number` | Compares two keys by the value of translation according to the current language
`sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]` | Sorts an array of objects or an array of arrays according to the current language
`sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>` | Sorts asynchronously an array of objects or an array of arrays according to the current language
`search(s: string, list: any[], keyNames: any[], options?: any): any[]` | Matches a string into an array of objects or an array of arrays according to the current language
`searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>` | Matches asynchronously a string into an array of objects or an array of arrays according to the current language

#### IntlAPI
Method | Function
------ | --------
`static hasIntl(): boolean` |
`static hasDateTimeFormat(): boolean` |
`static hasNumberFormat(): boolean` |
`static hasCollator(): boolean` |

#### LocaleStorage
Method | Function
------ | --------
`abstract read(name: string): Promise<string \| null>` | This method must contain the logic to read the storage
`abstract write(name: string, value: string): Promise<void>` | This method must contain the logic to write the storage

#### TranslationProvider
Method | Function
------ | --------
`abstract getTranslation(language: string, args: any): Observable<any>` | This method must contain the logic of data access

#### TranslationHandler
Method | Function
------ | --------
`abstract parseValue(path: string, key: string, value: string \| null, args: any, lang: string): string` | This method must contain the logic to parse the translated value
