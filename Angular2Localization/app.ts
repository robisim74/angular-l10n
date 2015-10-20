import {Component, View, bootstrap, NgIf} from 'angular2/angular2';
import {HTTP_PROVIDERS} from 'angular2/http'; // http module

import {home} from './components/home/home';

import {Localization, LocalizationPipe} from './services/localization'; // localization class & pipe

@Component({
    selector: 'app',
    templateUrl: './app.html', // component cannot have both pipes and @View set at the same time
    directives: [home, NgIf],
    providers: [Localization, LocalizationPipe], // localization providers: inherited by all descendants
    pipes: [LocalizationPipe] // add in each component to invoke the transform method
})

class app {

    constructor(public localization: Localization) { // inject an instance of localization in the constructor
        
        // DIRECT LOADING
        // UNCOMMENT FOLLOWING CODE FOR DIRECT LOADING
        //// initialize localization: direct loading
        //// translations data
        // var translationEN = {
        //    TITLE: 'ANGULAR 2 LOCALIZATION',
        //    CHANGE_LANGUAGE: 'change language',
        //    HELLO: 'hello',
        //    SUBTITLE: "direct loading",
        //    DESCRIPTION: "this translation has been directly loaded"
        //}
        //var translationIT = {
        //    TITLE: 'ANGULAR 2 LOCALIZZAZIONE',
        //    CHANGE_LANGUAGE: 'cambia lingua',
        //    HELLO: 'ciao',
        //    SUBTITLE: "carimento diretto",
        //    DESCRIPTION: "questa traduzione è stata caricata direttamente"
        //}
        //// add a new translation here 
        //     
        //this.localization.addTranslation('en', translationEN); // required (parameters: language, translation)
        //this.localization.addTranslation('it', translationIT);  
        //// add a new language here  
        //this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
        //// end localization
        
        // ASYNCHRONOUS LOADING
        // COMMENT FOLLOWING CODE IF DIRECT LOADING
        // initialize localization: asynchronous loading               
        this.localization.addTranslation('en'); // required: add a new translations (parameter: a new language)
        this.localization.addTranslation('it');
        // add a new language here
        this.localization.definePreferredLanguage('en', 30); // required: define preferred language (parameter: default language, expires (No days) - if omitted, the cookie becomes a session cookie)
        this.localization.translationProvider('./resources/locale-'); // required: initialize translation provider (parameter: path prefix)
        // end localization
                
    }
	
    // CHANGE LANGUAGE
    // return the current language
    currentLanguage() {

        return this.localization.getCurrentLanguage();

    }
    
    // select language
    selectLanguage(locale) {

        this.localization.setCurrentLanguage(locale);

    }
    // end change language

}

bootstrap(app, [HTTP_PROVIDERS]); // http providers