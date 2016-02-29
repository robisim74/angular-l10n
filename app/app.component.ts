import {Component} from 'angular2/core';
// Services.
import {LocalizationService} from './services/localization.service'; // LocalizationService class.
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.
// Components.
import {HomeComponent} from './home.component';

@Component({
    selector: 'app-component',
    directives: [HomeComponent],
    templateUrl: './app/app.component.html', // A component cannot have both pipes and @View set at the same time.
    providers: [LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
    pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})

export class AppComponent {

    constructor(public localization: LocalizationService) {

        // Initializes the LocalizationService: asynchronous loading.               
        this.localization.addTranslation('en'); // Required: adds a new language code.
        this.localization.addTranslation('it');
        
        this.localization.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        
        this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.
                       
    }

    // Gets the current language.
    currentLanguage(): string {

        return this.localization.getCurrentLanguage();

    }
    
    // Sets a new language.
    selectLanguage(locale) {

        this.localization.setCurrentLanguage(locale);

    }

}
