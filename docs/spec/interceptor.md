# Setting the locale in _Accept-Language_ header

Import the module in the application root module:
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

To set the locale in _Accept-Language_ header on all outgoing requests, provide the `localeInterceptor` option during the configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    localeInterceptor: {
        format: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */]
    }
};
```
