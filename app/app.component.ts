import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {RouteConfig, AsyncRoute, Location, ROUTER_DIRECTIVES} from 'angular2/router';
// Services.
import {LocaleService} from './services/locale.service'; // LocaleService class.
import {LocalizationService} from './services/localization.service'; // LocalizationService class.
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe'; // LocalizationPipe class.
// Components.
import {HomeComponent} from './home.component';
import {AdvancedUseComponent} from './advanced-use.component';

@Component({
    selector: 'app-component',
    directives: [ROUTER_DIRECTIVES, NgClass],
    templateUrl: './app/app.component.html', // A component cannot have both pipes and @View set at the same time.
    providers: [LocaleService, LocalizationService, LocalizationPipe], // Localization providers: inherited by all descendants.
    pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})

@RouteConfig([
    new AsyncRoute({ path: '/', loader: () => Promise.resolve(HomeComponent), name: 'Home', useAsDefault: true }),
    new AsyncRoute({ path: '/advanced-use', loader: () => Promise.resolve(AdvancedUseComponent), name: 'AdvancedUse' })
])

export class AppComponent {

    constructor(public locale: LocaleService, public localization: LocalizationService, public location: Location) {
        
        // Initializes the LocaleService & LocalizationService: asynchronous loading.           
        this.locale.addLanguage('en'); // Required: adds a new language.
        this.locale.addLanguage('it');

        this.locale.definePreferredLanguage('en', 30); // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
                
        this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.

    }

    // Gets the current language.
    get currentLanguage(): string {

        return this.locale.getCurrentLanguage();

    }
    
    // Sets a new language.
    selectLanguage(language) {

        this.locale.setCurrentLanguage(language);

    }

}
