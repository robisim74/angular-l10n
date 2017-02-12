## Angular localization - Quick start
> The samples are based on [Angular QuickStart](https://github.com/angular/quickstart).

* [1 First scenario: you only need to translate texts](#1)
* [2 Second scenario: you need to translate texts, dates & numbers](#2)
* [3 Advanced initialization](#3)
* [Appendix A - Using Angular-CLI](#Appendix A)
* [Appendix B - Using Ionic 2](#Appendix B)
* [Appendix C - Using Angular 2 Meteor](#Appendix C)

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
        'angular-l10n': 'node_modules/angular-l10n/bundles/angular-l10n.umd.js'
    },
    ...
});
```
Import the modules and the components you need in `app.module.ts`:
```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { TranslationModule } from 'angular-l10n';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        TranslationModule.forRoot()
    ],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
Add to `app.component.ts` the initialization of the services:
```TypeScript
import { Component } from '@angular/core';

import { Translation, LocaleService, TranslationService } from 'angular-l10n';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{ 'Title' | translate:lang }}</h1>

        <h3>{{ 'Change language' | translate:lang }}</h3>
        
        <button (click)="selectLanguage('en');">English</button>
        <button (click)="selectLanguage('it');">Italiano</button>

        <home-component></home-component>
    `
})
export class AppComponent extends Translation {

    constructor(public locale: LocaleService, public translation: TranslationService) {
        super(translation);

        this.locale.AddConfiguration()
            .AddLanguages(['en', 'it'])
            .SetCookieExpiration(30)
            .DefineLanguage('en');
        this.locale.init();

        this.translation.AddConfiguration()
            .AddProvider('./assets/locale-');
        this.translation.init();
    }

    selectLanguage(language: string): void {
        this.locale.setCurrentLanguage(language);
    }

}

```
Add `home.component.ts`:
```TypeScript
import { Component } from '@angular/core';

import { Translation, TranslationService } from 'angular-l10n';

@Component({
    selector: 'home-component',
    template: `
        <p>{{ 'Greeting' | translate:lang }}</p>
    `
})
export class HomeComponent extends Translation {

    constructor(public translation: TranslationService) {
        super(translation);
    }

}
```
and create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in `assets` folder:
```Json
{
    "Title": "Angular localization",
    "Change language": "Change language",
    "Greeting": "Hi!"
}
```
```Json
{
    "Title": "Localizzazione in Angular",
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
        <p translate>Greeting</p>
    `
})
export class HomeComponent { }
```
Note that if you use in the component only the _directives_ and not the _pipes_, 
you don't need to import the services and extend `Translation` class. 

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
        'angular-l10n': 'node_modules/angular-l10n/bundles/angular-l10n.umd.js'
    },
    ...
});
```
Import the modules and the components you need in `app.module.ts`:
```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { LocalizationModule } from 'angular-l10n';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        LocalizationModule.forRoot()
    ],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
Add to `app.component.ts` the initialization of the services:
```TypeScript
import { Component } from '@angular/core';

import { Localization, LocaleService, TranslationService } from 'angular-l10n';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{ 'Title' | translate:lang }}</h1>

        <h3>{{ 'Change country' | translate:lang }}</h3>
        
        <button (click)="selectLocale('en', 'US', 'USD');">United States</button>
        <button (click)="selectLocale('en', 'GB', 'GBP');">United Kingdom</button>
        <button (click)="selectLocale('it', 'IT', 'EUR');">Italia</button>

        <home-component></home-component>
    `
})
export class AppComponent extends Localization {

    constructor(public locale: LocaleService, public translation: TranslationService) {
        super(locale, translation);

        this.locale.AddConfiguration()
            .AddLanguages(['en', 'it'])
            .SetCookieExpiration(30)
            .DefineDefaultLocale('en', 'US')
            .DefineCurrency('USD');
        this.locale.init();

        this.translation.AddConfiguration()
            .AddProvider('./assets/locale-');
        this.translation.init();
    }

    selectLocale(language: string, country: string, currency: string): void {
        this.locale.setDefaultLocale(language, country);
        this.locale.setCurrentCurrency(currency);
    }

}
```
and create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in `assets` folder:
```Json
{
    "Title": "Angular localization",
    "Change country": "Change country"
}
```
```Json
{
    "Title": "Localizzazione in Angular",
    "Change country": "Cambia Paese"
}
```
Add `home.component.ts`:
```TypeScript
import { Component } from '@angular/core';

import { Localization, LocaleService, TranslationService } from 'angular-l10n';

@Component({
    selector: 'home-component',
    template: `
        <p>{{ today | localeDate:defaultLocale:'fullDate' }}</p>       
        <p>{{ pi | localeDecimal:defaultLocale:'1.5-5' }}</p>
        <p>{{ value | localeCurrency:defaultLocale:currency:true:'1.2-2' }}</p>
    `
})
export class HomeComponent extends Localization {

    today: number;
    pi: number;
    value: number;

    constructor(public locale: LocaleService, public translation: TranslationService) {
        super(locale, translation);

        this.today = Date.now();
        this.pi = 3.14159;
        this.value = Math.round(Math.random() * 1000000) / 100;
    }

}
```
Finally, to extend the support to all browsers, add the following script tag in `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.en-GB,Intl.~locale.it-IT"></script>
```
#### Using directives
In addition to the _pipes_, you can use _directives_. Try to change in `app.component.ts`:
```Html
<h1>{{ 'TITLE' | translate:lang }}</h1>
```
into:
```Html
<h1 translate>Title</h1>
```
Then change `home.component.ts`:
```TypeScript
import { Component } from '@angular/core';

@Component({
    selector: 'home-component',
    template: `
        <p localeDate="fullDate">{{ today }}</p>    
        <p localeDecimal="1.5-5">{{ pi }}</p>
        <p localeCurrency="1.2-2" [symbol]="true">{{ value }}</p>
    `
})
export class HomeComponent {

    today: number;
    pi: number;
    value: number;

    constructor() {
        this.today = Date.now();
        this.pi = 3.14159;
        this.value = Math.round(Math.random() * 1000000) / 100;
    }

}
```
Note that if you use in the component only the _directives_ and not the _pipes_, 
you don't need to import the services and extend `Localization` class. 

For more details, see [library specification](https://github.com/robisim74/angular-l10n/blob/master/doc/spec.md).

## <a name="3"/>3 Advanced initialization
If you want the app to be rendered only after the translation file is loaded, 
you can use these settings in `app.module.ts`:
```TypeScript
import { NgModule, APP_INITIALIZER, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { TranslationModule, LocaleService, TranslationService } from 'angular-l10n';

@Injectable()
export class LocalizationConfig {

    constructor(public locale: LocaleService, public translation: TranslationService) { }

    load(): Promise<any> {
        this.locale.AddConfiguration()
            .AddLanguages(['en', 'it'])
            .SetCookieExpiration(30)
            .DefineLanguage('en');
        this.locale.init();

        this.translation.AddConfiguration()
            .AddProvider('./assets/locale-');

        let promise: Promise<any> = new Promise((resolve: any) => {
            this.translation.translationChanged.subscribe(() => {
                resolve(true);
            });
        });

        this.translation.init();

        return promise;
    }

}

// AoT compilation requires a reference to an exported function.
export function initLocalization(localizationConfig: LocalizationConfig): Function {
    return () => localizationConfig.load();
}

// APP_INITIALIZER will execute the function when the app is initialized and delay what it provides.
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        TranslationModule.forRoot()
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [
        LocalizationConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: initLocalization,
            deps: [LocalizationConfig],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
See also the [sample app](https://github.com/robisim74/angular-l10n-sample).

## <a name="Appendix A"/>Appendix A - Using Angular-CLI
If you are using _Angular-CLI_, you have to add the _json_ files in `src/assets` folder, 
copied as-is when building your project. 
Always configure your provider in this way:
```TypeScript
this.translation.AddConfiguration()
    .AddProvider('./assets/locale-');
```

## <a name="Appendix B"/>Appendix B - Using Ionic 2
You have to add the _json_ files in `www/assets` folder. 
Always configure your provider in this way:
```TypeScript
this.translation.AddConfiguration()
    .AddProvider('./assets/locale-');
```

## <a name="Appendix C"/>Appendix C - Using Angular 2 Meteor
You must create `public/assets` folder at the root of your app. 
In this way, `assets` folder is copied directly into your application bundle. 
Always configure your provider in this way:
```TypeScript
this.translation.AddConfiguration()
    .AddProvider('./assets/locale-');
```

