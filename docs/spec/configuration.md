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
If you build apps in Angular using ES5, you can include the _umd_ bundle in your `index.html`:
```Html
<script src="node_modules/angular-l10n/bundles/angular-l10n.umd.js"></script>
```
and use global `ng.l10n` namespace.

---

## First scenario: you only need to translate messages
Import the modules you need and configure the library in the application root module:
```TypeScript
const l10nConfig: L10nConfig = {
    logger: {
        level: LogLevel.Warn
    },
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
        composedKeySeparator: '.',
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

    constructor(private l10nLoader: L10nLoader) {
        this.l10nLoader.load();
    }

}
```

---

## Second scenario: you need to translate messages, dates & numbers
Import the modules you need and configure the library in the application root module:
```TypeScript
const l10nConfig: L10nConfig = {
    logger: {
        level: LogLevel.Warn
    },
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
        composedKeySeparator: '.',
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

    constructor(private l10nLoader: L10nLoader) {
        this.l10nLoader.load();
    }

}
```

---

## Configuration settings
The `L10nConfig` interface contains the properties to configure the library.

### L10nConfig 
Property | Nested property | Value
-------- | --------------- | -----
`locale?` | | Locale service configuration
| | `languages?: Language[]` | Adds the languages to use in the app
| | `language?: string` | Defines the language ISO 639 two-letter or three-letter code to be used, if the language is not found in the browser
| | `defaultLocale?: DefaultLocale` | Defines the default locale to be used, regardless of the browser language
| | `currency?: string` | Defines the currency ISO 4217 three-letter code to be used
| | `timezone?: string` | The time zone name of the IANA time zone database to use
| | `storage?: StorageStrategy` | Defines the storage to be used for default locale, currency & timezone
| | `cookieExpiration?: number` | If the cookie expiration is omitted, the cookie becomes a session cookie
`translation?` | | Translation service configuration
| | `translationData?: Array<{ languageCode: string; data: any; }>` | Direct loading: adds translation data
| | `providers?: any[]` | Asynchronous loading: adds translation providers
| | `caching?: Boolean` | Asynchronous loading: disables/enables the cache for translation providers
| | `version?: string` | Asynchronous loading: adds the query parameter `ver` to the http requests
| | `timeout?: number` | Asynchronous loading: sets a timeout in milliseconds for the http requests
| | `rollbackOnError?: boolean` | Asynchronous loading: rollbacks to previous default locale, currency and timezone on error
| | `composedLanguage?: ISOCode[]` | Sets a composed language for translations
| | `missingValue?: string | ((path: string) => string)` | Sets the value or the function to use for missing keys
| | `missingKey?: string` | Sets the key to use for missing keys
| | `composedKeySeparator?: string` | Sets composed key separator
| | `i18nPlural?: boolean` | Disables/enables the translation of numbers that are contained at the beginning of the keys
`logger?` | | Logger configuration
| | `level?: LogLevel` | Defines the log level
`localizedRouting?` | | Localized routing configuration
| | `format?: ISOCode[]` | Defines the format of the localized routing
| | `defaultRouting?: boolean` | Disables/enables default routing for default language or locale
| | `schema?: Schema[]` | Provides the schema to the default behaviour of localized routing
`search?` | | Search configuration
| | `metaTags?: string[]` | List of meta tag names to translate
`localeInterceptor?` | | Locale interceptor configuration
| | `format?: ISOCode[]` | Defines the format of the _Accept-Language_ header

> There aren't default values: you must explicitly set each parameter you need.

---

## Configuration token
The configuration settings are stored in the following `InjectionToken`:

Token | Interface
----- | --------
`L10N_CONFIG` | `L10nConfigRef`

---

## Dynamic settings
If you need to load the configuration data dynamically, you can provide a partial or empty `L10nConfig` in `AppModule`, 
and then update the _token_ in your class:

```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        providers: [], // Not available here.
        caching: true,
        composedKeySeparator: '.',
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
        private l10nLoader: L10nLoader,
        @Inject(L10N_CONFIG) private configuration: L10nConfigRef
    ) {
        this.configuration.translation.providers = [
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
        private l10nLoader: L10nLoader,
        @Inject(L10N_CONFIG) private configuration: L10nConfigRef
    ) { }

    load(): Promise<any> {
        this.configuration.translation.providers = [
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

## Logger
For development, you can enable the logger:
```TypeScript
const l10nConfig: L10nConfig = {
    logger: {
        level: LogLevel.Warn
    },
    ...
};
```
In this way, you will be warned of the most common errors in the implementation of this library, such as missing functions or invalid formats.

To turn off it in production, you can use:
```TypeScript
const l10nConfig: L10nConfig = {
    logger: {
        level: environment.production ? LogLevel.Off : LogLevel.Warn
    },
    ...
};
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

### Asynchronous loading of JSON files
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

> You can use Direct and Asynchronous loading at the same time. Translation data of Direct loading will be merged before the data of Asynchronous loading.

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
        this.translation.translationError.subscribe((error) => {
            if (error) {
                console.log(error);
            }
        });
    }
}
```
`[path]{languageCode}` will be the URL used by the Http GET requests. So the example URI will be something like: `http://localhost:54703/api/values/en`.

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
* if you use a global file shared across _lazy loaded_ modules.

---

## Error handling of data loading
To find out if an error occurred during asynchronous loading of translation data, you have the `translationError` event:
```TypeScript
...
export class AppComponent {
    constructor(private translation: TranslationService) {
        this.translation.translationError.subscribe((error) => {
            if (error) {
                console.log(error);
            }
        });
    }
}
```
If the error occurs on the first loading of the application or a lazy loaded module, you can catch it with the `load` method: 
```TypeScript
export class AppModule {
    constructor(private l10nLoader: L10nLoader) {
        this.l10nLoader.load()
            .catch(err => console.error(err));
    }
}
```

> If you use _advanced initialization_, you can catch it with the `bootstrapModule` method in `main.ts`.

### Rollback on errror
If the error occurs when the user changes language, you can enable `rollbackOnError` option during the configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        ...
        rollbackOnError: true
    }
};
```
In this way, the application will keep the previous locatization without changing settings.

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

## How the language is defined at the first loading
Depending on the configuration, the library tries to define the language.

**If you set the language**

- the library tries to get the `language` from the URL
- or tries to get the `language` from the storage
- or tries to get the `language` from the browser
- or uses the `language` set in the configuration

**If you set the default locale**

- the library tries to get the `defaultLocale` from the URL
- or tries to get the `defaultLocale` from the storage
- or uses the `defaultLocale` set in the configuration

That's because not all browsers return `languageCode-countryCode`.

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
