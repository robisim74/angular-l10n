## Angular 2 Localization - Quick start

> This quick guide is for the complete scenario, when you need to translate messages (texts), dates, numbers or currencies.
> The sample is based on [Angular QuickStart](https://github.com/angular/quickstart).

Install the library:
```Shell
npm install angular2localization --save
```
Add the library to `systemjs.config.js` file (skip this step if you don't use SystemJS):
```JavaScript
        map: {
            ...
            // other libraries
            ...
            'angular2localization': 'npm:angular2localization/bundles/angular2localization.umd.js'
        }
```
Import the modules and the components you need in `app.module.ts`:
```TypeScript
...
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

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
    declarations: [AppComponent, HomeComponent],
    ...
})

export class AppModule { }
```
Add to `app.component.ts` in order to access the data of location from anywhere in the application:
```TypeScript
import { Component } from '@angular/core';
// Services.
import { Locale, LocaleService, LocalizationService } from 'angular2localization';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{ 'TITLE' | translate:lang }}</h1>

        <h3>{{ 'CHANGE_COUNTRY' | translate:lang }}</h3>
        
        <a (click)="selectLocale('en', 'US', 'USD');">United States</a>
        <a (click)="selectLocale('en', 'GB', 'GBP');">United Kingdom</a>
        <a (click)="selectLocale('it', 'IT', 'EUR');">Italia</a>

        <home-component></home-component>
    `
})

export class AppComponent extends Locale {

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        super(locale, localization);

        // Adds the languages (ISO 639 two-letter or three-letter code).
        this.locale.addLanguages(['en', 'it']);

        // Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        // Selects the default language and country, regardless of the browser language, to avoid inconsistencies between the language and country.
        this.locale.definePreferredLocale('en', 'US', 30);

        // Optional: default currency (ISO 4217 three-letter code).
        this.locale.definePreferredCurrency('USD');

        // Initializes LocalizationService: asynchronous loading.
        this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.
        this.localization.updateTranslation(); // Need to update the translation.

    }
    
    // Sets a new locale & currency.
    selectLocale(language: string, country: string, currency: string): void {

        this.locale.setCurrentLocale(language, country);
        this.locale.setCurrentCurrency(currency);

    }

}
```
and create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in _resources_ folder:
```Json
{
    "TITLE": "Angular 2 Localization",
    "CHANGE_COUNTRY": "Change country"
}
```
```Json
{
    "TITLE": "Localizzazione in Angular 2",
    "CHANGE_COUNTRY": "Cambia Paese"
}
```
Add `home.component.ts`:
```TypeScript
import { Component } from '@angular/core';
// Services.
import { Locale, LocaleService, LocalizationService } from 'angular2localization';

@Component({
    selector: 'home-component',
    template: `
        <p>{{ today | localeDate:defaultLocale:'fullDate' }}</p>       
        <p>{{ pi | localeDecimal:defaultLocale:'1.5-5' }}</p>
        <p>{{ value | localeCurrency:defaultLocale:currency:true:'1.2-2' }}</p>
    `
})

export class HomeComponent extends Locale {

    today: number;
    pi: number;
    value: number;

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        super(locale, localization);

        this.today = Date.now();
        this.pi = 3.14159;
        this.value = Math.round(Math.random() * 1000000) / 100;

    }

}
```
Finally, to extend support for all browsers, add the following script tag in `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.en-GB,Intl.~locale.it-IT"></script>
```
For more details and other scenarios see [library specification](https://github.com/robisim74/angular2localization/blob/master/doc/spec.md).

### Appendix - Advanced initialization
If you want the app to be rendered only after the translation file is loaded, you can use these settings in `app.module.ts`:
```TypeScript
...
import { APP_INITIALIZER, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { HttpModule } from '@angular/http';
// Angular 2 Localization.
import { LocaleModule, LocalizationModule, LocaleService, LocalizationService } from 'angular2localization';

/**
 * Advanced initialization.
 * 
 * With these settings, translation file will be loaded before the app.
 */
@Injectable()
export class LocalizationConfig {

    constructor(public locale: LocaleService, public localization: LocalizationService) { }

    load(): Promise<any> {

        // Adds the languages (ISO 639 two-letter or three-letter code).
        this.locale.addLanguages(['en', 'it']);

        // Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        // Selects the default language and country, regardless of the browser language, to avoid inconsistencies between the language and country.
        this.locale.definePreferredLocale('en', 'US', 30);

        // Optional: default currency (ISO 4217 three-letter code).
        this.locale.definePreferredCurrency('USD');

        // Initializes LocalizationService: asynchronous loading.
        this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.

        var promise: Promise<any> = new Promise((resolve: any) => {
            this.localization.translationChanged.subscribe(() => {
                resolve(true);
            });
        });

        this.localization.updateTranslation(); // Need to update the translation.

        return promise;
    }
}

/**
 * Aot compilation requires a reference to an exported function.
 */
export function initLocalization(localizationConfig: LocalizationConfig): Function {
    return () => localizationConfig.load();
}

@NgModule({
    imports: [
        ...
        HttpModule,
        LocaleModule.forRoot(), // New instance of LocaleService.
        LocalizationModule.forRoot() // New instance of LocalizationService.
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [
        LocalizationConfig,
        {
            provide: APP_INITIALIZER, // APP_INITIALIZER will execute the function when the app is initialized and delay what it provides.
            useFactory: initLocalization,
            deps: [LocalizationConfig],
            multi: true
        }
    ],
    ...
})

export class AppModule { }
```
So `app.component.ts` becomes:
```TypeScript
import { Component } from '@angular/core';
// Services.
import { Locale, LocaleService, LocalizationService } from 'angular2localization';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{ 'TITLE' | translate:lang }}</h1>

        <h3>{{ 'CHANGE_COUNTRY' | translate:lang }}</h3>
        
        <a (click)="selectLocale('en', 'US', 'USD');">United States</a>
        <a (click)="selectLocale('en', 'GB', 'GBP');">United Kingdom</a>
        <a (click)="selectLocale('it', 'IT', 'EUR');">Italia</a>

        <home-component></home-component>
    `
})

export class AppComponent extends Locale {

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        super(locale, localization);
    }
    
    // Sets a new locale & currency.
    selectLocale(language: string, country: string, currency: string): void {

        this.locale.setCurrentLocale(language, country);
        this.locale.setCurrentCurrency(currency);

    }

}
```
See also the [sample app](https://github.com/robisim74/angular2localization/tree/gh-pages).
