# Angular 2 Localization
> An injectable class to translate in the new Angular 2 apps using TypeScript.
> It works both through the direct and asynchronous loading of translations.

# Contents
* [How to use the class](#how-to-use-the-class)
    * [Direct loading](#direct-loading)
    * [Asynchronous loading](#asynchronous-loading)
    * [Get the translation](#get-the-translation)
    * [Change language](#change-language)
* [Running the sample app](#running-the-sample-app)

## How to use the class
- Create the `services` folder in the root of your Angular 2 application, and copy `localization.ts`.
- Add in the route component:
```TypeScript
@Component({
      selector: 'app-component',
      templateUrl: './app.component.html',
      providers: [Localization, LocalizationPipe], // Localization providers: inherited by all descendants.
      pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})
...
class AppComponent {
     constructor(public localization: Localization){
     ...
 }
}
bootstrap(AppComponent, [HTTP_PROVIDERS]);
```

### Direct loading
To inizialize the Localization class for the direct loading add the following code in the body of constructor of the route component:
```TypeScript
var translationEN = {
      EXAMPLE: 'example',
      ...
}
// Add a new translation here.
 
this.localization.addTranslation('en', translationEN); // Required: adds language and translation.
this.localization.addTranslation('it', translationIT);
// add a new language here 
this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
```

### Asynchronous loading
To inizialize the Localization class for the asynchronous loading add the following code in the body of constructor of the route component:
```TypeScript
this.localization.addTranslation('en'); // Required: adds a new translation.
this.localization.addTranslation('it');
// add a new language here 
this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the path prefix.
```
and create the json files of the translations such as `locale-en.json` (the URL is obtained concatenating {prefix} + {locale language code} + ".json").

### Get the translation
To get the translation through direct or asyncronous loading add in each component:
```TypeScript
@Component({
      ...
      pipes: [LocalizationPipe]
})
```
and in the template:
```Html
<p>{{ 'EXAMPLE' | translate }}</p>
```

### Change language
To change language at runtime, add in the component:
```TypeScript
selectLanguage(locale) {
     this.localization.setCurrentLanguage(locale);
}
```
where the `locale` parameter is the language code; then add in the view:
```Html
<a (click)="selectLanguage('en')">English<</a>
...
```

## Running the sample app
What you need to run this app:
- this repository
- [Node and npm](https://nodejs.org) already installed

In the command-prompt, go to the directory that contains `index.html`:
```
npm install

npm install -g http-server
http-server
```
and then in a browser, visit `localhost:8080/index.html`.