# Library structure

## Main modules
Class | Contract
----- | --------
`TranslationModule` | Provides dependencies, pipes & directives for translating messages
`LocalizationModule` | Provides dependencies, pipes & directives for translating messages, dates & numbers
`LocaleValidationModule` | Provides dependencies & directives for locale validation
`CollatorModule` | Provides dependencies for sorting and filtering a list by locales
`LocaleInterceptorModule` | Sets locale in _Accept-Language_ header on outgoing requests

---

## Main services
Class | Contract
----- | --------
`L10nLoader` | Initializes the services
`LocaleService` | Manages language, default locale, currency & timezone
`TranslationService` | Manages the translation data
`LocaleValidation` | Provides the methods for locale validation
`Collator` | Intl.Collator APIs
`IntlAPI` | Provides the methods to check if Intl APIs are supported

---

## Main class-interfaces
Class | Contract
----- | --------
`LocaleStorage` | Class-interface to create a custom storage for default locale, currency & timezone
`TranslationProvider` | Class-interface to create a custom provider for translation data
`TranslationHandler` | Class-interface to create a custom handler for translated values
