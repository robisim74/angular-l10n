# Angular 2 Localization
> Angular 2 Localization is an implementation experiment of translation in the new Angular 2 apps using TypeScript.
> It works both through direct and asynchronous loading of translations.

# Contents
* [The idea of Localization class](#the-idea-of-localization-class)
* [How to use the class](#how-to-use-the-class)
    * [Direct loading](#direct-loading)
    * [Asynchronous loading](#asynchronous-loading)
    * [Change language](#change-language)
* [Running the sample app](#running-the-sample-app)

## The idea of Localization class
When we have to translate an application, we need to transmit all changes at the views. In Angular 2, Dependency Injection helps us.
![LocalizationClassDI](http://www.seerobertodevelop.net/Content/Images/Blog/LocalizationClassDI.jpg)
In the injectable class `Localization` there are two fundamental properties:
```TypeScript
@Injectable() export class Localization {
    locale: string; // language code    
    translationsData: any = {}; // object of translations
    ...
}   
```
that contain respectively the locale language code and the translation data (as a object loaded directly or asynchronously).
In the route component, the Localization class is imported and injected:
```TypeScript
import {Localization} from './services/localization';

@Component({
      selector: 'app',
      bindings: [Localization] 
})
```
and instantiated:
```TypeScript
class app {
     constructor(public localization: Localization){
     
     // initialize localization: direct loading
     ...
}
```
So the class and its properties will be available in the route component and all his descendants.

When the application starts, every view binds to the `translate('KEY')` method of its component.
This method call `translate(key)` method of the Localization class:
```TypeScript
// get translation by direct loading
translate(key: string) {
    var translation: any = this.translationsData[this.locale]; // get translations by locale       
    var value: string = translation[key]; // get translated value by key
    return value;
}
```
and all views render `value` instead of `'KEY'`, at the same instant.

When the user selects a new language, the method below is called by the route component:
```TypeScript
setCurrentLanguage(locale: string) {
    ...     
        this.locale = locale; // set language code
    ...
}
```
and always instantly all views render the new values.

## How to use the class
- Create the `services` folder in the root of your Angular 2 application, and copy `localization.ts`.
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

## Running the sample app
What you need to run this app:
- This repository
- [Node and npm](https://nodejs.org) already installed

In the command-prompt, go to the directory that contains `index.html`:
```
npm install -g http-server
http-server
```
and then in a browser, visit `localhost:8080/index.html`.