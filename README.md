# Angular 2 Localization
> A translation service for the new Angular 2 applications using TypeScript.
> Simple & fast.

## Sample application
Sample application that implements the `localization` service: [demo](http://robisim74.github.io/angular2localization)

## Getting the translation
To get the translation, add in the template:
```
{{ 'TITLE' | translate }}
```
and in each component:
```TypeScript
@Component({
     ...
     pipes: [LocalizationPipe]
})
```

## How to use the localization service
Include in your application:
* the `localization` service;
* the `localization` pipe;

and register `LocalizationService` and `LocalizationPipe` in the route component:
```TypeScript
// Services.
import {LocalizationService} from './services/localization.service'; // LocalizationService class.
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.

@Component({
     selector: 'app-component',
     ...
     providers: [LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
     pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})
 
export class AppComponent {
 
     constructor(public localization: LocalizationService) {
         ...
     }
 
}
```
Also add in the main:
```TypeScript
bootstrap(AppComponent, [HTTP_PROVIDERS]);
```

### Direct loading
To inizialize the `LocalizationService` for the direct loading, add the following code in the body of the constructor of the route component:
```TypeScript
var translationEN = {
     TITLE: 'ANGULAR 2 LOCALIZATION',
     CHANGE_LANGUAGE: 'change language',
     ...
}
// Add a new translation here.
 
this.localization.addTranslation('en', translationEN); // Required: adds a new translation with the given language code.
this.localization.addTranslation('it', translationIT);
...
 
this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
```

### Asynchronous loading
To inizialize the `LocalizationService` for the asynchronous loading add the following code in the body of the constructor of the route component:
```TypeScript
this.localization.addTranslation('en'); // Required: adds a new language code.
this.localization.addTranslation('it');
...
 
this.localization.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If omitted, the cookie becomes a session cookie.
 
this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix. 
```
and create the json files of the translations such as `locale-en.json`:
```
{
    "TITLE": "angular 2 localization",
    "CHANGE_LANGUAGE": "change language",
    ...
}
```

### Special characters
You can use quotes inside a string, as long as they don't match the quotes surrounding the string:
```
"It wasn't a dream."
```
Because strings must be written within quotes, use the `\` escape character to insert special characters into the values of the translations:
```
"\"What's happened to me?\" he thought."
```

## Changing language
To change language at runtime, add in the component:
```TypeScript
selectLanguage(locale) {

     this.localization.setCurrentLanguage(locale);
 
}
```
where `locale` is the language code; then add in the view:
```
<a (click)="selectLanguage('en')">English</a>
...
```

## Running the sample app
What you need to run the sample app:
- this repository
- [Node and npm](https://nodejs.org) already installed.

In the command line, go to the directory that contains `index.html`:
```
npm install
gulp
```
You need a static server as [lite-server](https://github.com/johnpapa/lite-server):
```
npm install -g lite-server
lite-server
```
and then in a browser visit `localhost:3000/index.html`.