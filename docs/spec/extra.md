# Extra

The new features of [Intl API](configuration.md#intl-api) are available through `LocalizationExtraModule`:

```TypeScript
@NgModule({
    imports: [
        ...
        LocalizationExtraModule
    ],
    ...
})
```

## Pure pipes
Pipe | Type | Format | Pipe syntax
---- | ---- | ------ | -----------
L10nTimeAgo | Relative time | Number/string | `expression | l10nTimeAgo[:defaultLocale[:unit[:format]]]`

### Relative time
```
expression | l10nTimeAgo[:defaultLocale[:unit[:format]]]
```
where:

- `expression` is a number or a string.
- `unit` possible values are: _year_, _quarter_, _month_, _week_, _day_, _hour_, _minute_, _second_
- `format` is a `RelativeTimeOptions` object with some or all of the following properties:

    - `numeric` The format of output message. Possible values are _always_, _auto_.
    - `style` The length of the internationalized message. Possible values are _long_, _short_, _narrow_.

    See [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat) for further information.

```Html
{{ value | l10nTimeAgo:defaultLocale:'second':{numeric:'always',style:'long'} }}
```

---

## Directives
Directive | Selectors
--------- | ---------
L10nTimeAgo | `l10nTimeAgo`

Directive | Type | Format | Html syntax
--------- | ---- | ------ | -----------
L10nTimeAgo | Relative time | Number/string | `<tag format="[format]" unit="[unit]" l10nTimeAgo>expr</tag>`

### Relative time
```Html
<p [format]="{numeric:'always',style:'long'}" unit="second" l10nTimeAgo>{{ timeAgo }}</p>
```

---

## Collator

`Collator` class has the following methods for sorting and filtering a list by locales:

* `sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]`
* `sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>`
* `search(s: string, list: any[], keyNames: any[], options?: any): any[]`
* `searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>`

These methods use the [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) object, a constructor for collators, objects that enable language sensitive string comparison.
