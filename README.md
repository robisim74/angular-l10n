# Angular 2 Localization
> An Angular 2 library for i18n and l10n that implements a translation service - using TypeScript and SystemJS.

## Sample app
Sample application that implements the translation service: [demo](http://robisim74.github.io/angular2localization)

## Installation
You can add `angular2localization` to your project via [Node and npm](https://nodejs.org):
```
npm install --save angular2localization
```
To load the package you have two methods:
- Loading the bundle:
```Html
<!--loads angular2localization-->
<script src="node_modules/angular2localization/bundles/angular2localization.js"></script>
```
- Using SystemJS:
```Html
<!--configures SystemJS-->
<script>
    System.config({
        defaultJSExtensions: true,
        map: {
            'angular2localization': 'node_modules/angular2localization'
        }
    });
</script>
```

## Getting the translation
To get the translation, add in the template:
```Html
{{ 'TITLE' | translate }}
```
and in each component:
```TypeScript
@Component({
     ...
     pipes: [TranslatePipe]
})
```
With `I18n Select` that displays the string that matches the current value:
```Html
{{ gender | i18nSelect: inviteMapping | translate }}
```
With `I18n Plural` that pluralizes the value properly:
```Html
{{ messages.length | i18nPlural: messageMapping | translate }}
```

## Basic usage
Add in the route component in order to access the data of location from anywhere in the application:
```TypeScript
// Services.
import {LocaleService} from 'angular2localization/angular2localization'; // LocaleService class.
import {LocalizationService} from 'angular2localization/angular2localization'; // LocalizationService class.
// Pipes.
import {TranslatePipe} from 'angular2localization/angular2localization'; // TranslatePipe class.

@Component({
     selector: 'app-component',
     ...
     providers: [LocaleService, LocalizationService, TranslatePipe], // Localization providers: inherited by all descendants.
     pipes: [TranslatePipe] // Add in each component to invoke the transform method.
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
     TITLE: 'angular 2 localization',
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
and create the `json` files of the translations such as `locale-en.json`:
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

### Changing language
To change language at runtime, add in the route component:
```TypeScript
selectLanguage(language: string) {

     this.locale.setCurrentLanguage(language);
 
}
```
where `language` is the two-letter code of the language; then add in the view:
```Html
<a (click)="selectLanguage('en')">English</a>
...
```

## Advanced use with AsyncRoute
If you use an `AsyncRoute` in an extended application, you can create an instance of the `LocalizationService` for every asynchronously loaded component.
Each instance is different, and can be directly or asynchronously loaded, as in this example:
```TypeScript
export class I18nComponent {

    // Instantiates a new LocalizationService for this component and for its descendants.
    constructor(public localizationI18n: LocalizationService) {

        this.localizationI18n.translationProvider('./resources/locale-i18n-'); // Required: initializes the translation provider with the given path prefix.

    }

}
```
In this way, application performance and memory usage are optimized. See the [demo](http://robisim74.github.io/angular2localization) for a sample code.

##License
MIT