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
`L10nNumberValidator` | `digits=[digits]` | `[minValue]` `[maxValue]` | `format` or `minValue` or `maxValue`

where `digits` has the following format: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`, and `minValue` and `maxValue` attributes are optional:
```Html
<input digits="1.2-2" minValue="0" maxValue="1000" name="decimal" [(ngModel)]="decimal" l10nValidateNumber>
```
or, if you use variables:
```Html
<input [digits]="digits" [minValue]="minValue" [maxValue]="maxValue" name="decimal" [(ngModel)]="decimal" l10nValidateNumber>
```

The number can be entered with or without the thousands separator.

### Parsing a number
You can get the value of a localized number by the `parseNumber` method of `LocaleValidation`:
```TypeScript
parsedValue: number = null;

constructor(private localeValidation: LocaleValidation) { }

onSubmit(value: string): void {
    this.parsedValue = this.localeValidation.parseNumber(value);
}
```

### FormBuilder
If you use `FormBuilder`, you have to use the following validator function:
```TypeScript
l10nValidateNumber(digits: string, MIN_VALUE?: number, MAX_VALUE?: number): Function
```

Defining a form:
```TypeScript
this.myForm = this.fb.group({
  weight: ['', [ l10nValidateNumber('1.0-1') ]],
  height: ['', [ l10nValidateNumber('1.0-0', 50, 260) ]]
});
```

On submit parse the values using `parseNumber`:
```TypeScript
const formValues = this.myForm.value;

this.weight = this.localeValidation.parseNumber(formValues.weight);
this.height = this.localeValidation.parseNumber(formValues.height);
```

When first populating form data you have to format numbers before calling `patchValue`:
```TypeScript
const formValues = {
  weight: this.locale.formatDecimal(weight, '1.0-1'),
  height: this.locale.formatDecimal(height, '1.0-0')
}
this.myForm.patchValue(formValues);
```
