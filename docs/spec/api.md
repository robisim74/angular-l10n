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

## CollatorModule
Method | Function
------ | --------
 | 

---

## L10nLoader
Method | Function
------ | --------
`load(): Promise<void>` | Loads l10n services

---

## ILocaleService
Property | Value
-------- | -----
`languageCodeChanged: EventEmitter<string>` |
`defaultLocaleChanged: EventEmitter<string>` |
`currencyCodeChanged: EventEmitter<string>` |
`timezoneChanged: EventEmitter<string>` |
`loadTranslation: Subject<any>` |

Method | Function
------ | --------
`getConfiguration(): LocaleConfig` |
`init(): Promise<void>` |
`getBrowserLanguage(): string | null` |
`getAvailableLanguages(): string[]` |
`getLanguageDirection(languageCode?: string): string` |
`getCurrentLanguage(): string` |
`getCurrentCountry(): string` |
`getCurrentLocale(): string` | Returns the well formatted locale as {languageCode}[-scriptCode][-countryCode]
`getCurrentScript(): string` |
`getCurrentNumberingSystem(): string` |
`getCurrentCalendar(): string` |
`getDefaultLocale(): string` |
`getCurrentCurrency(): string` |
`getCurrencySymbol(currencyDisplay?: 'code' | 'symbol' | 'name', defaultLocale?: string, currency?: string): string` |
`getCurrentTimezone(): string` |
`setCurrentLanguage(languageCode: string): void` |
`setDefaultLocale(languageCode: string, countryCode?: string, scriptCode?: string, numberingSystem?: string, calendar?: string): void` |
`setCurrentNumberingSystem(numberingSystem: string): void` |
`setCurrentCalendar(calendar: string): void` |
`setCurrentCurrency(currencyCode: string): void` |
`setCurrentTimezone(zoneName: string): void` |
`composeLocale(codes: ISOCode[]): string` |

---

## ITranslationService
Property | Value
-------- | -----
`translationError: Subject<any>` |

Method | Function
------ | --------
`getConfiguration(): TranslationConfig` |
`init(): Promise<void>` | 
`translationChanged(): Observable<string>` | Fired when the translation data has been loaded. Returns the translation language
`translate(keys: string | string[], args?: any, lang?: string): string | any` | Translates a key or an array of keys
`translateAsync(keys: string | string[], args?: any, lang?: string): Observable<string | any>` |

---

## ILocaleValidation
Method | Function
------ | --------
`parseNumber(s: string, defaultLocale?: string): number | null` | Converts a string to a number according to default locale. If the string cannot be converted to a number, returns NaN
`getRegExp(digits: string, defaultLocale?: string): RegExp` |

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
