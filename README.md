# Angular l10n
![Node.js CI](https://github.com/robisim74/angular-l10n/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n) [![npm](https://img.shields.io/npm/dm/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n) [![npm](https://img.shields.io/npm/l/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n)
> An Angular library to translate texts, dates and numbers

This library is for localization of **Angular** apps. It allows, in addition to translation, to format dates and numbers through [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)


## Documentation
[Angular l10n Specification](https://robisim74.github.io/angular-l10n/)


## Architecture
![Architecture](images/architecture.png)


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Types](#types)
- [Intl API](#intl-api)
- [Server Side Rendering](#server-side-rendering)
- [Previous versions](#previous-versions)
- [Contributing](#contributing)
- [License](#license)


## Installation
```Shell
npm install angular-l10n --save 
```


## Usage
You can find a complete sample app [here](projects/angular-l10n-app), and a [live example](https://stackblitz.com/edit/angular-l10n) on StackBlitz.

### Configuration
Create the configuration:
```TypeScript
export const l10nConfig: L10nConfig = {
    format: 'language-region',
    providers: [
        { name: 'app', asset: i18nAsset }
    ],
    cache: true,
    keySeparator: '.',
    defaultLocale: { language: 'en-US', currency: 'USD' },
    schema: [
        { locale: { language: 'en-US', currency: 'USD' }, dir: 'ltr', text: 'United States' },
        { locale: { language: 'it-IT', currency: 'EUR' }, dir: 'ltr', text: 'Italia' }
    ]
};

export function initL10n(l10nLoader: L10nLoader): () => Promise<void> {
    return () => l10nLoader.init();
}

const i18nAsset = {
    'en-US': {
        greeting: 'Hello world!',
        whoIAm: 'I am {{name}}',
        one: 'software developer'
    },
    'it-IT': {
        greeting: 'Ciao mondo!',
        whoIAm: 'Sono {{name}}',
        one: 'sviluppatore software'
    }
};
```

> Do you only need to localize and not translate? Give the `providers` an empty array, but provide the supported locales in the `schema` anyway

Import the modules and the configuration:
```TypeScript
@NgModule({
    ...
    imports: [
        ...
        L10nTranslationModule.forRoot(l10nConfig),
        L10nIntlModule
    ],
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

### Getting the translation
#### Pure Pipes
```Html
<p title="{{ 'greeting' | translate:locale.language }}">{{ 'greeting' | translate:locale.language }}</p>
<p>{{ 'whoIAm' | translate:locale.language:{ name: 'Angular l10n' } }}</p>

<p>{{ today | l10nDate:locale.language:{ dateStyle: 'full', timeStyle: 'short' } }}</p>
<p>{{ timeAgo | l10nTimeAgo:locale.language:'second':{ numeric:'always', style:'long' } }}</p>

<p>{{ value | l10nNumber:locale.language:{ digits: '1.2-2', style: 'currency' } }}</p>

<p>1 {{ 1 | l10nPlural:locale.language }}</p>

<button *ngFor="let item of schema"
    (click)="setLocale(item.locale)">{{ item.locale.language | l10nDisplayNames:locale.language:{ type: 'language' } }}</button>
```
Pure pipes need to know when the _locale_ changes. So import `L10nLocale` injection token in the component:
```TypeScript
export class AppComponent {

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }

}
```
##### OnPush Change Detection Strategy
To support this strategy, there is an async version of each pipe:
```Html
<p>{{ 'greeting' | translateAsync }}</p>
```
#### Directives
```Html
<p l10n-title title="greeting" l10nTranslate>greeting</p>
<p [params]="{ name: 'Angular l10n' }" l10nTranslate>whoIAm</p>
<!-- <p [l10nTranslate]="{ name: 'Angular l10n' }">whoIAm</p> -->

<p [options]="{ dateStyle: 'full', timeStyle: 'short' }" l10nDate>{{ today }}</p>
<p [options]="{ numeric:'always', style:'long' }" unit="second" l10nTimeAgo>{{ timeAgo }}</p>

<p [options]="{ digits: '1.2-2', style: 'currency' }" l10nNumber>{{ value }}</p>
```

You can dynamically change parameters and expressions values as with pipes, but not in attributes.

#### APIs
```TypeScript
export class AppComponent implements OnInit {

    constructor(private translation: L10nTranslationService, private intl: L10nIntlService) { }

    ngOnInit() {
        this.translation.onChange().subscribe({
            next: () => {
                this.greeting = this.translation.translate('greeting');
                this.whoIAm = this.translation.translate('whoIAm', { name: 'Angular l10n' });

                this.formattedToday = this.intl.formatDate(this.today, { dateStyle: 'full', timeStyle: 'short' });
                this.formattedTimeAgo = this.intl.formatRelativeTime(this.timeAgo, 'second', { numeric: 'always', style: 'long' });
                this.formattedValue = this.intl.formatNumber(this.value, { digits: '1.2-2', style: 'currency' });
                this.formattedOnePlural = this.intl.plural(1);
            }
        });
    }

}
```
The `L10nIntlService` also provides methods for other Intl APIs, such as _Collator_ & _ListFormat_.

### Customize the library
The following features can be customized. You just have to implement the indicated class-interface and pass the token during configuration.

E.g.
```TypeScript
@Injectable() export class HttpTranslationLoader implements L10nTranslationLoader {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(@Optional() private http: HttpClient) { }

    public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
        const url = `${provider.asset}-${language}.json`;
        const options = {
            headers: this.headers,
            params: new HttpParams().set('v', provider.options.version)
        };
        return this.http.get(url, options);
    }

}

export const l10nConfig: L10nConfig = {
    ...
    providers: [
        { name: 'app', asset: './assets/i18n/app', options: { version: '1.0.0' } },
    ],
    ...
};

@NgModule({
    ...
    imports: [
        ...
        L10nTranslationModule.forRoot(
            l10nConfig,
            {
                translationLoader: HttpTranslationLoader
            }
        )
    ],
    ...
})
export class AppModule { }
```
#### Storage
By default, the library does not store the _locale_. To store it implement the `L10nStorage` class-interface using what you need, such as web storage or cookie, so that the next time the user has the _locale_ he selected.
#### User Language
By default, the library attempts to set the _locale_ using the user's browser language, before falling back on the _default locale_. You can change this behavior by implementing the `L10nUserLanguage` class-interface, for example to get the language via server.
#### Translation Loader
By default, you can only pass JavaScript objects as translation data provider. To implement a different loader, you can implement the `L10nTranslationLoader` class-interface, as in the example above.
#### Translation Fallback
You can enable translation fallback during configuration:
```TypeScript
export const l10nConfig: L10nConfig = {
    ...
    fallback: true,
    ...
};
```
By default, the translation data will be merged in the following order:
- `'language'`
- `'language[-script]'`
- `'language[-script][-region]'`

To change it, implement the `L10nTranslationFallback` class-interface.
#### Translation Handler
By default, the library only parse the _params_. `L10nTranslationHandler` is the class-interface to implement to modify the behavior.
#### Missing Translation Handler
If a key is not found, the same key is returned. To return a different value, you can implement the `L10nMissingTranslationHandler` class-interface.

### Validation
There are two directives, that you can use with Template driven or Reactive forms: `l10nValidateNumber` and `l10nValidateDate`. To use them, you have to implement the `L10nValidation` class-interface, and import it with the validation module:
```TypeScript
@Injectable() export class LocaleValidation implements L10nValidation {

    constructor(@Inject(L10N_LOCALE) private locale: L10nLocale) { }

    public parseNumber(value: string, options?: L10nNumberFormatOptions, language = this.locale.numberLanguage || this.locale.language): number | null {
        ...
    }

    public parseDate(value: string, options?: L10nDateTimeFormatOptions, language = this.locale.dateLanguage || this.locale.language): Date | null {
        ...
    }

}

@NgModule({
    ...
    imports: [
        ...
        L10nValidationModule.forRoot({ validation: LocaleValidation })
    ],
    ...
})
export class AppModule { }
```

### Routing
You can enable the localized routing importing the routing module after others:
```TypeScript
@NgModule({
    ...
    imports: [
        ...
        L10nRoutingModule.forRoot()
    ],
    ...
})
export class AppModule { }
```
A prefix containing the language is added to the path of each navigation, creating a semantic URL:
```
baseHref/[language][-script][-region]/path

https://example.com/en/home
https://example.com/en-US/home
```
If the localized link is called, the _locale_ is also set automatically.

To achieve this, the router configuration in your app is not rewritten: the URL is replaced, in order to provide the different localized contents both to the crawlers and to the users that can refer to the localized links.

If you don't want a localized routing for _default locale_, you can enable it during the configuration:
```TypeScript
export const l10nConfig: L10nConfig = {
    ...
    defaultRouting: true
};
```

You can change the localized path, implementing the `L10nLocation` class-interface, and import it with the routing module:
```TypeScript
@Injectable() export class AppLocation implements L10nLocation {

    public path(): string {
        ...
    }

    public parsePath(path: string): string | null {
        ...
    }

    public getLocalizedSegment(path: string): string | null {
        ...
    }

    public toLocalizedPath(language: string, path: string): string {
        ...
    }

}

@NgModule({
    ...
    imports: [
        ...
        L10nRoutingModule.forRoot({ location: AppLocation })
    ],
    ...
})
export class AppModule { }
```

### Lazy loading
If you want to add new providers to a lazy loaded module, you can use `L10nResolver` in your routing module:
```TypeScript
const routes: Routes = [
    ...
    {
        path: 'lazy',
        loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
        resolve: { l10n: L10nResolver },
        data: {
            l10nProviders: [{ name: 'lazy', asset: './assets/i18n/lazy', options: { version: '1.0.0' } }]
        }
    }
];
```
Always import the modules you need:
```TypeScript
@NgModule({
    declarations: [LazyComponent],
    imports: [
        ...
        L10nTranslationModule
    ]
})
export class LazyModule { }
```
#### Add providers dynamically
In general, you can add translation providers dynamically by updating the configuration and calling the `loadTranslation` method:
```TypeScript
const i18nLazyAsset = { 'en-US': {...}, 'it-IT': {...} };

this.translation.addProviders([{ name: 'lazy', asset: i18nLazyAsset}]);
this.translation.loadTranslation([{ name: 'lazy', asset: i18nLazyAsset}]);
```

### Caching
Enable caching during configuration if you want to prevent reloading of the already loaded translation data:
```TypeScript
export const l10nConfig: L10nConfig = {
    ...
    cache: true
};
```

### Preloading data
If you need to preload some translation data, for example to use for missing values, `L10nTranslationService` exposes the translation data in the `data` attribute. You can merge data by calling the `addData` method:

```TypeScript
export function l10nPreload(translation: L10nTranslationService, translationLoader: L10nTranslationLoader): () => Promise<void> {
    return () => new Promise((resolve) => {
        translationLoader.get('en-US', { name: 'app', asset: './assets/i18n/app', options: { version: '1.0.0' } })
            .subscribe({
                next: (data) => translation.addData(data, 'en-US'),
                complete: () => resolve()
            });
    });
}
```
Then add the function to providers, before `initL10n`:
```TypeScript
providers: [
    {
        provide: APP_INITIALIZER,
        useFactory: l10nPreload,
        deps: [L10nTranslationService, L10nTranslationLoader],
        multi: true
    },
    ...
],
```


## Types
Angular l10n types that it is useful to know:
- `L10nLocale`: contains a _language_, in the format `language[-script][-region][-extension]`, where:
     - language: ISO 639 two-letter or three-letter code
     - script: ISO 15924 four-letter script code
     - region: ISO 3166 two-letter, uppercase code
     - extension: 'u' (Unicode) extensions
     
     Optionally:
     - _dateLanguage_: alternative language to translate dates
     - _numberLanguage_: alternative language to translate numbers
     - _currency_: ISO 4217 three-letter code
     - _timezone_: from the IANA time zone database

- `L10nFormat`: shows the format of the _language_ to be used for translations. The supported formats are: `'language' | 'language-script' | 'language-region' | 'language-script-region'`. So, for example, you can have a _language_ like `en-US-u-ca-gregory-nu-latn` to format dates and numbers, but only use the `en-US` for translations setting `'language-region'`
- `L10nDateTimeFormatOptions`: the type of _options_ used to format dates. Extends the Intl `DateTimeFormatOptions` interface, replacing the _dateStyle_ and _timeStyle_ attributes. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) for more details on available options
- `L10nNumberFormatOptions`: the type of _options_ used to format numbers. Extends the Intl `NumberFormatOptions` interface, adding the _digits_ attribute. See [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) for more details on available options


## Intl API
To format dates and numbers, this library uses the [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

Current browser support:
- [ECMAScript compatibility tables](http://kangax.github.io/compat-table/esintl/)
- [Can I use](http://caniuse.com/#feat=internationalization)
- [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Browser_compatibility)

If you need to support previous versions of browsers, or to use newest features see [Format.JS](https://formatjs.io/docs/polyfills)

### Intl API in Node.js
To use Intl in _Node.js_, check the support according to the version in the official documentation: [Internationalization Support](https://nodejs.org/api/intl.html)


## Server Side Rendering
You can find a complete sample app with _@nguniversal/express-engine_ [here](projects/angular-l10n-app-ssr)

SSR doesn't work out of the box, so it is important to know:
- `src\app\universal-interceptor.ts`: used to handle absolute URLs for HTTP requests on the server
- `src\app\l10n-config.ts`:
    - `AppStorage (implements L10nStorage)`: uses a cookie to store the _locale_ client & server side
    - `AppUserLanguage (implements L10nUserLanguage)`: server side, negotiates the language through `acceptsLanguages` to get the user language when the app starts


## Previous versions
- **Angular v11 (Angular l10n v11.1.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v11)

- **Angular v10 (Angular l10n v10.1.2)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v10)

- **Angular v9 (Angular l10n v9.3.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v9)

- **Angular v8 (Angular l10n v8.1.2)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v8)

- **Angular v7 (Angular l10n v7.2.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v7)

- **Angular v6 (Angular l10n v5.2.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v6)

- **Angular v5 (Angular l10n v4.2.0)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v5)

- **Angular v4 (Angular l10n v3.5.2)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v4)

- **Angular v2 (Angular l10n v2.0.11)**
    - [Branch](https://github.com/robisim74/angular-l10n/tree/angular_v2)


## Contributing
- First, install the packages & build the library:
    ```Shell
    npm install
    npm run build
    ```

- Testing:
    ```Shell
    npm test
    ```

- Serving the sample app:
    ```Shell
    npm start
    ```

- Serving the sample ssr app:
    ```Shell
    npm run dev:ssr
    ```


## License
MIT
