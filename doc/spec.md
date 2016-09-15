# Angular 2 Localization library specification
Library version: 1.0.0

## Table of contents
* [1 The library structure](#1)
* [2 Getting the translation](#2)
    * [2.1 Messages](#2.1)
        * [2.1.1 Gender](#2.1.1)
        * [2.1.2 Plural](#2.1.2)
    * [2.2 Dates & Numbers](#2.2)
        * [2.2.1 Dates](#2.2.1)
        * [2.2.2 Decimals](#2.2.2)
        * [2.2.3 Percentages](#2.2.3)
        * [2.2.4 Currencies](#2.2.4)
    * [2.3 Quick use](#2.3)
    * [2.4 List](#2.4)
        * [2.4.1 Sorting & search](#2.4.1)
    * [2.5 Getting the translation in component class](#2.5)
* [3 Scenarios](#3)
    * [3.1 First scenario: you need to localize dates and numbers, but no messages](#3.1)
    * [3.2 Second scenario: you only need to translate messages](#3.2)
        * [3.2.1 Direct loading](#3.2.1)
        * [3.2.2 Asynchronous loading of json files](#3.2.2)
        * [3.2.3 Asynchronous loading through a Web API](#3.2.3)
        * [3.2.4 Special characters](#3.2.4)
        * [3.2.5 Changing language](#3.2.5)
    * [3.3 Third scenario: you need to translate messages, dates and numbers](#3.3)
        * [3.3.1 Changing locale and currency](#3.3.1)
* [4 Default locale](#4)
    * [4.1 Storage](#4.1)
* [5 Lazy routing](#5)
* [6 Validation by locales](#6)
    * [6.1 Validating a number](#6.1)
        * [6.1.1 Parsing a number](#6.1.1)
        * [6.1.2 FormBuilder](#6.1.2)
        * [6.1.3 Full example with FormBuilder and formControl](#6.1.3)
* [7 Services API](#7)
    * [7.1 LocaleService](#7.1)
    * [7.2 LocalizationService](#7.2)
    * [7.3 LocaleParser](#7.3)
    * [7.4 IntlSupport](#7.4)
* [Appendix A - Angular-CLI settings](#Appendix A)
* [Appendix B - Using Ionic 2](#Appendix B)
* [Appendix C - ES5 example](#Appendix C)

## <a name="1"/>1 The library structure
This library has the following classes:

Module | Class | Type | Contract
------ | ----- | -----| --------
`LocaleModule` | `LocaleService` | Service | Defines language, default locale & currency
`LocaleModule` | `LocaleDatePipe` | Pipe | Localizes dates
`LocaleModule` | `LocaleDecimalPipe` | Pipe | Localizes decimal numbers
`LocaleModule` | `LocalePercentPipe` | Pipe | Localizes percent numbers
`LocaleModule` | `LocaleCurrencyPipe` | Pipe | Localizes currencies
`LocaleModule` | `LocaleNumberValidator` | Directive | Validates a number by default locale
`LocalizationModule` | `LocalizationService` | Service | Gets the translation data and performs operations
`LocalizationModule` | `TranslatePipe` | Pipe | Translates messages
 | `Locale` | Service | Provides the methods for localization
 | `LocaleParser` | Service | Parses a string and returns a number by default locale
 | `IntlSupport` | Service | Provides the methods to check if Intl is supported

## <a name="2"/>2 Getting the translation
To get the translation, this library uses pure pipes. To know the advantages over impure pipes, please see [here](https://angular.io/docs/ts/latest/guide/pipes.html). 

Type | Format | Syntax
---- | ------ | ------
Message | String | `expression | translate:lang`
Date | Date/Number | `expression | localeDate[:defaultLocale[:format]]`
Number | Decimal | `expression | localeDecimal[:defaultLocale:[digitInfo]]`
Number | Percentage | `expression | localePercent[:defaultLocale:[digitInfo]]`
Number | Currency | `expression | localeCurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]`

### <a name="2.1"/>2.1 Messages
```
expression | translate:lang
```
where `expression` is a string key that indicates the message to translate.

For example, to get the translation, add in the template:
```Html
{{ 'TITLE' | translate:lang }}
```
You can also use composed keys:
```Html
{{ 'HOME.TITLE' | translate:lang }}
```
If you want to use parameters:
```Html
{{ 'USER_NOTIFICATIONS' | translate:lang:{ user: username, NoMessages: messages.length } }}
```
Then include in the component:
```TypeScript
import { LocalizationService } from 'angular2localization';
...
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

#### <a name="2.1.1"/>2.1.1 Gender
With Angular 2 [I18nSelectPipe](https://angular.io/docs/ts/latest/api/common/index/I18nSelectPipe-class.html) that displays the string that matches the current value:
```Html
{{ expression | i18nSelect:mapping | translate:lang }}
```

#### <a name="2.1.2"/>2.1.2 Plural
With Angular 2 [I18nPluralPipe](https://angular.io/docs/ts/latest/api/common/index/I18nPluralPipe-class.html) that pluralizes the value properly:
```Html
{{ expression | i18nPlural:mapping | translate:lang }}
```

### <a name="2.2"/>2.2 Dates & Numbers
To localize dates and numbers, this library uses [Intl API](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Intl), through Angular 2. 
All modern browsers, except Safari, have implemented this API. You can use [Intl.js](https://github.com/andyearnshaw/Intl.js) to extend support to all browsers. 
Just add one script tag in your `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US"></script>
```
When specifying the `features`, you have to specify what locale, or locales to load.

*N.B. When a feature is not supported, however, for example in older browsers, Angular 2 Localization does not generate an error in the browser, but returns the value without performing operations.*

#### <a name="2.2.1"/>2.2.1 Dates
```
expression | localeDate[:defaultLocale[:format]]
```
where `expression` is a date object or a number (milliseconds since UTC epoch) and `format` indicates which date/time components to include. 
See Angular 2 [DatePipe](https://angular.io/docs/ts/latest/api/common/index/DatePipe-class.html) for further information.

For example, to get the local date, add in the template:
```Html
{{ today | localeDate:defaultLocale:'fullDate' }}
```
and include in the component:
```TypeScript
import { LocaleService } from 'angular2localization';
...
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

#### <a name="2.2.2"/>2.2.2 Decimals
```
expression | localeDecimal[:defaultLocale:[digitInfo]]
```
where `expression` is a number and `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. 
See Angular 2 [DecimalPipe](https://angular.io/docs/ts/latest/api/common/index/DecimalPipe-class.html) for further information.

For example, to get the local decimal, add in the template:
```Html
{{ pi | localeDecimal:defaultLocale:'1.5-5' }}
```
and include `get defaultLocale()` in the component.

#### <a name="2.2.3"/>2.2.3 Percentages
```
expression | localePercent[:defaultLocale:[digitInfo]]
```
For example, to get the local percentage, add in the template:
```Html
{{ a | localePercent:defaultLocale:'1.1-1' }}
```
and include `get defaultLocale()` in the component.

#### <a name="2.2.4"/>2.2.4 Currencies
```
expression | localeCurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
```
where `symbolDisplay` is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 

For example, to get the local currency, add in the template:
```Html
{{ b | localeCurrency:defaultLocale:currency:true:'1.2-2' }}
```
and include `get defaultLocale()` and `get currency()` in the component:
```TypeScript
// Gets the current currency.
get currency(): string {

    return this.locale.getCurrentCurrency();
   
}
```

### <a name="2.3"/>2.3 Quick use
If you want, you can avoid including `get lang()`, `get defaultLocale()` or `get currency()` by extending the `Locale` superclass in the components:
```TypeScript
import { Locale, LocaleService, LocalizationService } from 'angular2localization';
...
export class AppComponent extends Locale {

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        super(locale, localization);
        ...
    }

} 
```

### <a name="2.4"/>2.4 List
Now you can localize a list simply. For example:
```Html
<md-card *ngFor="let item of DATA">
    <md-card-title>{{ item.name }}</md-card-title>
    <md-card-content>
        <md-list>
            <md-list-item>
                <h3 md-line>{{ item.position | translate:lang }}</h3>
                <p md-line>{{ item.salary | localeCurrency:defaultLocale:currency:true:'1.0-0' }}</p>
                <p md-line>{{ item.startDate | localeDate:defaultLocale:'mediumDate' }}</p>
            </md-list-item>
        </md-list>
    </md-card-content>
</md-card>
```

#### <a name="2.4.1"/>2.4.1 Sorting & search
[LocalizationService](#7.2) has the following methods for sorting and filtering a list by locales:
* `sort(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Array<any>;`
* `sortAsync(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Observable<Array<any>>;`
* `search(s: string, list: Array<any>, keyNames: any[], options?: any): Array<any>;`
* `searchAsync(s: string, list: Array<any>, keyNames: any[], options?: any): Observable<any>;`

These methods use the [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) object, a constructor for collators, objects that enable language sensitive string comparison.

*N.B. This feature is not supported by all browsers, even with the use of `Intl.js`.*

### <a name="2.5"/>2.5 Getting the translation in component class
If you need to get the translation in component class, [LocalizationService](#7.2) has the following methods:
* `translate(key: string, args?: any): string;`
* `translateAsync(key: string, args?: any): Observable<string>;`

But if you need to get the translation when the selected language changes, you must subscribe to the following event:
* `translationChanged: EventEmitter<any>;`

For example:
```TypeScript
@Component({
    ...
    template: '<h1>{{ title }}</h1>'
})
export class HomeComponent {

    // Initializes the variable 'title' with the current translation at the time of the component loading.
    public title: string = this.localization.translate('TITLE');

    constructor(public localization: LocalizationService) {

        this.localization.translationChanged.subscribe(

            // Refreshes the variable 'title' with the new translation when the selected language changes.
            () => { this.title = this.localization.translate('TITLE'); }

        );

    }

}
```
*N.B. In the bootstrap component and in its children you have to subscribe to the `translationChanged` event to detect the first asynchronous loading of the translation data.*

## <a name="3"/>3 Scenarios
Import the modules you need in `AppModule`:
```TypeScript
import { HttpModule } from '@angular/http';
// Angular 2 Localization.
import { LocaleModule, LocalizationModule } from 'angular2localization';

@NgModule({
    imports: [
        ...
        HttpModule,
        LocaleModule.forRoot(), // New instance of LocaleService.
        LocalizationModule.forRoot() // New instance of LocalizationService.
    ],
    ...
})

export class AppModule { }
```

### <a name="3.1"/>3.1 First scenario: you need to localize dates and numbers, but no messages
Add in the bootstrap component `AppComponent` in order to access the data of location from anywhere in the application:
```TypeScript
import { LocaleService } from 'angular2localization';
...
export class AppComponent {

    constructor(public locale: LocaleService) {

        // Required: default language (ISO 639 two-letter or three-letter code) and country (ISO 3166 two-letter, uppercase code).
        this.locale.definePreferredLocale('en', 'US');

        // Optional: default currency (ISO 4217 three-letter code).
        this.locale.definePreferredCurrency('USD');

    }

}
```

### <a name="3.2"/>3.2 Second scenario: you only need to translate messages
Add in the bootstrap component `AppComponent` in order to access the data of location from anywhere in the application:
```TypeScript
import { LocaleService, LocalizationService } from 'angular2localization';
...
export class AppComponent {

    constructor(public locale: LocaleService, public localization: LocalizationService) {

        // Adds a new language (ISO 639 two-letter or three-letter code).
        this.locale.addLanguage('en');
        // Add a new language here.

        // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        // Selects the current language of the browser/user if it has been added, else the default language.
        this.locale.definePreferredLanguage('en', 30);

    }

}
```

#### <a name="3.2.1"/>3.2.1 Direct loading
To initialize `LocalizationService` for the direct loading, add the following code in the body of constructor of the bootstrap component:
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

#### <a name="3.2.2"/>3.2.2 Asynchronous loading of json files
Alternatively, to initialize `LocalizationService` for the asynchronous loading add the following code in the body of constructor of the bootstrap component:
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
If you use composed key:
```
{
    "HOME": {
        "TITLE": "Angular 2 Localization",
        ...
    },
    ...
}
```
or parameters:
```
{
    "USER_NOTIFICATIONS": "{{ user }}, you have {{ NoMessages }} new messages",
    ...
}
```
*N.B. Resource files must be saved in `UTF-8` format.*

#### <a name="3.2.3"/>3.2.3 Asynchronous loading through a Web API
You can also load the data asynchronously through a Web API:
```TypeScript
this.localization.translationProvider('http://localhost:54703/api/values/', 'json', true);
this.localization.updateTranslation(); // Need to update the translation.
```
`LocalizationService` adds to the absolute URL provided only the language code. So the example URL will be something like: `http://localhost:54703/api/values/en`.

*N.B. Check that the `json` response data are in the correct format as shown above.*

#### <a name="3.2.4"/>3.2.4 Special characters
You can use quotes inside a string, as long as they don't match the quotes surrounding the string:
```
"It wasn't a dream."
```
Because strings must be written within quotes, use the `\` escape character to insert special characters into the values of the translations:
```
"\"What's happened to me?\" he thought."
```

#### <a name="3.2.5"/>3.2.5 Changing language
To change language at runtime, call the following method:
```TypeScript
this.locale.setCurrentLanguage(language);
```
where `language` is the two-letter or three-letter code of the new language (ISO 639).

### <a name="3.3"/>3.3 Third scenario: you need to translate messages, dates and numbers
Unlike what said for messages in the [Second scenario](#3.2), use the following code in the body of constructor of the bootstrap component:
```TypeScript
// Adds a new language (ISO 639 two-letter or three-letter code).
this.locale.addLanguage('en');
// Add a new language here.

// Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
// Selects the default language and country, regardless of the browser language, to avoid inconsistencies between the language and country.
this.locale.definePreferredLocale('en', 'US', 30);

// Optional: default currency (ISO 4217 three-letter code).
this.locale.definePreferredCurrency('USD');
```

#### <a name="3.3.1"/>3.3.1 Changing locale and currency
To change locale at runtime, call the following method:
```TypeScript
this.locale.setCurrentLocale(language, country);
```
where `language` is the two-letter or three-letter code of the new language (ISO 639) and `country` is the two-letter, uppercase code of the new country (ISO 3166).

To change currency at runtime, call the following method:
```TypeScript
this.locale.setCurrentCurrency(currency);
```
where `currency` is the three-letter code of the new currency (ISO 4217).

## <a name="4"/>4 Default locale
The default locale contains the current language and culture. It consists of:
* `language code`: the two-letter or three-letter code of the language (ISO 639);
* `country code`: the two-letter, uppercase code of the country (ISO 3166);

and optionally:
- `script code`: it used to indicate the script or writing system variations that distinguish the written forms of a language or its dialects. It consists of four letters and was defined according to the assignments found in ISO 15924;
- `numbering system`: possible values include: "arab", "arabext", "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr", "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt";
- `calendar`: possible values include: "buddhist", "chinese", "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic", "islamicc", "iso8601", "japanese", "persian", "roc".

For more information see [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

[LocaleService](#7.1) has the following methods to define the default locale:
* `definePreferredLocale(defaultLanguage: string, defaultCountry: string, expiry?: number, script?: string, numberingSystem?: string, calendar?: string): void;`
* `setCurrentLocale(language: string, country: string, script?: string, numberingSystem?: string, calendar?: string): void;`

When you invoke one of them, in addition to set the language and country, you can set the script, the numbering system and calendar.

### <a name="4.1"/>4.1 Storage
By default, the default locale and eventually the currency chosen by the user are stored in cookies. When you call the following method in the [Second scenario](#3.2):
* `definePreferredLanguage(defaultLanguage: string, expiry?: number): void;`

or, in the [Third scenario](#3.3):
* `definePreferredLocale(defaultLanguage: string, defaultCountry: string, expiry?: number, script?: string, numberingSystem?: string, calendar?: string): void;`

you can set the cookie expiration in days - if the expiry is omitted, the cookie becomes a session cookie.

You can also change the default storage method, enabling the `Local Storage`, before invoking the above methods:
```TypeScript
this.locale.useLocalStorage();

definePreferred...
```
The `LocaleService` will try to use the Web Storage, otherwise it will attempt to use the cookie. 

*N.B. Unlike the cookie, the Local Storage doesn't expire.*

## <a name="5"/>5 Lazy routing
If you use a `Router` in an extended application, you can create an instance of the `LocalizationService` with its own translation data for every lazy loaded module/component, as shown:
![LazyRouting](images/LazyRouting.png)
Each instance must be injected, and can be directly or asynchronously loaded.
For example, if you have a feature module:
```TypeScript
@NgModule({
    imports: [
        ...
        LocaleModule, // LocaleService is singleton.
        LocalizationModule.forChild() // New instance of LocalizationService.
    ],
    declarations: [ListComponent]
})
```

```TypeScript
export class ListComponent {

    constructor(public localization: LocalizationService) {

        // Initializes LocalizationService: asynchronous loading.
        this.localization.translationProvider('./resources/locale-list-'); // Required: initializes the translation provider with the given path prefix.
        this.localization.updateTranslation(); // Need to update the translation.

    }
```
In this way, application performance and memory usage are optimized.

## <a name="6"/>6 Validation by locales

### <a name="6.1"/>6.1 Validating a number
Directive | Validator | Options | Errors
--------- | --------- | ------- | ------
`LocaleNumberValidator` | `validateLocaleNumber=[digitInfo]` | `[minValue]` `[maxValue]` | `format` or `minValue` or `maxValue`

where `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`, and `minValue` and `maxValue` attributes are optional.

For example, to validate a decimal number, add in the template:
```Html
<md-input validateLocaleNumber="1.2-2" [minValue]="0" [maxValue]="1000" name="decimal" #decimal="ngModel" ngModel></md-input>
```
or, if you use variables:
```Html
<md-input [validateLocaleNumber]="digits" [minValue]="minValue" [maxValue]="maxValue" name="decimal" #decimal="ngModel" ngModel></md-input>
```
and declare `LocaleNumberValidator` in `AppModule`.

#### <a name="6.1.1"/>6.1.1 Parsing a number
When the number is valid, you can get its value by the `Number` static method of [LocaleParser](#7.1):
```TypeScript
parsedValue: number = null;

constructor(public locale: LocaleService) { }

onSubmit(value: string): void {

    this.parsedValue = LocaleParser.Number(value, this.locale.getDefaultLocale());

}
```

#### <a name="6.1.2"/>6.1.2 FormBuilder
If you use `validateLocaleNumber` with `FormBuilder`, you have to invoke the following function:
```TypeScript
export declare function validateLocaleNumber(locale: LocaleService, digits: string, MIN_VALUE?: number, MAX_VALUE?: number): (c: FormControl) => {
    [key: string]: any;
};
```
For example:
```TypeScript
digits: string = "1.2-2";
minValue: number = -Math.round(Math.random() * 10000) / 100;
maxValue: number = Math.round(Math.random() * 10000) / 100;

numberForm: FormGroup;
decimal: AbstractControl;

constructor(public locale: LocaleService, private fb: FormBuilder) {

    this.numberForm = fb.group({
        'decimal': ['', validateLocaleNumber(this.locale, this.digits, this.minValue, this.maxValue)]
    });

    // 'decimal' control. 
    this.decimal = this.numberForm.controls['decimal'];

}
```

#### <a name="6.1.3"/>6.1.3 Full example with FormBuilder and formControl
This is the view:
```Html
<md-card>
    <md-card-title>{{ 'NUMBERS' | translate:lang }}</md-card-title>
    <md-card-content>
        <form [formGroup]="numberForm" (ngSubmit)="onSubmit(numberForm.value)">
            <div>
                <md-input placeholder="{{ 0 | localeDecimal:defaultLocale:digits }}" [formControl]="decimal" (keyup)="decimal.valid ? parsedValue : parsedValue = null"
                    style="width: 100%"></md-input>

                <div *ngIf="decimal.hasError('format') && decimal.value != ''" style="color: #D32F2F;">
                    {{ 'NUMBER_IS_INVALID' | translate:lang }} {{ 0 | localeDecimal:defaultLocale:digits }}
                </div>
                <div *ngIf="decimal.hasError('minValue') && decimal.value != ''" style="color: #D32F2F;">
                    {{ 'MIN_VALUE_ERROR' | translate:lang }} {{ minValue | localeDecimal:defaultLocale:digits }}
                </div>
                <div *ngIf="decimal.hasError('maxValue') && decimal.value != ''" style="color: #D32F2F;">
                    {{ 'MAX_VALUE_ERROR' | translate:lang }} {{ maxValue | localeDecimal:defaultLocale:digits }}
                </div>
            </div>
            <br>
            <button type="submit" [disabled]="!decimal.valid" md-raised-button color="primary">{{ 'SUBMIT' | translate:lang }}</button>
            <br>
            <br>
            <p>{{ 'NUMBER_VALUE' | translate:lang }} {{ parsedValue }}</p>
        </form>
    </md-card-content>
</md-card>
```
and the code of the component is the following:
```TypeScript
import { Component } from '@angular/core';
// FormBuilder with formControl.
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
// Services.
import { Locale, LocaleService, LocalizationService, LocaleParser } from 'angular2localization';
// Directives for FormBuilder with formControl.
import { validateLocaleNumber } from 'angular2localization';

@Component({
    templateUrl: './app/validation.component.html'
})

export class ValidationComponent extends Locale {

    // Options.
    digits: string = "1.2-2";
    minValue: number = -Math.round(Math.random() * 10000) / 100;
    maxValue: number = Math.round(Math.random() * 10000) / 100;

    parsedValue: number = null;

    // FormBuilder with formControl.
    numberForm: FormGroup;
    decimal: AbstractControl;

    constructor(public locale: LocaleService, public localization: LocalizationService, private fb: FormBuilder) {
        super(locale, localization);

        this.numberForm = fb.group({
            'decimal': ['', validateLocaleNumber(this.locale, this.digits, this.minValue, this.maxValue)]
        });

        // 'decimal' control. 
        this.decimal = this.numberForm.controls['decimal'];

    }

    onSubmit(value: any): void {

        this.parsedValue = LocaleParser.Number(value.decimal, this.locale.getDefaultLocale());

    }

}
```
Finally, import `ReactiveFormsModule` in `AppModule`.

## <a name="7"/>7 Services API

### <a name="7.1"/>7.1 LocaleService
Property | Value
---------- | -----
`languageCodeChanged: EventEmitter<string>;` | Output for event current language code changed
`countryCodeChanged: EventEmitter<string>;` | Output for event current country code changed
`currencyCodeChanged: EventEmitter<string>;` | Output for event current currency code changed
`scriptCodeChanged: EventEmitter<string>;` | Output for event script code changed
`numberingSystemChanged: EventEmitter<string>;` | Output for event numbering system changed
`calendarChanged: EventEmitter<string>;` | Output for event calendar changed
`enableCookie: boolean;` | Enable/disable cookie
`enableLocalStorage: boolean;` | Enable/disable Local Storage

Method | Function
------ | --------
`addLanguage(language: string): void;` | Adds a new language
`useLocalStorage(): void;` | Sets Local Storage as default
`definePreferredLanguage(defaultLanguage: string, expiry?: number): void;` | Defines the preferred language. Selects the current language of the browser/user if it has been added, else the default language
`definePreferredLocale(defaultLanguage: string, defaultCountry: string, expiry?: number, script?: string, numberingSystem?: string, calendar?: string): void;` | Defines preferred languange and country, regardless of the browser language
`definePreferredCurrency(defaultCurrency: string): void;` | Defines the preferred currency
`getCurrentLanguage(): string;` | Gets the current language
`getCurrentCountry(): string;` | Gets the current country
`getCurrentCurrency(): string;` | Gets the current currency
`getScript(): string;` | Gets the script
`getNumberingSystem(): string;` | Gets the numbering system
`getCalendar(): string;` | Gets the calendar
`setCurrentLanguage(language: string): void;` | Sets the current language
`setCurrentLocale(language: string, country: string, script?: string, numberingSystem?: string, calendar?: string): void;` | Sets the current locale
`setCurrentCurrency(currency: string): void;` | Sets the current currency
`getDefaultLocale(): string;` | Gets the default locale

### <a name="7.2"/>7.2 LocalizationService
Property | Value
---------- | -----
`translationChanged: EventEmitter<any>;` | Output for event translation changed
`languageCode: string;` | The language code for the service
`loadingMode: LoadingMode;` | The loading mode for the service
`serviceState: ServiceState;` | The service state

Method | Function
------ | --------
`addTranslation(language: string, translation: any): void;` | Direct loading: adds new translation data
`translationProvider(prefix: string, dataFormat?: string, webAPI?: boolean): void;` | Asynchronous loading: defines the translation provider
`translate(key: string, args?: any): string;` | Translates a key
`translateAsync(key: string, args?: any): Observable<string>;` | Translates a key
`updateTranslation(language?: string): void;` | Updates the language code and loads the translation data for the asynchronous loading
`compare(key1: string, key2: string, extension?: string, options?: any): number;` | Compares two keys by the value of translation & the current language code
`sort(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Array<any>;` | Sorts an array of objects or an array of arrays by the current language code
`sortAsync(list: Array<any>, keyName: any, order?: string, extension?: string, options?: any): Observable<Array<any>>;` | Sorts an array of objects or an array of arrays by the current language code
`search(s: string, list: Array<any>, keyNames: any[], options?: any): Array<any>;` | Matches a string into an array of objects or an array of arrays
`searchAsync(s: string, list: Array<any>, keyNames: any[], options?: any): Observable<any>;` | Matches a string into an array of objects or an array of arrays

### <a name="7.3"/>7.3 LocaleParser
Method | Function
------ | --------
`static NumberRegExpFactory(defaultLocale: string, digits: string): RegExp;` | Builds the regular expression for a number by default locale
`static Number(s: string, defaultLocale: string): number;` | Parses a string and returns a number by default locale

### <a name="7.4"/>7.4 IntlSupport
Method | Function
------ | --------
`static DateTimeFormat(defaultLocale: string): boolean;` | Support for dates
`static NumberFormat(defaultLocale: string): boolean;` | Support for numbers
`static Collator(lang: string): boolean;` | Support for Collator

## <a name="Appendix A"/>Appendix A - Angular-CLI settings
Install the library:
```
npm install --save angular2localization
```

### angular-cli@webpack
No need to set up anything, just import in your code.

## <a name="Appendix B"/>Appendix B - Using Ionic 2 up to 2.0.0-beta.11 & Angular 2.0.0-rc.4
Install the library:
```Shell
npm install --save angular2localization@0.8.9
```
Initialize the services of the library in `app.ts` files, when the platform is ready. This in an example for the [Second scenario](#3.2):
```TypeScript
...
import { HTTP_PROVIDERS } from '@angular/http';

import { LocaleService, LocalizationService } from 'angular2localization';

@Component({
    ...
    providers: [LocaleService, LocalizationService] // Inherited by all descendants.
})
export class MyApp {
    ...
    constructor(public locale: LocaleService, public localization: LocalizationService, private platform: Platform) {
        ...
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            ...

            // Adds a new language (ISO 639 two-letter or three-letter code).
            this.locale.addLanguage('en');
            // Add a new language here.

            this.locale.useLocalStorage(); // To store the user's chosen language, prefer Local Storage.

            // Required: default language.
            // Selects the current language of the browser/user if it has been added, else the default language.
            this.locale.definePreferredLanguage('en');

            // Initializes LocalizationService: asynchronous loading.
            this.localization.translationProvider('./i18n/locale-'); // Required: initializes the translation provider with the given path prefix.      
            this.localization.updateTranslation(); // Need to update the translation.
        });
    }
}

ionicBootstrap(MyApp, [HTTP_PROVIDERS]);
```
and create the `json` files of the translations such as `locale-en.json` in `wwww/i18n` folder.

## <a name="Appendix C"/>Appendix C - ES5 example
This is an example in ES5 for the [First scenario](#3.1). The `AppModule`:
```JavaScript
(function (app) {
  app.AppModule =
    ng.core.NgModule({
      imports: [ng.platformBrowser.BrowserModule, ng.angular2localization.LocaleModule.forRoot()],
      declarations: [app.AppComponent],
      bootstrap: [app.AppComponent]
    })
      .Class({
        constructor: function () { }
      });
})(window.app || (window.app = {}));
```
And the `AppComponent`:
```JavaScript
(function (app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'app-component',
      template: `<h1>{{ today | localeDate:defaultLocale:'fullDate' }}`
    })
      .Class({
        constructor: [ng.angular2localization.LocaleService, function (locale) {

          this.locale = locale;

          // Required: default language (ISO 639 two-letter or three-letter code) and country (ISO 3166 two-letter, uppercase code).
          this.locale.definePreferredLocale('en', 'US');

          this.today = Date.now();

        }]
      });

  Object.defineProperty(app.AppComponent.prototype, "defaultLocale", {
    // Gets the default locale.
    get: function () {

      return this.locale.getDefaultLocale();

    }
  });

})(window.app || (window.app = {}));
```