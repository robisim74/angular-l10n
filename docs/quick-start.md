# Quick start

## First scenario: you only need to translate texts
Install the library:
```Shell
npm install angular-l10n --save
```
Import the modules you need and configure the library in `app.module.ts`:
```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

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
    selector: 'app-root',
    template: `
        <h1>{{ title }}</h1>

        <h3>{{ 'Change language' | translate:lang }}</h3>
        
        <button (click)="selectLanguage('en');">English</button>
        <button (click)="selectLanguage('it');">Italiano</button>

        <app-home></app-home>
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
    selector: 'app-home',
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
> To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

Create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in `src/assets` folder:
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

### Using directives
In addition to the _pipes_, you can use _directives_. Try to change `home.component.ts`:
```TypeScript
import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
        <p l10nTranslate>Greeting</p>

        <p l10n-title title="Greeting" l10nTranslate>Subtitle</p>
    `
})
export class HomeComponent { }
```
> Note that if you use in the component only the _directives_ and not the _pipes_, you don't need to use `@Language()` _decorator_.

---

## Second scenario: you need to translate texts, dates & numbers
Install the library:
```Shell
npm install angular-l10n --save
```
Import the modules you need and configure the library in `app.module.ts`:
```TypeScript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

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
    selector: 'app-root',
    template: `
        <h1>{{ title }}</h1>

        <h3>{{ 'Change country' | translate:lang }}</h3>
        
        <button (click)="selectLocale('en', 'US', 'USD');">United States</button>
        <button (click)="selectLocale('en', 'GB', 'GBP');">United Kingdom</button>
        <button (click)="selectLocale('it', 'IT', 'EUR');">Italia</button>

        <app-home></app-home>
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
Add `home.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

import { Language, DefaultLocale, Currency } from 'angular-l10n';

@Component({
    selector: 'app-home',
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
> To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

Create the _json_ files of the translations such as `locale-en.json` and `locale-it.json` in `src/assets` folder:
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

Finally, to extend the support to old browsers, add the following script tag in `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US,Intl.~locale.en-GB,Intl.~locale.it-IT"></script>
```

### Using directives
In addition to the _pipes_, you can use _directives_. Try to change `home.component.ts`:
```TypeScript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
        <p l10nTranslate>Greeting</p>

        <p l10n-title title="Greeting" l10nTranslate>Subtitle</p>

        <p format="fullDate" l10nDate>{{ today }}</p>    
        <p digits="1.5-5" l10nDecimal>{{ pi }}</p>
        <p digits="1.2-2" currencyDisplay="symbol" l10nCurrency>{{ value }}</p>

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
> Note that if you use in the component only the _directives_ and not the _pipes_, you don't need to use _decorators_.

---

## Advanced initialization
If you want the app to be rendered only after the translation file is loaded, 
you can use these settings in `app.module.ts`:
```TypeScript
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

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

---

## Appendix A - Using Angular CLI
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

---

## Appendix B - Using Ionic
You have to add the _json_ files in `www/assets` folder. 
Always configure your provider in this way:
```TypeScript
...
    providers: [
        { type: ProviderType.Static, prefix: './assets/locale-' }
    ],
...
```

---

## Appendix C - Using Angular Meteor
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

---

## Appendix D - Using Angular Universal
There are two ways:

### Prerender (prerender)
- Happens at build time.
- Renders your application and replaces the dist _index.html_ with a version rendered at the route `/`.

### Server-Side Rendering (ssr)
- Happens at runtime.
- Uses a server _Engine_ to render you application on the fly at the requested url.

**Note**

- This library builds only one app, and not an app for each language as _Angular i18n_ native solution: so your prerendered `index.html` will contain the translation according to the language defined during the configuration.
- If you use _Direct loading_, there are no particular warnings.
- If you use _Asynchronous loading_, you have to solve the problem of _http requests_ during _prerender_ or _ssr_:
    - About _prerender_: you need to provide _absolute URLs_ to a running server that will be the same that will serve the data (or through a proxy): if this is not possible and you want to use the _prerender_ instead of _ssr_, you should use _Angular i18n_ native solution.
    - About _ssr_: you only need to use _absolute URLs_, so for example:

```TypeScript
...
providers: [
    { type: ProviderType.Static, prefix: 'http:localhost:4000/assets/locale-' }
],
...
```

> Please note that problems with _http requests_ are not due to this library, but to common questions about _http requests_ in _Universal_ apps.

The following is an example that uses _Asynchronous loading_, based on _Angular Universal Starter_:

`app.module.ts`:
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
        providers: [],
        caching: true
    }
};

@Injectable() export class LocalizationConfig {

    constructor(
        public l10nLoader: L10nLoader,
        @Inject(TRANSLATION_CONFIG) private translationConfig: TranslationConfig,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    load(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            // Client only code.
            this.translationConfig.providers = [
                { type: ProviderType.Static, prefix: './assets/locale-' }
            ];
        }
        if (isPlatformServer(this.platformId)) {
            // Server only code.
            this.translationConfig.providers = [
                { type: ProviderType.Static, prefix: 'http://localhost:4000/assets/locale-' }
            ];
        }

        return this.l10nLoader.load();
    }

}

export function initLocalization(localizationConfig: LocalizationConfig): Function {
    return () => localizationConfig.load();
}

@NgModule({
    ...
    imports: [
        ...
        HttpClientModule,
        LocalizationModule.forRoot(l10nConfig)
    ],
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

Now, depending on whether you want to use the _prerender_ or _ssr_ in production, you must proceed as follows:

**prerender**
```Shell
npm run build:ssr
npm run serve:ssr
```
The server is ready, so you can generate the pre-built files. Open a _new terminal_ and type:
```Shell
npm run generate:prerender
```
If you see in the _dist/browser_ folder, your _html_ files should have the translated values (in the default language).
To test it:
```Shell
npm run serve:prerender
```

**ssr**
```Shell
npm run build:ssr
npm run serve:ssr
```
