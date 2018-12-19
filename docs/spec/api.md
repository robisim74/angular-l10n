# Services APIs

## TranslationModule
Method | Function
------ | --------
`static forRoot(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders<TranslationModule>` | Use in `AppModule`: new instances of `LocaleService` & `TranslationService`
`static forChild(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders<TranslationModule>` | Use in feature modules with lazy loading: new instance of `TranslationService`

---

## LocalizationModule
Method | Function
------ | --------
`static forRoot(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders<LocalizationModule>` | Use in `AppModule`: new instances of `LocaleService` & `TranslationService`
`static forChild(l10nConfig: L10nConfig, token?: Token): ModuleWithProviders<LocalizationModule>` | Use in feature modules with lazy loading: new instance of `TranslationService`

---

## LocaleValidationModule
Method | Function
------ | --------
`static forRoot(): ModuleWithProviders<LocaleValidationModule>` | Use in `AppModule`: new instance of `LocaleValidation`

---

## LocaleSeoModule
Method | Function
------ | --------
`static forRoot(): ModuleWithProviders<LocaleSeoModule>` | Use in `AppModule`: new instance of `SearchService`
`static forChild(): ModuleWithProviders<LocaleSeoModule>` | Use in feature modules with lazy loading: new instance of `SearchService`

---

## L10nLoader
Method | Function
------ | --------
`abstract load(): Promise<any>` | Loads l10n services

---

## ILocaleService
Property | Value
-------- | -----
`languageCodeChanged: Subject<string>` | Fired when the language changes. Returns the language code
`defaultLocaleChanged: Subject<string>` | Fired when the default locale changes. Returns the default locale
`currencyCodeChanged: Subject<string>` | Fired when the currency changes. Returns the currency code
`timezoneChanged: Subject<string>` | Fired when the timezone changes. Returns the timezone

Method | Function
------ | --------
`getConfiguration(): L10nConfigRef['locale']` |
`init(): Promise<void>` |
`getBrowserLanguage(): string | null` |
`getAvailableLanguages(): string[]` |
`getLanguageDirection(languageCode?: string): string` |
`getCurrentLanguage(): string` |
`getCurrentCountry(): string` |
`getCurrentScript(): string` |
`getCurrentLocale(): string` | Returns the well formatted locale as {languageCode}[-scriptCode][-countryCode]
`getCurrentNumberingSystem(): string` |
`getCurrentCalendar(): string` |
`getDefaultLocale(): string` |
`getCurrentCurrency(): string` |
`getCurrencySymbol(currencyDisplay?: string, defaultLocale?: string, currency?: string): string` |
`getCurrentTimezone(): string` |
`setCurrentLanguage(languageCode: string): void` |
`setDefaultLocale(languageCode: string, countryCode?: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void` |
`setCurrentCurrency(currencyCode: string): void` |
`setCurrentTimezone(zoneName: string): void` |
`formatDate(value: any, format?: string | DateTimeOptions, defaultLocale?: string, timezone?: string): string` | Formats a date according to default locale
`formatDecimal(value: any, digits?: string | DigitsOptions, defaultLocale?: string): string` | Formats a decimal number according to default locale
`formatPercent(value: any, digits?: string | DigitsOptions, defaultLocale?: string): string` | Formats a number as a percentage according to default locale
`formatCurrency(value: any, digits?: string | DigitsOptions, currencyDisplay?: string, defaultLocale?: string, currency?: string): string` | Formats a number as a currency according to default locale
`composeLocale(codes: ISOCode[]): string` |
`rollback(): void` | Rollbacks to previous language, default locale, currency & timezone

---

## ITranslationService
Property | Value
-------- | -----
`translationError: Subject<any>` | Fired when the translation data could not been loaded. Returns the error

Method | Function
------ | --------
`getConfiguration(): L10nConfigRef['translation']` |
`init(): Promise<any>` | 
`translationChanged(): Observable<string>` | Fired when the translation data has been loaded. Returns the translation language
`latestTranslation(): Observable<string>` | Fired when the latest `translationChanged` is emitted. Returns the translation language. Used when the reference to the service is not known, as in decorators
`translate(keys: string | string[], args?: any, lang?: string): string | any` | Translates a key or an array of keys
`translateAsync(keys: string | string[], args?: any, lang?: string): Observable<string | any>` |

---

## ILocaleValidation
Method | Function
------ | --------
`parseNumber(s: string, digits?: string, defaultLocale?: string): number | null` | Converts a string to a number according to default locale. If the string cannot be converted to a number, returns NaN

---

## ISearchService
Method | Function
------ | --------
`updateHead(page: string): void` | Translates the _title_ of the page and the provided meta tags

---

## ICollator
Method | Function
------ | --------
`compare(key1: string, key2: string, extension?: string, options?: any): number` | Compares two keys by the value of translation according to the current language
`sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]` | Sorts an array of objects or an array of arrays according to the current language
`sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>` | Sorts asynchronously an array of objects or an array of arrays according to the current language
`search(s: string, list: any[], keyNames: any[], options?: any): any[]` | Matches a string into an array of objects or an array of arrays according to the current language
`searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>` | Matches asynchronously a string into an array of objects or an array of arrays according to the current language

---

## IntlAPI
Method | Function
------ | --------
`static hasIntl(): boolean` |
`static hasDateTimeFormat(): boolean` |
`static hasTimezone(): boolean` |
`static hasNumberFormat(): boolean` |
`static hasCollator(): boolean` |

---

## LocaleStorage
Method | Function
------ | --------
`abstract read(name: string): Promise<string | null>` | This method must contain the logic to read the storage
`abstract write(name: string, value: string): Promise<void>` | This method must contain the logic to write the storage

---

## TranslationProvider
Method | Function
------ | --------
`abstract getTranslation(language: string, args: any): Observable<any>` | This method must contain the logic of data access

---

## TranslationHandler
Method | Function
------ | --------
`abstract parseValue(path: string, key: string, value: string | null, args: any, lang: string): string` | This method must contain the logic to parse the translated value

---

## Translation
Property | Value
-------- | -----
`lang: string` | 

---

## Localization
Property | Value
-------- | -----
`lang: string` | 
`defaultLocale: string` | 
`currency: string` | 
`timezone: string` | 
