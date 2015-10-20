# Angular 2 Localization
> Angular 2 Localization is an implementation experiment of translation in the new Angular 2 apps using TypeScript.
> It works both through direct and asynchronous loading of translations.

# Contents
* [How to use the class](#how-to-use-the-class)
    * [Direct loading](#direct-loading)
    * [Asynchronous loading](#asynchronous-loading)
    * [Get translation](#get-translation)
    * [Change language](#change-language)
* [Running the sample app](#running-the-sample-app)

## How to use the class
- Create the `services` folder in the root of your Angular 2 application, and copy `localization.ts`.
- Add in route component:
```TypeScript
@Component({
      selector: 'app',
      templateUrl: './app.html', // component cannot have both pipes and @View set at the same time
      providers: [Localization, LocalizationPipe], // localization providers: inherited by all descendants
      pipes: [LocalizationPipe] // add in each component to invoke the transform method
})
...
class app {
     constructor(public localization: Localization){
     ...
 }
}
bootstrap(app, [HTTP_PROVIDERS]);
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

### Get translation
To get translation by direct or asyncronous loading add in each component:
```TypeScript
@Component({
      ...
      pipes: [LocalizationPipe] // add in each component to invoke the transform method
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
where locale parameter is the language code; then add in the view:
```Html
<a (click)="selectLanguage('en')">English<</a>
...
```

## Running the sample app
What you need to run this app:
- This repository
- [Node and npm](https://nodejs.org) already installed

In the command-prompt, go to the directory that contains `index.html`:
```
npm install

npm install -g http-server
http-server
```
and then in a browser, visit `localhost:8080/index.html`.