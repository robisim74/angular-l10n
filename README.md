# Angular 2 Localization
> A translation service for the new Angular 2 applications using TypeScript.
> Simple & fast.

## Sample application
Sample application that implements the translation service: [demo](http://robisim74.github.io/angular2localization)

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

## How to use the translation service
Include in your application:
* the `locale` and `localization` services;
* the `localization` pipe;

and register `LocaleService`, `LocalizationService` and `LocalizationPipe` in the route component:
```TypeScript
// Services.
import {LocaleService} from './services/locale.service'; // LocaleService class.
import {LocalizationService} from './services/localization.service'; // LocalizationService class.
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.

@Component({
     selector: 'app-component',
     ...
     providers: [LocaleService, LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
     pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})
 
export class AppComponent {

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        
        // Initializes the LocaleService. 
        this.locale.addLanguage('en'); // Required: adds a new language.
        this.locale.addLanguage('it');
        ...
        this.locale.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        
    }
 
}
```
Also add in the main:
```TypeScript
bootstrap(AppComponent, [HTTP_PROVIDERS]);
```

### Direct loading
To initialize the `LocalizationService` for the direct loading, add the following code in the body of the constructor of the route component:
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
```

### Asynchronous loading
To initialize the `LocalizationService` for the asynchronous loading add the following code in the body of the constructor of the route component:
```TypeScript
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
To change language at runtime, add in the route component:
```TypeScript
selectLanguage(language) {

     this.locale.setCurrentLanguage(language);
 
}
```
where `language` is the two-letter code of the language; then add in the view:
```
<a (click)="selectLanguage('en')">English</a>
...
```

## Advanced use with AsyncRoute
If you use an `AsyncRoute` in an extended application, you can create an instance of the `LocalizationService` for every asynchronously loaded component, as shown:
![AdvancedUse](https://github.com/robisim74/angular2localization/blob/master/AdvancedUse.jpg)
Each instance is different, and can be directly or asynchronously loaded, as in this example:
```TypeScript
export class AdvancedUseComponent {

    // Instantiates a new LocalizationService for this component and for its descendants.
    constructor(public localizationAdvancedUse: LocalizationService) {

        this.localizationAdvancedUse.translationProvider('./resources/locale-advanced-use-'); // Required: initializes the translation provider with the given path prefix.
            
    }

}
```
In this way, application performance and memory usage are optimized.

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