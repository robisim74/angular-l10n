# Angular localization - Quick start
> The samples are based on [Angular QuickStart](https://github.com/angular/quickstart).

* [1 First scenario: you only need to translate texts](#1)
* [2 Second scenario: you need to translate texts, dates & numbers](#2)
* [3 Advanced initialization](#3)
* [Appendix A - Using Angular CLI](#AppendixA)
* [Appendix B - Using Ionic](#AppendixB)
* [Appendix C - Using Angular Meteor](#AppendixC)

## <a name="1"/>1 First scenario: you only need to translate texts
Install the library:
```Shell
npm install angular-l10n --save
```
Add the library to `systemjs.config.js` file (skip this step if you don't use _SystemJS_):
```JavaScript
System.config({
    ...
    map: {
        ...
        'angular-l10n': 'npm:angular-l10n/bundles/angular-l10n.umd.js'
    },
    ...
});
```
Import the modules you need and configure the library in `app.module.ts`:
```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';

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
Add to `app.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

import { LocaleService, TranslationService, Language } from 'angular-l10n';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{ title }}</h1>

        <h3>{{ 'Change language' | translate:lang }}</h3>
        
        <button (click)="selectLanguage('en');">English</button>
        <button (click)="selectLanguage('it');">Italiano</button>

        <home-component></home-component>
    `
})
export class AppComponent implements OnInit {

    @Language() lang: string;
    
    title: string;

    constructor(public locale: LocaleService, public translation: TranslationService) { }

    ngOnInit(): void {
        this.translation.translationChanged().subscribe(
            () => { this.title = this.translation.translate('Title'); }
        );
    }

    selectLanguage(language: string): void {
        this.locale.setCurrentLanguage(language);
    }

}
```
Add `home.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

import { Language } from 'angular-l10n';

@Component({
    selector: 'home-component',
    template: `
        <p>{{ 'Greeting' | translate:lang }}</p>

        <p title="{{ 'Greeting' | translate:lang }}">{{ 'Subtitle' | translate:lang }}</p>
    `
})
export class HomeComponent implements OnInit {

    @Language() lang: string;

    ngOnInit(): void { }

}
```
and create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in `src/assets` folder:
```Json
{
    "Title": "Angular localization",
    "Subtitle": "It's a small world",
    "Change language": "Change language",
    "Greeting": "Hi!"
}
```
```Json
{
    "Title": "Localizzazione in Angular",
    "Subtitle": "Il mondo è piccolo",
    "Change language": "Cambia lingua",
    "Greeting": "Ciao!"
}
```
#### Using directives
In addition to the _pipes_, you can use _directives_. Try to change `home.component.ts`:
```TypeScript
import { Component } from '@angular/core';

@Component({
    selector: 'home-component',
    template: `
        <p l10nTranslate>Greeting</p>

        <p l10n-title title="Greeting" l10nTranslate>Subtitle</p>
    `
})
export class HomeComponent { }
```
Note that if you use in the component only the _directives_ and not the _pipes_, 
you don't need to use `@Language()` _decorator_. 

For more details, see [library specification](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md).

## <a name="2"/>2 Second scenario: you need to translate texts, dates & numbers
Install the library:
```Shell
npm install angular-l10n --save
```
Add the library to `systemjs.config.js` file (skip this step if you don't use _SystemJS_):
```JavaScript
System.config({
    ...
    map: {
        ...
        'angular-l10n': 'npm:angular-l10n/bundles/angular-l10n.umd.js'
    },
    ...
});
```
Import the modules you need and configure the library in `app.module.ts`:
```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { L10nConfig, L10nLoader, LocalizationModule, StorageStrategy, ProviderType } from 'angular-l10n';

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
Add to `app.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

import { LocaleService, TranslationService, Language } from 'angular-l10n';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{ title }}</h1>

        <h3>{{ 'Change country' | translate:lang }}</h3>
        
        <button (click)="selectLocale('en', 'US', 'USD');">United States</button>
        <button (click)="selectLocale('en', 'GB', 'GBP');">United Kingdom</button>
        <button (click)="selectLocale('it', 'IT', 'EUR');">Italia</button>

        <home-component></home-component>
    `
})
export class AppComponent implements OnInit {

    @Language() lang: string;
    
    title: string;

    constructor(public locale: LocaleService, public translation: TranslationService) { }

    ngOnInit(): void {
        this.translation.translationChanged().subscribe(
            () => { this.title = this.translation.translate('Title'); }
        );
    }

    selectLocale(language: string, country: string, currency: string): void {
        this.locale.setDefaultLocale(language, country);
        this.locale.setCurrentCurrency(currency);
    }

}
```
and create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in `src/assets` folder:
```Json
{
    "Title": "Angular localization",
    "Subtitle": "It's a small world",
    "Change country": "Change country",
    "Greeting": "Hi!",
    "Change": "Change"
}
```
```Json
{
    "Title": "Localizzazione in Angular",
    "Subtitle": "Il mondo è piccolo",
    "Change country": "Cambia Paese",
    "Greeting": "Ciao!",
    "Change": "Cambia"
}
```
Add `home.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

import { Language, DefaultLocale, Currency } from 'angular-l10n';

@Component({
    selector: 'home-component',
    template: `
        <p>{{ 'Greeting' | translate:lang }}</p>

        <p title="{{ 'Greeting' | translate:lang }}">{{ 'Subtitle' | translate:lang }}</p>

        <p>{{ today | l10nDate:defaultLocale:'fullDate' }}</p>       
        <p>{{ pi | l10nDecimal:defaultLocale:'1.5-5' }}</p>
        <p>{{ value | l10nCurrency:defaultLocale:currency:'symbol':'1.2-2' }}</p>

        <button (click)="change()">{{ 'Change' | translate:lang }}</button>
    `
})
export class HomeComponent implements OnInit {

    @Language() lang: string;
    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;

    today: number;
    pi: number;
    value: number;

    ngOnInit(): void {
        this.today = Date.now();
        this.pi = 3.14159;
        this.value = Math.round(Math.random() * 1000000) / 100;
    }

    change(): void {
        this.value = Math.round(Math.random() * 1000000) / 100;
    }

}
```
Finally, to extend the support to old browsers, add the following script tag in `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.en-GB,Intl.~locale.it-IT"></script>
```
#### Using directives
In addition to the _pipes_, you can use _directives_. Try to change `home.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home-component',
    template: `
        <p l10nTranslate>Greeting</p>

        <p l10n-title title="Greeting" l10nTranslate>Subtitle</p>

        <p l10nDate="fullDate">{{ today }}</p>    
        <p l10nDecimal="1.5-5">{{ pi }}</p>
        <p l10nCurrency="1.2-2" [currencyDisplay]="'symbol'">{{ value }}</p>

        <button (click)="change()" l10nTranslate>Change</button>
    `
})
export class HomeComponent implements OnInit {

    today: number;
    pi: number;
    value: number;

    ngOnInit(): void {
        this.today = Date.now();
        this.pi = 3.14159;
        this.value = Math.round(Math.random() * 1000000) / 100;
    }

    change(): void {
        this.value = Math.round(Math.random() * 1000000) / 100;
    }

}
```
Note that if you use in the component only the _directives_ and not the _pipes_, 
you don't need to use _decorators_. 

For more details, see [library specification](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md).

## <a name="3"/>3 Advanced initialization
If you want the app to be rendered only after the translation file is loaded, 
you can use these settings in `app.module.ts`:
```TypeScript
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';

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

// Advanced initialization.
export function initL10n(l10nLoader: L10nLoader): Function {
    return () => l10nLoader.load();
}

// APP_INITIALIZER will execute the function when the app is initialized and delay what it provides.
@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig)
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initL10n,
            deps: [L10nLoader],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
See also the [sample app](https://github.com/robisim74/angular-l10n-sample).

## <a name="AppendixA"/>Appendix A - Using Angular CLI
If you are using _Angular CLI_, you have to add the _json_ files in `src/assets` folder, 
copied as-is when building your project. 
Always configure your provider in this way:
```TypeScript
...
    providers: [
        { type: ProviderType.Static, prefix: './assets/locale-' }
    ],
...
```

## <a name="AppendixB"/>Appendix B - Using Ionic
You have to add the _json_ files in `www/assets` folder. 
Always configure your provider in this way:
```TypeScript
...
    providers: [
        { type: ProviderType.Static, prefix: './assets/locale-' }
    ],
...
```

## <a name="AppendixC"/>Appendix C - Using Angular Meteor
You must create `public/assets` folder at the root of your app. 
In this way, `assets` folder is copied directly into your application bundle. 
Always configure your provider in this way:
```TypeScript
...
    providers: [
        { type: ProviderType.Static, prefix: './assets/locale-' }
    ],
...
```
