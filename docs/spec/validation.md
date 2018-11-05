# Validation by locales

Import the modules you need in the application root module:
```TypeScript
@NgModule({
    imports: [
        ...
        LocalizationModule.forRoot(l10nConfig),
        LocaleValidationModule.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## Validating a number
Directive | Selectors
--------- | ---------
`L10nNumberValidator` | `l10nValidateNumber`

Directive | Validator | Options | Errors
--------- | --------- | ------- | ------
`L10nNumberValidator` | `digits=[digitInfo]` | `[minValue]` `[maxValue]` | `format` or `minValue` or `maxValue`

where `digitInfo` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`, and `minValue` and `maxValue` attributes are optional:
```Html
<input digits="1.2-2" minValue="0" maxValue="1000" name="decimal" [(ngModel)]="decimal" l10nValidateNumber>
```
or, if you use variables:
```Html
<input [digits]="digits" [minValue]="minValue" [maxValue]="maxValue" name="decimal" [(ngModel)]="decimal" l10nValidateNumber>
```

The number can be entered with or without the thousands separator.

### Parsing a number
When the number is valid, you can get its value by the `parseNumber` method of `LocaleValidation`:
```TypeScript
parsedValue: number = null;

constructor(private localeValidation: LocaleValidation) { }

onSubmit(value: string): void {
    this.parsedValue = this.localeValidation.parseNumber(value);
}
```

### FormBuilder
If you use `FormBuilder`, you have to invoke the following function:
```TypeScript
l10nValidateNumber(digits: string, MIN_VALUE?: number, MAX_VALUE?: number): Function
```
