# Collator

Import the module:
```TypeScript
@NgModule({
    imports: [
        ...
        CollatorModule // New instance of Collator.
    ],
    declarations: [ListComponent]
})
export class ListModule { }
```

---

`Collator` class has the following methods for sorting and filtering a list by locales:

* `sort(list: any[], keyName: any, order?: string, extension?: string, options?: any): any[]`
* `sortAsync(list: any[], keyName: any, order?: string, extension?: string, options?: any): Observable<any[]>`
* `search(s: string, list: any[], keyNames: any[], options?: any): any[]`
* `searchAsync(s: string, list: any[], keyNames: any[], options?: any): Observable<any[]>`

These methods use the [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) object, a constructor for collators, objects that enable language sensitive string comparison.
