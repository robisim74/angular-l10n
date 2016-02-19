import {Component} from 'angular2/core';
// Services.
import {LocalizationService, LocalizationPipe} from '../services/localization-service'; // LocalizationService class & LocalizationPipe.
// Components.
import {HomeComponent} from './home/home.component';

@Component({
    selector: 'app-component',
    templateUrl: './app/app.component.html', // A component cannot have both pipes and @View set at the same time.
    directives: [HomeComponent],
    providers: [LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
    pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})

export class AppComponent {

    constructor(public localization: LocalizationService) { // Injects an instance of the LocalizationService class in the constructor.
        
        // DIRECT LOADING
        // UNCOMMENT FOLLOWING CODE FOR DIRECT LOADING
        //// Initializes the LocalizationService class: direct loading.
        //// Translations data.
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
        //    SUBTITLE: "caricamento diretto",
        //    DESCRIPTION: "questa traduzione è stata caricata direttamente"
        //}
        //// Add a new translation here. 
        //     
        //this.localization.addTranslation('en', translationEN); // Required: adds language and translation.
        //this.localization.addTranslation('it', translationIT);  
        //// add a new language here  
        //this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
        //// End localization.
        
        // ASYNCHRONOUS LOADING
        // COMMENT FOLLOWING CODE IF DIRECT LOADING
        // Initializes the LocalizationService class: asynchronous loading.               
        this.localization.addTranslation('en'); // Required: adds a new translation.
        this.localization.addTranslation('it');
        // Add a new language here.
        this.localization.definePreferredLanguage('en', 30); // Required: defines preferred language and expiry (No days). If omitted, the cookie becomes a session cookie.
        this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the path prefix.
        // End localization.
                
    }
	
    // CHANGE LANGUAGE
    // Returns the current language.
    currentLanguage(): string {

        return this.localization.getCurrentLanguage();

    }
    
    // Sets a new language.
    selectLanguage(locale) {

        this.localization.setCurrentLanguage(locale);

    }
    // End change language.

}
