## Library structure

<br>

---

### Main modules
Class | Contract
----- | --------
`TranslationModule` | Provides dependencies, pipes & directives for translating messages
`LocalizationModule` | Provides dependencies, pipes & directives for translating messages, dates & numbers
`LocaleValidationModule` | Provides dependencies & directives for locale validation

<br>

---

### Main services
Class | Contract
----- | --------
`L10nLoader` | Initializes the services
`LocaleService` | Manages language, default locale, currency & timezone
`TranslationService` | Manages the translation data
`Translation` | Provides _lang_ to the _translate_ pipe
`Localization` | Provides _lang_ to the _translate_ pipe, _defaultLocale_, _currency_, _timezone_ to _l10nDate_, _l10nDecimal_, _l10nPercent_ & _l10nCurrency_ pipes
`LocaleValidation` | Provides the methods to convert strings according to default locale
`Collator` | Intl.Collator APIs
`IntlAPI` | Provides the methods to check if Intl APIs are supported

<br>

---

### Main class-interfaces
Class | Contract
----- | --------
`LocaleStorage` | Class-interface to create a custom storage for default locale & currency
`TranslationProvider` | Class-interface to create a custom provider for translation data
`TranslationHandler` | Class-interface to create a custom handler for translated values
