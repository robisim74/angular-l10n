# Getting the translation

To get the translation, this library uses _pure pipes_ (to know the difference between _pure_ and _impure pipes_ see [here](https://angular.io/guide/pipes#pure-and-impure-pipes)) or _directives_. 
You can also get the translation in component class.

## Pure pipes
Pipe | Type | Format | Pipe syntax
---- | ---- | ------ | -----------
Translate | Message | String | `expression | translate:lang`
L10nDate | Date | Date/Number/ISO string | `expression | l10nDate[:defaultLocale[:format[:timezone]]]`
L10nDecimal | Decimal | Number/string | `expression | l10nDecimal[:defaultLocale[:digitInfo]]`
L10nPercent | Percentage | Number/string | `expression | l10nPercent[:defaultLocale[:digitInfo]]`
L10nCurrency | Currency | Number/string | `expression | l10nCurrency[:defaultLocale[:currency[:currencyDisplay[:digitInfo]]]]`

> You can dynamically change parameters and expressions values.

### Messages
Implement _Language_ decorator in the component to provide the parameter to the _translate_ pipe:
```TypeScript
export class HomeComponent implements OnInit {

    @Language() lang: string;

    ngOnInit(): void { }

}
```

> To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

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

#### Composed keys
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

#### Parameters
```Html
{{ 'User notifications' | translate:lang:{ user: username, NoMessages: messages.length } }}
```
_Json_:
```
{
    "User notifications": "{{ user }}, you have {{ NoMessages }} new messages"
}
```

### Dates & Numbers
Implement _DefaultLocale_, _Currency_ & optionally _Timezone_ decorators in the component to provide _defaultLocale_, _currency_, _timezone_ to _l10nDate_, _l10nDecimal_, _l10nPercent_ & _l10nCurrency_ pipes.
```TypeScript
export class HomeComponent implements OnInit {

    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;
    @Timezone() timezone: string;

    ngOnInit(): void { }

}
```

> To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

#### Dates
```
expression | l10nDate[:defaultLocale[:format[:timezone]]]
```
Where:

- `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string.
- `format` indicates which date/time components to include. The format can be an alias as shown below:

    - `'short'`: equivalent to `'M/d/y, h:mm'` (e.g. `8/29/2017, 4:37 PM` for `en-US`)
    - `'medium'`: equivalent to `'MMM d, y, h:mm:ss'` (e.g. `Aug 29, 2017, 4:32:43 PM` for `en-US`)
    - `'shortDate'`: equivalent to `'M/d/y'` (e.g. `8/29/2017` for `en-US`)
    - `'mediumDate'`: equivalent to `'MMM d, y'` (e.g. `Aug 29, 2017` for `en-US`)
    - `'longDate'`: equivalent to `'MMMM d, y'` (e.g. `August 29, 2017` for `en-US`)
    - `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` (e.g. `Tuesday, August 29, 2017` for `en-US`)
    - `'shortTime'`: equivalent to `'h:mm'` (e.g. `4:53 PM` for `en-US`)
    - `'mediumTime'`: equivalent to `'h:mm:ss'` (e.g. `4:54:15 PM` for `en-US`)

    It can also be an object with some or all of the following properties:

    - `weekday` The representation of the weekday. Possible values are _narrow_, _short_, _long_.
    - `era` The representation of the era. Possible values are _narrow_, _short_, _long_.
    - `year` The representation of the year. Possible values are _numeric_, _2-digit_.
    - `month` The representation of the month. Possible values are _numeric_, _2-digit_, _narrow_, _short_, _long_.
    - `day` The representation of the day. Possible values are _numeric_, _2-digit_.
    - `hour` The representation of the hour. Possible values are _numeric_, _2-digit_.
    - `minute` The representation of the minute. Possible values are _numeric_, _2-digit_.
    - `second` The representation of the second. Possible values are _numeric_, _2-digit_.
    - `timeZoneName` The representation of the time zone name. Possible values are _short_, _long_.
    - `hour12` Whether to use 12-hour time (as opposed to 24-hour time). Possible values are true and false; the default is locale dependent.

    See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for further information.

#### Using format aliases
```Html
{{ today | l10nDate:defaultLocale:'fullDate' }}
```

#### Using a custom format
```TypeScript
@Component({
    template: `
        <p>{{ today | l10nDate:defaultLocale:options }}</p>
    `
})
export class HomeComponent implements OnInit {

    @DefaultLocale() defaultLocale: string;

    today: Date = new Date();
    options: DateTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    ngOnInit(): void { }

}
```

#### Using timezone
```TypeScript
@Component({
    template: `
        <p>{{ today | l10nDate:defaultLocale:'medium':timezone }}</p>
    `
})
export class HomeComponent implements OnInit {

    @DefaultLocale() defaultLocale: string;
    @Timezone() timezone: string;

    today: Date = new Date();

    ngOnInit(): void { }

}
```

#### Decimals
```
expression | l10nDecimal[:defaultLocale:[digitInfo]]
```
where `expression` is a number and `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`.

```Html
{{ value | l10nDecimal:defaultLocale:'1.5-5' }}
```

#### Percentages
```
expression | l10nPercent[:defaultLocale:[digitInfo]]
```
```Html
{{ value | l10nPercent:defaultLocale:'1.1-1' }}
```

#### Currencies
```
expression | l10nCurrency[:defaultLocale[:currency[:currencyDisplay[:digitInfo]]]]
```
where `currencyDisplay` is the currency formatting. Possible values are _'symbol'_ to use a localized currency symbol such as _€_, _'code'_ to use the ISO currency code, _'name'_ to use a localized currency name such as _dollar_; the default is _'symbol'_. 
```Html
{{ value | l10nCurrency:defaultLocale:currency:'symbol':'1.2-2' }}
```

### OnPush ChangeDetectionStrategy
_Pure pipes_ don't need to set `ChangeDetectionStrategy` to `OnPush`. If into your components you need to use it, you have to inject `ChangeDetectorRef`:
```TypeScript
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    ...
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    @Language() lang: string;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void { }

} 
```
That's because we need to know the component reference that implements the `OnPush` strategy.

> Note that if you use in the component only the _directives_ and not the _pipes_, you don't need to inject `ChangeDetectorRef`.

---

## Directives
Directive | Selectors
--------- | ---------
Translate | `l10nTranslate`, `translate`
L10nDate | `l10nDate`
L10nDecimal | `l10nDecimal`
L10nPercent | `l10nPercent`
L10nCurrency | `l10nCurrency`

Directive | Type | Format | Html syntax
--------- | ---- | ------ | -----------
Translate | Message | String | `<tag l10n-attribute attribute="expr1" [params]="[params]" l10nTranslate>expr2</tag>`
L10nDate | Date | Date/Number/ISO string | `<tag l10n-attribute attribute="expr1" format="[format]" l10nDate>expr2</tag>`
L10nDecimal | Decimal | Number/string | `<tag l10n-attribute attribute="expr1" digits="[digitInfo]" l10nDecimal>expr2</tag>`
L10nPercent | Percentage | Number/string | `<tag l10n-attribute attribute="expr1" digits="[digitInfo]" l10nPercent>expr2</tag>`
L10nCurrency | Currency | Number/string | `<tag l10n-attribute attribute="expr1" digits="[digitInfo]" currencyDisplay="[currencyDisplay]" l10nCurrency>expr2</tag>`

> You can dynamically change parameters and expressions values as with pipes. How does it work? To observe the expression change (not the parameters), a `MutationObserver` is used: the observer is added only if detected in the browser. If you want to use this feature also reaching older browsers, we recommend using pipes.

> If you use in the component only the directives and not the pipes, you don't need to use decorators.

### Messages
```Html
<h1 l10nTranslate>Title</h1>
```

#### Parameters
```Html
<p [params]="{ user: username, NoMessages: messages.length }" l10nTranslate>User notifications</p>
```

### Dates & Numbers
```Html
<p l10nDate>{{ today }}</p>
<p format="fullDate" l10nDate>{{ today }}</p>

<p l10nDecimal>{{ value }}</p>
<p digits="1.5-5" l10nDecimal>{{ value }}</p>

<p l10nPercent>{{ value }}</p>
<p digits="1.1-1" l10nPercent>{{ value }}</p>

<p l10nCurrency>{{ value }}</p>
<p digits="1.2-2" currencyDisplay="symbol" l10nCurrency>{{ value }}</p>
```

### Attributes
```Html
<p l10n-title title="Greeting" l10nTranslate>Title</p>
```
All attributes will be translated according to the master directive: `l10nTranslate`, `l10nDate` and so on.

> You can't dynamically change expressions in attributes.

#### Parameters
```Html
<p l10n-title title="Greeting" [params]="{ user: username, NoMessages: messages.length }" l10nTranslate>User notifications</p>
```
_Json_:
```
{
    "Greeting": "Hi {{ user }}",
    "User notifications": "{{ user }}, you have {{ NoMessages }} new messages"
}
```

### UI components
You can properly translate UI components like Angular Material or Ionic:
```Html
<a mat-list-item routerLinkActive="active-link" routerLink="/home" l10nTranslate>App.Home</a>
```
rendered as:
```Html
<a class="mat-list-item ng-star-inserted active-link" l10ntranslate="" mat-list-item="" role="listitem" routerlinkactive="active-link" href="#/home" style="">
    <div class="mat-list-item-content">
        <div class="mat-list-item-ripple mat-ripple" mat-ripple=""></div>
        <div class="mat-list-text"></div>
            Home
    </div>
</a>
```

> How does it work? The algorithm searches the text in the subtree. If there is a depth higher than 4 (in the example above the text to translate has a depth 2), we recommend using pipes.

---

## Using Html tags in translation
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

---

## Pluralization
The library implements pluralization through the official [i18nPluralPipe](https://angular.io/api/common/I18nPluralPipe). Just add to it the translate pipe:
```Html
<p>{{ messages.length | i18nPlural:messageMapping | translate:lang }}</p>
```
or the directive:
```Html
<p l10nTranslate>{{ messages.length | i18nPlural:messageMapping }}</p>
```
and enable `i18nPlural` option during the configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        ...
        i18nPlural: true
    }
};
```

---

## Getting the translation in component class
### Messages
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

### Dates & numbers
To get the translation of dates and numbers, you can use the `transform` method of the corresponding pipe to get the translation: you have the `getDefaultLocale` method of `LocaleService`, and the `defaultLocaleChanged` event to know when `defaultLocale` changes.
```TypeScript
@Component({
    ...
    template: `<p>{{ value }}</p>`
})
export class HomeComponent {
  
    pipe: L10nDecimalPipe = new L10nDecimalPipe();
    value: any = this.pipe.transform(1234.5, this.locale.getDefaultLocale(), '1.2-2');

    constructor(public locale: LocaleService) { }

    ngOnInit(): void {
        this.locale.defaultLocaleChanged.subscribe(
            (defaultLocale: string) => {
                this.value = this.pipe.transform(1234.5, defaultLocale, '1.2-2');
            }
        );
    }

}
```

---

## Handle the translation
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

---

## Changing language, default locale, currency or timezone at runtime
To change language, default locale, currency or timezone at runtime, `LocaleService` has the following methods:

* `setCurrentLanguage(languageCode: string): void`
* `setDefaultLocale(languageCode: string, countryCode?: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void`
* `setCurrentCurrency(currencyCode: string): void`
* `setCurrentTimezone(zoneName: string): void`