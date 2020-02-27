# MIGRATION GUIDE
> Migration guide to angular-l10n v9 for Angular v9

**angular-l10n v9 is basically a new library built on top of new Angular Ivy's view engine**. The best way to upgrade from a previous version is to follow the new README step by step.

- Update [Configuration](https://github.com/robisim74/angular-l10n#configuration): except for boolean `cache`, `fallback` and `defaultRouting`, all other attributes are required.

- [Customize](https://github.com/robisim74/angular-l10n#customize-the-library) services: the services offer only the basic functionalities, and according to the needs you have to customize them by implementing the class-interface and passing the token during the configuration. **If you are using json files or a Web API, you have to implement `L10nTranslationLoader` class-interface**.

- Update [Pure pipes](https://github.com/robisim74/angular-l10n#pure-pipes):

    - `translate` pipe: no changes
    - `l10nDate` now it uses _Intl.DateTimeFormatOptions_
    - `l10nDecimal`, `l10nPercent` and `l10nCurrency` **are now `l10nNumber`** pipe, that uses _Intl.NumberFormatOptions_

    **_Language_, _DefaultLocale_, _Currency_ and _Timezone_ decorators are no longer available, and you must replace them with the injection token `L10N_LOCALE`.**

    Also extended classes such as `Translation` and `Localization` are no longer available, but you can easily implement your own superclass by providing the `L10nlocale`.

- Update [Directives](https://github.com/robisim74/angular-l10n#directives):

    - `l10nTranslate` directive: no changes
    - `l10nDate` now it uses _Intl.DateTimeFormatOptions_
    - `l10nDecimal`, `l10nPercent` and `l10nCurrency` **are now `l10nNumber`** directive, that uses _Intl.NumberFormatOptions_

- Update [APIs](https://github.com/robisim74/angular-l10n#apis): all the translation APIs are now provided by `L10nTranslationService`. The APIs for localizing dates and numbers are provided by the new class `L10nIntlService`.

- Update [Validation](https://github.com/robisim74/angular-l10n#validation): the new validation is only a skeleton that needs to be customized. You can find an example in the sample app. The old `LocaleValidation` class is still available [here](https://github.com/robisim74/angular-l10n/blob/angular_v8/src/services/locale-validation.ts)

### Lazy loading

**Lazy loading is no longer natively supported**: in the new version you should centralize the configuration in the main module and the assets like the sample app.

### SEO

Except for [routing](https://github.com/robisim74/angular-l10n#routing), **translation of _title_ and meta tags, as well as JSON-LD, are no longer available**. However, these classes and components are still available in the old branch:
- [SearchService](https://github.com/robisim74/angular-l10n/blob/angular_v8/src/services/search.service.ts)
- [L10nJsonLdComponent](https://github.com/robisim74/angular-l10n/blob/angular_v8/src/components/l10n-json-ld.component.ts)

### Locale interceptor

This is no longer available. You can find the old class [here](https://github.com/robisim74/angular-l10n/blob/angular_v8/src/models/locale-interceptor.ts)

## Resources

- [README](https://github.com/robisim74/angular-l10n/blob/master/README.md)
- [Documentation](https://robisim74.github.io/angular-l10n/)
- [Sample app](https://github.com/robisim74/angular-l10n/tree/master/projects/angular-l10n-app)
- [Live example](https://stackblitz.com/edit/angular-l10n)
