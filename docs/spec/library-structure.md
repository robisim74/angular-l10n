# Library structure

## Main modules
Class | Contract
----- | --------
`TranslationModule` | Provides dependencies, pipes & directives for translating messages
`LocalizationModule` | Provides dependencies, pipes & directives for translating messages, dates & numbers
`LocalizationExtraModule` | Provides extra dependencies, pipes & directives
`LocaleValidationModule` | Provides dependencies & directives for validation by locales
`LocaleSeoModule` | Provides dependencies & components for SEO by locales
`LocaleInterceptorModule` | Sets locale in _Accept-Language_ header on outgoing requests

---

## Main services
Class | Contract
----- | --------
`L10nLoader` | Initializes the services
`LocaleService` | Manages language, default locale, currency & timezone
`TranslationService` | Manages the translation data
`LocaleValidation` | Provides the methods for locale validation
`SearchService` | Manages the translation of page 'title' and meta tags
`Collator` | Intl.Collator APIs
`IntlAPI` | Provides the methods to check if Intl APIs are supported

---

## Main class-interfaces
Class | Contract
----- | --------
`LocaleStorage` | Class-interface to create a custom storage for default locale, currency & timezone
`TranslationProvider` | Class-interface to create a custom provider for translation data
`TranslationHandler` | Class-interface to create a custom handler for translated values
