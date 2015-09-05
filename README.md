# Angular 2 Localization
> Angular 2 Localization is an implementation experiment of translation in the new Angular 2 applications using TypeScript.
> It works both through direct loading and asynchronous of translations.

## Use Localization class
- Create the `services` folder in the root of your Angular 2 application, and copy `localization.ts`.
- Include [js-cookie.js](https://github.com/js-cookie/js-cookie.git) library.
- Include `js-cookie.d.ts` TypeScript Definition from [tsd](https://github.com/DefinitelyTyped/tsd.git).
- Add in route component:
```TypeScript
@Component({
      selector: 'app',
      bindings: [Localization] 
})
...
class app {
     constructor(public localization: Localization){
     ...
 }
}
bootstrap(app, [HTTP_BINDINGS]);
```

### Direct loading
To inizialize localization by direct loading add the following code in the body of constructor of route component:
```TypeScript
var translationEN = {
      EXAMPLE: 'example',
      ...
}
// add a new translation here
 
this.localization.addTranslation('en', translationEN); // required (parameters: language, translation)
this.localization.addTranslation('it', translationIT);
// add a new language here 
this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
```
To get translation by direct loading add the following code in each component:
```TypeScript
translate(key) {
     return this.localization.translate(key);
}
```
and in the view:
```Html
<p>{{ translate('EXAMPLE') }}</p>
```

### Asynchronous loading
To inizialize localization by asynchronous loading add the following code in the body of constructor of route component:
```TypeScript
this.localization.addTranslation('en'); // required: add a new translations (parameter: a new language) 
this.localization.addTranslation('it');
// add a new language here 
this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider (parameter: path prefix)
```
and create the json files of translations such as `locale-en.json` (url is obtained concatenating {prefix} + {locale language code} + ".json").
To get translation by asynchronous loading add the following code in each component:
```TypeScript
translate(key) {
     return this.localization.asyncTranslate(key);
}
```
and in the view:
```Html
<p>{{ translate('EXAMPLE') }}</p>
```

### Change language
To change language at runtime, add in the component:
```TypeScript
selectLanguage(locale) {
     this.localization.setCurrentLanguage(locale);
}
```
where locale parameter is the language code; then add in the view:
```Html
<a (click)="selectLanguage('en')">English<</a>
...
```

To learn more, look at the example in this repository.
