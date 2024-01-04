# Angular l10n
![Node.js CI](https://github.com/robisim74/angular-l10n/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/angular-l10n.svg)](https://badge.fury.io/js/angular-l10n) [![npm](https://img.shields.io/npm/dm/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n) [![npm](https://img.shields.io/npm/l/angular-l10n.svg)](https://www.npmjs.com/package/angular-l10n)
> Angular library to translate texts, dates and numbers

This library is for localization of **Angular** apps. It allows, in addition to translation, to format dates and numbers through [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Lazy loading](#lazy-loading)
- [Localized routing](#localized-routing)
- [Server Side Rendering](#server-side-rendering)
- [Types](#types)
- [Contributing](#contributing)
- [Versions](./versions.md)


## Installation
```Shell
npm install angular-l10n --save 
```


## Usage
- Sample [standalone app](projects/angular-l10n-app)
- Sample [SSR app](projects/angular-l10n-ssr)
- Live example on [StackBlitz](https://stackblitz.com/edit/angular-l10n)

### Configuration
Create the configuration:

_src/app/l10n-config.ts_
```TypeScript
export const l10nConfig: L10nConfig = {
  format: 'language-region',
  providers: [
    { name: 'app', asset: 'app' }
  ],
  cache: true,
  keySeparator: '.',
  defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
  schema: [
    { locale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' } },
    { locale: { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' } }
  ]
};

@Injectable() export class TranslationLoader implements L10nTranslationLoader {
  public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
    const data = import(`../i18n/${language}/${provider.asset}.json`);
    return from(data);
  }
}
```
The implementation of `L10nTranslationLoader` class-interface above creates a js chunk for each translation file in the `src/i18n/[language]/[asset].json` folder during the build:

_src/i18n/en-US/app.json_
```Json
{
  "home": {
    "greeting": "Hello world!",
    "whoIAm": "I am {{name}}",
    "devs": {
      "one": "One software developer",
      "other": "{{value}} software developers"
    }
  }
}
```

Register the configuration:

_src/app/app.config.ts_
```TypeScript
export const appConfig: ApplicationConfig = {
  providers: [
    provideL10nTranslation(
      l10nConfig,
      {
        translationLoader: TranslationLoader
      }
    ),
    provideL10nIntl()
  ]
};
```
or with modules:

_src/app/app.module.ts_
```TypeScript
@NgModule({
  imports: [
    L10nTranslationModule.forRoot(
      l10nConfig,
      {
        translationLoader: TranslationLoader
      }
    ),
    L10nIntlModule
  ]
})
export class AppModule { }
```

### Getting the translation
#### Pure Pipes
```Html
<!-- translate pipe -->
<p>{{ 'home.greeting' | translate:locale.language }}</p>
<!-- Hello world! -->

<!-- translate pipe with params -->
<p>{{ 'home.whoIAm' | translate:locale.language:{ name: 'Angular l10n' } }}</p>
<!-- I am Angular l10n -->

<!-- l10nPlural pipe -->
<p>{{ 2 | l10nPlural:locale.language:'home.devs' }}</p>
<!-- 2 software developers -->

<!-- l10nDate pipe -->
<p>{{ today | l10nDate:locale.language:{ dateStyle: 'full', timeStyle: 'short' } }}</p>
<!-- Friday, May 12, 2023 at 1:59 PM -->

<!-- l10nTimeAgo pipe -->
<p>{{ -1 | l10nTimeAgo:locale.language:'second':{ numeric:'always', style:'long' } }}</p>
<!-- 1 second ago -->

<!-- l10nNumber pipe -->
<p>{{ 1000 | l10nNumber:locale.language:{ digits: '1.2-2', style: 'currency' } }}</p>
<!-- $1,000.00 -->

<!-- l10nDisplayNames pipe -->
<p>{{ 'en-US' | l10nDisplayNames:locale.language:{ type: 'language' } }}</p>
<!-- American English -->
```
Pure pipes need to know when the _locale_ changes. So import `L10nLocale` injection token in every component that uses them:
```TypeScript
@Component({
  standalone: true,
  imports: [
    L10nTranslatePipe
  ]
})
export class PipeComponent {
  locale = inject(L10N_LOCALE);
}
```
or with modules:
```TypeScript
export class PipeComponent {
    locale = inject(L10N_LOCALE);
}
```

#### OnPush Change Detection Strategy
To support this strategy, there is an `Async` version of each pipe, which recognizes by itself when the _locale_ changes:
```Html
<p>{{ 'greeting' | translateAsync }}</p>
```

#### Directives
> Directives manipulate the DOM
```Html
<!-- l10nTranslate directive -->
<p l10nTranslate>home.greeting</p>

<!-- l10nTranslate directive with attributes -->
<p l10n-title title="greeting" l10nTranslate>home.greeting</p>

<!-- l10nTranslate directive with params -->
<p [params]="{ name: 'Angular l10n' }" l10nTranslate>home.whoIAm</p>

<!-- l10nPlural directive -->
<p prefix="devs" l10nPlural>2</p>
```

#### APIs
`L10nTranslationService` provides:

- `setLocale(locale: L10nLocale): Promise<void>` Changes the current locale and load the translation data
- `onChange(): Observable<L10nLocale>` Fired every time the translation data has been loaded. Returns the locale
- `onError(): Observable<any>` Fired when the translation data could not been loaded. Returns the error
- `translate(keys: string | string[], params?: any, language?: string): string | any` Translates a key or an array of keys

### Changing the locale
You can change the _locale_ at runtime at any time by calling the `setLocale` method of `L10nTranslationService`:
```Html
<button *ngFor="let item of schema" (click)="setLocale(item.locale)">
  {{ item.locale.language | l10nDisplayNames:locale.language:{ type: 'language' } }}
</button>
```

```TypeScript
export class AppComponent {

  schema = this.config.schema;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private config: L10nConfig,
    private translation: L10nTranslationService
  ) { }

  setLocale(locale: L10nLocale): void {
    this.translation.setLocale(locale);
  }
}
```

### Class-interfaces
The following features can be customized. You just have to implement the indicated class-interface and pass the token during configuration.

#### Translation Loader
By default, you can only pass JavaScript objects as translation data provider. To implement a different loader, you can implement the `L10nTranslationLoader` class-interface, as in the example above.
```TypeScript
export declare abstract class L10nTranslationLoader {
  /**
    * This method must contain the logic to get translation data.
    * @param language The current language
    * @param provider The provider of the translations data
    * @return An object of translation data for the language: {key: value}
    */
  abstract get(language: string, provider: L10nProvider): Observable<{
      [key: string]: any;
  }>;
}
```

#### Locale resolver
By default, the library attempts to set the _locale_ using the user's browser language, before falling back to the _default locale_. You can change this behavior by implementing the `L10nLocaleResolver` class-interface, for example to get the language from the URL.
```TypeScript
export declare abstract class L10nLocaleResolver {
  /**
   * This method must contain the logic to get the locale.
   * @return The locale
   */
  abstract get(): Promise<L10nLocale | null>;
}
```

#### Storage
By default, the library does not store the _locale_. To store it implement the `L10nStorage` class-interface using what you need, such as web storage or cookie, so that the next time the user has the _locale_ he selected.
```TypeScript
export declare abstract class L10nStorage {
  /**
   * This method must contain the logic to read the storage.
   * @return A promise with the value of the locale
   */
  abstract read(): Promise<L10nLocale | null>;
  /**
   * This method must contain the logic to write the storage.
   * @param locale The current locale
   */
  abstract write(locale: L10nLocale): Promise<void>;
}
```

#### Missing Translation Handler
If a key is not found, the same key is returned. To return a different value, you can implement the `L10nMissingTranslationHandler` class-interface.
```TypeScript
export declare abstract class L10nMissingTranslationHandler {
  /**
   * This method must contain the logic to handle missing values.
   * @param key The key that has been requested
   * @param value Null or empty string
   * @param params Optional parameters contained in the key
   * @return The value
   */
  abstract handle(key: string, value?: string, params?: any): string | any;
}
```

#### Translation fallback
If you enable translation fallback in configuration, the translation data will be merged in the following order:
- `'language'`
- `'language[-script]'`
- `'language[-script][-region]'`

To change it, implement the `L10nTranslationFallback` class-interface.
```TypeScript
export declare abstract class L10nTranslationFallback {
  /**
   * This method must contain the logic to get the ordered loaders.
   * @param language The current language
   * @param provider The provider of the translations data
   * @return An array of loaders
   */
  abstract get(language: string, provider: L10nProvider): Observable<any>[];
}
```
E.g.:
```TypeScript
@Injectable() export class TranslationFallback implements L10nTranslationFallback {

  constructor(
    @Inject(L10N_CONFIG) private config: L10nConfig,
    private cache: L10nCache,
    private translationLoader: L10nTranslationLoader
  ) { }

  public get(language: string, provider: L10nProvider): Observable<any>[] {
    const loaders: Observable<any>[] = [];
    // Fallback current lang to en
    const languages = ['en', language];
    for (const lang of languages) {
        if (this.config.cache) {
            loaders.push(
                this.cache.read(`${provider.name}-${lang}`,
                    this.translationLoader.get(lang, provider))
            );
        } else {
            loaders.push(this.translationLoader.get(lang, provider));
        }
    }
    return loaders;
  }
}
```

#### Loader
If you need to preload some data before initialization of the library, you can implement the `L10nLoader` class-interface.
```TypeScript
export declare abstract class L10nTranslationLoader {
  /**
   * This method must contain the logic to get translation data.
   * @param language The current language
   * @param provider The provider of the translations data
   * @return An object of translation data for the language: {key: value}
   */
  abstract get(language: string, provider: L10nProvider): Observable<{[key: string]: any;}>;
}
```
E.g.:
```TypeScript
@Injectable() export class AppLoader implements L10nLoader {
  constructor(private translation: L10nTranslationService) { }

  public async init(): Promise<void> {
      await ... // Some custom data loading action
      await this.translation.init();
  }
}
```

#### Validation
There are two directives, that you can use with Template driven or Reactive forms: `l10nValidateNumber` and `l10nValidateDate`. To use them, you have to implement the `L10nValidation` class-interface, and import it with the `L10nValidationModule` module.
```TypeScript
export declare abstract class L10nValidation {
  /**
   * This method must contain the logic to convert a string to a number.
   * @param value The string to be parsed
   * @param options A L10n or Intl NumberFormatOptions object
   * @param language The current language
   * @return The parsed number
   */
  abstract parseNumber(value: string, options?: L10nNumberFormatOptions, language?: string): number | null;
  /**
   * This method must contain the logic to convert a string to a date.
   * @param value The string to be parsed
   * @param options A L10n or Intl DateTimeFormatOptions object
   * @param language The current language
   * @return The parsed date
   */
  abstract parseDate(value: string, options?: L10nDateTimeFormatOptions, language?: string): Date | null;
}
```

## Lazy loading
If you want to add new providers to a lazy loaded component or module, you can use `resolveL10n` function in your routes:
```TypeScript
const routes: Routes = [
  {
    path: 'lazy',
    loadComponent: () => import('./lazy/lazy.component').then(m => m.LazyComponent),
    resolve: { l10n: resolveL10n },
    data: {
      l10nProviders: [{ name: 'lazy', asset: 'lazy' }]
    }
  }
];
```
Or to lazy load a module:
```TypeScript
const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
    resolve: { l10n: resolveL10n },
    data: {
      l10nProviders: [{ name: 'lazy', asset: 'lazy' }]
    }
  }
];
```
and import the modules you need:
```TypeScript
@NgModule({
  declarations: [LazyComponent],
  imports: [
      L10nTranslationModule
  ]
})
export class LazyModule { }
```


## Localized routing
Let's assume that we want to create a navigation of this type:
- default language (en-US): routes not localized `http://localhost:4200/home`
- other languages (it-IT): localized routes `http://localhost:4200/it-IT/home`

In `routes` root level add `:lang` param to create `localizedRoutes`:
```TypeScript
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
    resolve: { l10n: resolveL10n },
    data: {
      l10nProviders: [{ name: 'lazy', asset: 'lazy' }]
    }
  }
];

export const localizedRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  ...routes,
  {
    path: ':lang', // prepend [lang] to all routes
    children: routes
  },
  { path: '**', redirectTo: 'home' }
];
```
and provide it to the router.

Now let's implement the `L10nLocaleResolver` class-interface to get the language from the URL:

_src/app/l10n-config.ts_
```TypeScript
@Injectable() export class LocaleResolver implements L10nLocaleResolver {

  constructor(@Inject(L10N_CONFIG) private config: L10nConfig, private location: Location) { }

  public async get(): Promise<L10nLocale | null> {
    const path = this.location.path();

    for (const schema of this.config.schema) {
      const language = schema.locale.language;
      if (new RegExp(`(\/${language}\/)|(\/${language}$)|(\/(${language})(?=\\?))`).test(path)) {
        return Promise.resolve(schema.locale);
      }
    }
    return Promise.resolve(null);
  }
}
```
and add it to configuration using `provideL10nTranslation` or `L10nTranslationModule` with modules.

When the app starts, the library will call the `get` method of `LocaleResolver` and use the locale of the URL or the default locale.

> Do not implement storage when using the localized router, because the language of the URL may be inconsistent with the saved one

To change language at runtime, we can't use the `setLocale` method, but we have to navigate to the localized URL without reloading the page. We replace the `setLocale` method with the new `navigateByLocale` and we add `pathLang` to router links:
```Html
<a routerLink="{{pathLang}}/home">Home</a>
<a routerLink="{{pathLang}}/lazy">Lazy</a>

<button *ngFor="let item of schema" (click)="navigateByLocale(item.locale)">
  {{ item.locale.language | l10nDisplayNames:locale.language:{ type: 'language' } }}
</button>
```

```TypeScript
export class AppComponent implements OnInit {

  /**
   * Handle page back/forward
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.translation.init();
  }

  schema = this.config.schema;

  pathLang = this.getPathLang();

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private config: L10nConfig,
    private translation: L10nTranslationService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    // Update path language
    this.translation.onChange().subscribe({
      next: () => {
        this.pathLang = this.getPathLang();
      }
    });
  }

  /**
   * Replace the locale and navigate to the new URL
   */
  navigateByLocale(locale: L10nLocale) {
    let path = this.location.path();
    if (this.locale.language !== this.config.defaultLocale.language) {
      if (locale.language !== this.config.defaultLocale.language) {
        path = path.replace(`/${this.locale.language}`, `/${locale.language}`);
      } else {
        path = path.replace(`/${this.locale.language}`, '');
      }
    } else if (locale.language !== this.config.defaultLocale.language) {
      path = `/${locale.language}${path}`;
    }

    this.router.navigate([path]).then(() => {
      this.translation.init();
    });
  }

  getPathLang() {
    return this.locale.language !== this.config.defaultLocale.language ?
      this.locale.language :
      '';
  }
}
```
Here we are doing three things:
- we update `pathLang` provided to router links every time the locale changes
- we implement `navigateByLocale` method, which takes care of replacing the language and navigating to the new URL
- we handle page back/forward events


## Server Side Rendering
You can find a complete sample app [here](projects/angular-l10n-ssr)

What is important to know:
- `DirectiveComponent` has `ngSkipHydration` enabled because directives manipolate the DOM
- `prerender` is enabled in `angular.json`
- `routes.tsx` file contains localized routes (to prerender pages in different languages)

## Types
Angular l10n types that it is useful to know:
- `L10nConfig` Contains:
    - `format` Format of the translation language. Pattern: `language[-script][-region]`
    - `providers` The providers of the translations data
    - `keySeparator` Sets key separator
    - `defaultLocale` Defines the default locale to be used
    - `schema` Provides the schema of the supported locales
     
    Optionally:
    - `fallback` Translation fallback
    - `cache` Caching for providers

- `L10nLocale` Contains a `language`, in the format `language[-script][-region][-extension]`, where:
    - `language` ISO 639 two-letter or three-letter code
    - `script` ISO 15924 four-letter script code
    - `region` ISO 3166 two-letter, uppercase code
    - `extension` 'u' (Unicode) extensions
     
    Optionally:
    - `currency` ISO 4217 three-letter code
    - `timezone` From the IANA time zone database
    - `units` Key value pairs of unit identifiers

- `L10nFormat` Shows the format of the _language_ to be used for translations. The supported formats are: `'language' | 'language-script' | 'language-region' | 'language-script-region'`. So, for example, you can have a _language_ like `en-US-u-ca-gregory-nu-latn` to format dates and numbers, but only use the `en-US` for translations setting `'language-region'`
- `L10nDateTimeFormatOptions` The type of _options_ used to format dates. Extends the Intl `DateTimeFormatOptions` interface, replacing the _dateStyle_ and _timeStyle_ attributes. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) for more details on available options
- `L10nNumberFormatOptions` The type of _options_ used to format numbers. Extends the Intl `NumberFormatOptions` interface, adding the _digits_ attribute. See [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) for more details on available options


## Contributing
- First, install the packages & build the library:
    ```Shell
    npm install
    npm run build:watch
    ```

- Testing:
    ```Shell
    npm run test:watch
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
