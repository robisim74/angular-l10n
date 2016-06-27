# Angular 2 Localization library specification
Version 0.8.5

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
* [3 Scenarios](#3)
    * [3.1 First scenario: you need to localize dates and numbers, but no messages](#3.1)
    * [3.2 Second scenario: you only need to translate messages](#3.2)
        * [3.2.1 Direct loading](#3.2.1)
        * [3.2.2 Asynchronous loading](#3.2.2)
        * [3.2.3 Special characters](#3.2.3)
        * [3.2.4 Changing language](#3.2.4)
    * [3.3 Third scenario: you need to translate messages, dates and numbers](#3.3)
        * [3.3.1 Changing locale and currency](#3.3.1)
* [4 Default locale](#4)
* [5 Lazy routing](#5)
* [6 Validation by locales](#6)
    * [6.1 Validating a number](#6.1)
        * [6.1.1 Parsing a number](#6.1.1)
        * [6.1.2 FormBuilder](#6.1.2)
        * [6.1.3 Full example with FormBuilder and NgFormControl](#6.1.3)
* [7 Services API](#7)
    * [7.1 LocaleService](#7.1)
    * [7.2 LocalizationService](#7.2)
    * [7.3 LocaleParser](#7.3)
    * [7.4 IntlSupport](#7.4)

## <a name="1"/>1 The library structure
This library has the following classes:

Name | Type | Contract
---- | -----| --------
`LocaleService` | Service | Defines language, default locale & currency
`LocalizationService` | Service | Gets the translation data and performs operations
`Locale` | Service | Provides the methods for localization
`LocaleParser` | Service | Parses a string and returns a number by default locale
`IntlSupport` | Service | Provides the methods to check if Intl is supported
`TranslatePipe` | Pipe | Translates messages
`LocaleDatePipe` | Pipe | Localizes dates
`LocaleDecimalPipe` | Pipe | Localizes decimal numbers
`LocalePercentPipe` | Pipe | Localizes percent numbers
`LocaleCurrencyPipe` | Pipe | Localizes currencies
`LocaleNumberValidator` | Directive | Validates a number by default locale

## <a name="2"/>2 Getting the translation
To get the translation, this library uses pure pipes. To know the advantages over impure pipes, please see [here](https://angular.io/docs/ts/latest/guide/pipes.html). 

Type | Format | Syntax
---- | ------ | ------
Message | String | `expression | translate:lang`
Date | Date/Number | `expression | localedate[:defaultLocale[:format]]`
Number | Decimal | `expression | localedecimal[:defaultLocale:[digitInfo]]`
Number | Percentage | `expression | localepercent[:defaultLocale:[digitInfo]]`
Number | Currency | `expression | localecurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]`

### <a name="2.1"/>2.1 Messages
```
expression | translate:lang
```
where `expression` is a string key that indicates the message to translate.

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
expression | localedate[:defaultLocale[:format]]
```
where `expression` is a date object or a number (milliseconds since UTC epoch) and `format` indicates which date/time components to include. 
See Angular 2 [DatePipe](https://angular.io/docs/ts/latest/api/common/index/DatePipe-class.html) for further information.

For example, to get the local date, add in the template:
```Html
{{ today | localedate:defaultLocale:'fullDate' }}
```
and include in the component:
```TypeScript
import {LocaleService, LocaleDatePipe} from 'angular2localization/angular2localization';

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

#### <a name="2.2.2"/>2.2.2 Decimals
```
expression | localedecimal[:defaultLocale:[digitInfo]]
```
where `expression` is a number and `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. 
See Angular 2 [DecimalPipe](https://angular.io/docs/ts/latest/api/common/index/DecimalPipe-class.html) for further information.

For example, to get the local decimal, add in the template:
```Html
{{ pi | localedecimal:defaultLocale:'1.5-5' }}
```
and include `LocaleDecimalPipe` and `get defaultLocale()` in the component.

#### <a name="2.2.3"/>2.2.3 Percentages
```
expression | localepercent[:defaultLocale:[digitInfo]]
```
For example, to get the local percentage, add in the template:
```Html
{{ a | localepercent:defaultLocale:'1.1-1' }}
```
and include `LocalePercentPipe` and `get defaultLocale()` in the component.

#### <a name="2.2.4"/>2.2.4 Currencies
```
expression | localecurrency[:defaultLocale[:currency[:symbolDisplay[:digitInfo]]]]
```
where `symbolDisplay` is a boolean indicating whether to use the currency symbol (e.g. $) or the currency code (e.g. USD) in the output. 

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

### <a name="2.3"/>2.3 Quick use
If you want, you can avoid including `get lang()`, `get defaultLocale()` or `get currency()` by extending the `Locale` superclass in the components:
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

### <a name="2.4"/>2.4 List
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

#### <a name="2.4.1"/>2.4.1 Sorting & search
[LocalizationService](#7.2) has the following methods for sorting and filtering a list by locales:
* `sort`
* `sortAsync`
* `search`
* `searchAsync`

These methods use the [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) object, a constructor for collators, objects that enable language sensitive string comparison.

*N.B. This feature is not supported by all browsers, even with the use of `Intl.js`.*

## <a name="3"/>3 Scenarios

### <a name="3.1"/>3.1 First scenario: you need to localize dates and numbers, but no messages
Add in the route component in order to access the data of location from anywhere in the application:
```TypeScript
import {LocaleService} from 'angular2localization/angular2localization';

@Component({
    selector: 'app-component',
    ...
    providers: [LocaleService] // Inherited by all descendants.
})

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
Add in the route component in order to access the data of location from anywhere in the application:
```TypeScript
import {LocaleService, LocalizationService} from 'angular2localization/angular2localization';

@Component({
    selector: 'app-component',
    ...
    providers: [LocaleService, LocalizationService] // Inherited by all descendants.
})

export class AppComponent {

    constructor(public locale: LocaleService, public localization: LocalizationService) {

        // Adds a new language (ISO 639 two-letter or three-letter code).
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

#### <a name="3.2.1"/>3.2.1 Direct loading
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

#### <a name="3.2.2"/>3.2.2 Asynchronous loading
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
*N.B. Resource files must be saved in `UTF-8` format.*

#### <a name="3.2.3"/>3.2.3 Special characters
You can use quotes inside a string, as long as they don't match the quotes surrounding the string:
```
"It wasn't a dream."
```
Because strings must be written within quotes, use the `\` escape character to insert special characters into the values of the translations:
```
"\"What's happened to me?\" he thought."
```

#### <a name="3.2.4"/>3.2.4 Changing language
To change language at runtime, call the following method:
```TypeScript
this.locale.setCurrentLanguage(language);
```
where `language` is the two-letter or three-letter code of the new language (ISO 639).

### <a name="3.3"/>3.3 Third scenario: you need to translate messages, dates and numbers
Unlike what said for messages in the [Second scenario](#3.2), use the following code in the body of constructor of the route component:
```TypeScript
// Adds a new language (ISO 639 two-letter or three-letter code).
this.locale.addLanguage('en');
// Add a new language here.

// Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
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
* `definePreferredLocale`
* `setCurrentLocale`

When you invoke one of them, in addition to set the language and country, you can set the script, the numbering system and calendar.

## <a name="5"/>5 Lazy routing
If you use a `Router` in an extended application, you can create an instance of the `LocalizationService` for every asynchronously loaded component, as shown:
![LazyRouting](images/LazyRouting.png)
Each instance must be injected, and can be directly or asynchronously loaded, as in this example:
```TypeScript
@Component({
    ...
    providers: [LocalizationService] // Inherited by all descendants.
})

export class ListComponent {

    constructor(public localization: LocalizationService) {

        // Instantiates a new LocalizationService for this component and for its descendants.
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
<md-input validateLocaleNumber="1.2-2" [minValue]="0" [maxValue]="1000" ngControl="decimal"></md-input>
```
or, if you use variables:
```Html
<md-input [validateLocaleNumber]="digits" [minValue]="minValue" [maxValue]="maxValue" ngControl="decimal"></md-input>
```
and include in the component:
```TypeScript
import {LocaleNumberValidator} from 'angular2localization/angular2localization';

@Component({
    ...
    directives: [LocaleNumberValidator]
})
```

#### <a name="6.1.1"/>6.1.1 Parsing a number
When the number is valid, you can get its value by the `Number` static method of [LocaleParser](#7.1):
```TypeScript
parsedValue: number = null;

constructor(public locale: LocaleService) { }

onSubmit(value: string) {

    this.parsedValue = LocaleParser.Number(value, this.locale.getDefaultLocale());

}
```

#### <a name="6.1.2"/>6.1.2 FormBuilder
If you use `validateLocaleNumber` with `FormBuilder`, you have to invoke the following function:
```TypeScript
export declare function validateLocaleNumber(locale: LocaleService, digits: string, MIN_VALUE?: number, MAX_VALUE?: number): (c: Control) => {
    [key: string]: any;
};
```
For example:
```TypeScript
digits: string = "1.2-2";
minValue: number = -Math.round(Math.random() * 10000) / 100;
maxValue: number = Math.round(Math.random() * 10000) / 100;

numberForm: ControlGroup;

constructor(public locale: LocaleService, private fb: FormBuilder) {

    this.numberForm = fb.group({
        'decimal': ['', validateLocaleNumber(this.locale, this.digits, this.minValue, this.maxValue)]
    });

}
```

#### <a name="6.1.3"/>6.1.3 Full example with FormBuilder and NgFormControl
This is the view:
```Html
<md-card>
    <md-card-title>{{ 'NUMBERS' | translate:lang }}</md-card-title>
    <md-card-content>
        <form [ngFormModel]="numberForm" (ngSubmit)="onSubmit(numberForm.value)">
            <div>
                <md-input placeholder="{{ 0 | localedecimal:defaultLocale:digits }}" ref-decimal="ngForm" [ngFormControl]="numberForm.controls['decimal']"
                    [(ngModel)]="value" (keyup)="decimal.control.valid ? parsedValue : parsedValue = null" style="width: 100%"></md-input>

                <div *ngIf="decimal.control.hasError('format') && value != ''" style="color: #D32F2F;">
                    {{ 'NUMBER_IS_INVALID' | translate:lang }} {{ 0 | localedecimal:defaultLocale:digits }}
                </div>
                <div *ngIf="decimal.control.hasError('minValue') && value != ''" style="color: #D32F2F;">
                    {{ 'MIN_VALUE_ERROR' | translate:lang }} {{ minValue | localedecimal:defaultLocale:digits }}
                </div>
                <div *ngIf="decimal.control.hasError('maxValue') && value != ''" style="color: #D32F2F;">
                    {{ 'MAX_VALUE_ERROR' | translate:lang }} {{ maxValue | localedecimal:defaultLocale:digits }}
                </div>
            </div>
            <br>
            <button type="submit" [disabled]="!decimal.control.valid" md-raised-button color="primary">{{ 'SUBMIT' | translate:lang }}</button>
            <br>
            <br>
            <p>{{ 'NUMBER_VALUE' | translate:lang }} {{ parsedValue }}</p>
        </form>
    </md-card-content>
</md-card>
```
and the code of the component is the following:
```TypeScript
import {Component} from '@angular/core';
// FormBuilder with NgFormControl.
import {FormBuilder, ControlGroup} from '@angular/common';
// Angular 2 Material.
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdButton} from '@angular2-material/button';
// Services.
import {Locale, LocaleService, LocalizationService, LocaleParser} from 'angular2localization/angular2localization';
// Pipes.
import {TranslatePipe} from 'angular2localization/angular2localization';
import {LocaleDecimalPipe} from 'angular2localization/angular2localization';
// Directives for FormBuilder with NgFormControl.
import {LocaleNumberValidator, validateLocaleNumber} from 'angular2localization/angular2localization';

@Component({
    templateUrl: './app/validation.component.html',
    pipes: [TranslatePipe, LocaleDecimalPipe],
    directives: [LocaleNumberValidator, MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MdButton]
})

export class ValidationComponent extends Locale {

    value: string = "";

    // Options.
    digits: string = "1.2-2";
    minValue: number = -Math.round(Math.random() * 10000) / 100;
    maxValue: number = Math.round(Math.random() * 10000) / 100;

    parsedValue: number = null;

    // FormBuilder with NgFormControl.
    numberForm: ControlGroup;

    constructor(public locale: LocaleService, public localization: LocalizationService, private fb: FormBuilder) {
        super(locale, localization)

        this.numberForm = fb.group({
            'decimal': ['', validateLocaleNumber(this.locale, this.digits, this.minValue, this.maxValue)]
        });

    }

    onSubmit(value: any) {

        this.parsedValue = LocaleParser.Number(value.decimal, this.locale.getDefaultLocale());

    }

}
```

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

Method | Function
------ | --------
`addLanguage(language: string): void;` | Adds a new language
`definePreferredLanguage(defaultLanguage: string, expiry?: number): void;` | Defines the preferred language. Selects the current language of the browser if it has been added, else the default language
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
`languageCode: string;` | The language code for the service
`loadingMode: LoadingMode;` | The loading mode for the service
`serviceState: ServiceState;` | The service state

Method | Function
------ | --------
`addTranslation(language: string, translation: any): void;` | Direct loading: adds new translation data
`translationProvider(prefix: string): void;` | Asynchronous loading: defines the translation provider
`translate(key: string): string;` | Translates a key
`translateAsync(key: string): Observable<string>;` | Translates a key
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
