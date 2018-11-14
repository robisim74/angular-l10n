# Configuration

## Loading

### Angular CLI
No need to set up anything, just import it in your code.

### Rollup or webpack
No need to set up anything, just import it in your code.

### Using SystemJS configuration
```JavaScript
System.config({
    map: {
        'angular-l10n': 'node_modules/angular-l10n/bundles/angular-l10n.umd.js'
    }
});
```

### Plain JavaScript
If you build apps in Angular using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular-l10n/bundles/angular-l10n.umd.js"></script>
```
and use global `ng.l10n` namespace.

---

## First scenario: you only need to translate messages
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

---

## Second scenario: you need to translate messages, dates & numbers
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

---

## Configuration settings
The `L10nConfig` interface contains an interface to configure `LocaleService` and one to configure `TranslationService`.

### LocaleConfig 
Property | Value
-------- | -----
`languages?: Language[]` | Adds the languages to use in the app
`language?: string` | Defines the language ISO 639 two-letter or three-letter code to be used, if the language is not found in the browser
`defaultLocale?: DefaultLocaleCodes` | Defines the default locale to be used, regardless of the browser language
`currency?: string` | Defines the currency ISO 4217 three-letter code to be used
`timezone?: string` | The time zone name of the IANA time zone database to use
`storage?: StorageStrategy` | Defines the storage to be used for language, default locale & currency
`cookieExpiration?: number` | If the cookie expiration is omitted, the cookie becomes a session cookie
`localizedRouting?: ISOCode[]` | Enables localized routing with the provided ISO codes
`localizedRoutingOptions?: LocalizedRoutingOptions` | Options for localized routing
`localeInterceptor?: ISOCode[]` | Provides ISO codes to locale interceptor

### TranslationConfig
Property | Value
-------- | -----
`translationData?: Array<{ languageCode: string; data: any; }>` | Direct loading: adds translation data
`providers?: any[]` |  Asynchronous loading: adds translation providers
`caching?: Boolean` |  Asynchronous loading: disables/enables the cache for translation providers
`version?: string` |  Asynchronous loading: adds the query parameter 'ver' to the http requests
`timeout?: number` |  Asynchronous loading: sets a timeout in milliseconds for the http requests
`composedLanguage?: ISOCode[]` |  Sets a composed language for translations
`missingValue?: string | ((path: string) => string)` | Sets the value or the function to use for missing keys
`missingKey?: string` | Sets the key to use for missing keys
`composedKeySeparator?: string` | Sets composed key separator
`i18nPlural?: boolean` | Disables/enables the translation of numbers that are contained at the beginning of the keys

> There aren't default values: you must explicitly set each parameter you need.

---

## Dynamic settings
The configuration settings are stored in the following `InjectionToken`:

Interface | Token
----- | --------
`LocaleConfig` | `LOCALE_CONFIG` 
`TranslationConfig` | `TRANSLATION_CONFIG`

If you need to load the configuration data dynamically, you can provide a partial or empty `L10nConfig` in `AppModule`, 
and then update the _tokens_ in your class:

```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        providers: [], // Not available here.
        caching: true,
        missingValue: 'No key'
    }
};

@NgModule({
    imports: [
        ...
        LocalizationModule.forRoot(l10nConfig)
    ],
    ...
})
export class AppModule {

    constructor(
        public l10nLoader: L10nLoader,
        @Inject(TRANSLATION_CONFIG) private translationConfig: TranslationConfig
    ) {
        this.translationConfig.providers = [
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ];

        this.l10nLoader.load();
    }

}
```

> Configuration must be completed before invoking the `load` method of `L10nLoader`.

Or whether you use the _advanced initialization_:

```TypeScript
@Injectable() export class LocalizationConfig {

    constructor(
        public l10nLoader: L10nLoader,
        @Inject(TRANSLATION_CONFIG) private translationConfig: TranslationConfig
    ) { }

    load(): Promise<void> {
        this.translationConfig.providers = [
            { type: ProviderType.Static, prefix: './assets/locale-' }
        ];

        return this.l10nLoader.load();
    }

}

export function initLocalization(localizationConfig: LocalizationConfig): Function {
    return () => localizationConfig.load();
}

@NgModule({
    imports: [
        ...
        LocalizationModule.forRoot(l10nConfig)
    ],
    providers: [
        ...
        LocalizationConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: initLocalization,
            deps: [LocalizationConfig],
            multi: true
        }
    ],
    ...
})
export class AppModule { }
```

---

## Loading the translation data
### Direct loading
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

### Asynchronous loading of json files
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

> You can't use Direct and Asynchronous loading at the same time.

### Asynchronous loading through a Web API
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

### Using fallback providers
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

### Using a custom provider
If you need, you can create a custom provider to load translation data.

Implement `TranslationProvider` class-interface and the `getTranslation` method with the logic to retrieve the data:
```TypeScript
@Injectable() export class CustomTranslationProvider implements TranslationProvider {

    /**
     * This method must contain the logic of data access.
     * @param language The current language
     * @param args The object set during the configuration of 'providers'
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

See also [TranslationProvider](https://github.com/robisim74/angular-l10n/blob/master/src/services/translation-provider.ts) code.

---

## Using a composed language
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

> Note that you have to configure `defaultLocale` and not only `language`. You must also use `setDefaultLocale` when the language changes.

---

## Default locale, currency & timezone
The _default locale_ contains the current language and culture. It consists of:

* `language code`: ISO 639 two-letter or three-letter code of the language
* `country code`: ISO 3166 two-letter, uppercase code of the country

and optionally:

* `script code`: used to indicate the script or writing system variations that distinguish the written forms of a language or its dialects. It consists of four letters and was defined according to the assignments found in ISO 15924
* `numbering system`: possible values include: _arab_, _arabext_, _bali_, _beng_, _deva_, _fullwide_, _gujr_, _guru_, _hanidec_, _khmr_, _knda_, _laoo_, _latn_, _limb_, _mlym_, _mong_, _mymr_, _orya_, _tamldec_, _telu_, _thai_, _tibt_
* `calendar`: possible values include: _buddhist_, _chinese_, _coptic_, _ethioaa_, _ethiopic_, _gregory_, _hebrew_, _indian_, _islamic_, _islamicc_, _iso8601_, _japanese_, _persian_, _roc_

The `currency` contains the ISO 4217 currency codes.

The `timezone` contains the time zone names of the IANA time zone database.

For more information see [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

---

## Storage
The `defaultLocale`, the `currency` and the `timezone` chosen by the user are stored, and retrieved at the next access. During the configuration, you can choose your `StorageStrategy`: _Session_, _Local_, _Cookie_, _Disabled_. If you don't provide a different expiration using `cookieExpiration`, the cookie becomes a session cookie.

You can also create a custom storage.

Implement `LocaleStorage` class-interface and the `read` and `write` methods:
```TypeScript
@Injectable() export class CustomStorage implements LocaleStorage {

    /**
     * This method must contain the logic to read the storage.
     * @param name 'defaultLocale', 'currency' or 'timezone'
     * @return A promise with the value of the given name
     */
    public async read(name: string): Promise<string | null> {
        ...
        return ...
    }

    /**
     * This method must contain the logic to write the storage.
     * @param name 'defaultLocale', 'currency' or 'timezone'
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

---

## Getting browser language
Depending on the configuration, _the library_ will automatically try to get the language from the browser or not:

**If you set `language`**

- _the library_ tries to get the `language` from the storage
- or tries to get the `language` from the browser
- or uses the `language` set in the configuration

**If you set `defaultLocale`**

- _the library_ tries to get the `defaultLocale` from the storage
- or uses the `defaultLocale` set in the configuration

That's because not all browsers return `languageCode-countryCode`.

---

## Caching
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

* if the user returns to a language already selected;
* if you use a global file shared across _lazy loaded modules_.

---

## Intl API
To localize _dates and numbers_, this library uses the [Intl API](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Intl).

Check the current browser support:

* [ECMAScript compatibility tables](http://kangax.github.io/compat-table/esintl/)
* [Can I use](http://caniuse.com/#feat=internationalization)

All modern browsers have implemented this API. You can use [Intl.js](https://github.com/andyearnshaw/Intl.js) to extend support to old browsers.

Just add one script tag in your `index.html`:
```Html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-US"></script>
```
When specifying the `features`, you have to specify what locale, or locales to load.

The _timezone_ is also provided via _Intl API_. Except IE, all modern browsers have implemented the timezone. To extend the support, you can use [Intl.DateTimeFormat timezone polyfill](https://github.com/yahoo/date-time-format-timezone).

> When a feature is not supported, however, for example in older browsers, Angular localization does not generate an error in the browser, but returns the value without performing operations.

## Localized routing for SEO
In _locale-adaptive_ apps (like the apps that use this library, that return different content based on the preferred locale of the visitor), _Google might not crawl, index, or rank all the content for different locales_.

To solve this problem, you can enable localized routing during configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        ...
        localizedRouting: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */]
    },
    ...
};
```

**Features:**

* A prefix is added to the path of each navigation, containing the language or the locale, creating a semantic URL:
```
baseHref[language[-script][-country]]path

https://example.com/en/home
https://example.com/en-US/home
```
* If the localized link is called, the content is automatically translated.
* When the language changes, the link is also updated.
* Changes to localized links do not change browser history.
* It works also with SSR.

To achieve this, the router configuration in your app is not rewritten (operation that would poor performance and could cause errors): the `Location` class provided by Angular is used for the replacement of the URL, in order to provide the different contents localized both to the crawlers and to the users that can refer to the localized links.

> Since the link contains only the locale, if your app also uses _numbering system_, _calendar_, _currency_ or _timezone_, you should set _schema_ option below.

### Using hreflang and sitemap
You can use the Sitemap to tell Google all of the locale variants for each URL:
```XML
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/en/home</loc>
    <xhtml:link rel="alternate" hreflang="it" href="https://example.com/en/home"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/it/home"/>
    ...
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/home"/>
  </url>
  <url>
    <loc>https://example.com/it/home</loc>
    ...
  </url>
  ...
</urlset>
```

For more info, visit [Search Console Help - International](https://support.google.com/webmasters/topic/2370587?hl=en&ref_topic=4598733)

### Options

#### Default routing
If you don't want a localized routing for default language or locale, you can enable it during the configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        ...
        localizedRouting: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */],
        localizedRoutingOptions: {
            defaultRouting: true
        }
    },
    ...
};
```

#### Schema
If your app uses _numbering system_, _calendar_, _currency_ or _timezone_, it is recommended to provide the _schema_ option, to manage the localized links and refreshes:
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        ...
        localizedRouting: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */],
        localizedRoutingOptions: {
            schema: [
                { text: 'United States', languageCode: 'en', countryCode: 'US', currency: 'USD' },
                { text: 'Italia', languageCode: 'it', countryCode: 'IT', currency: 'EUR' },
            ]
        }
    },
    ...
};
```

### Setting the locale in _Accept-Language_ header on outgoing requests
To set the locale in _Accept-Language_ header on all outgoing requests, provide the _localeInterceptor_ option during the configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    locale: {
        ...
        localeInterceptor: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */]
    },
    ...
};
```

Then import the module:
```TypeScript
@NgModule({
    imports: [
        ...
        LocaleInterceptorModule
    ],
    ...
})
export class AppModule { }
```
