import {Component} from 'angular2/core';
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe';

@Component({
    selector: 'home-component',
    templateUrl: './app/home.component.html',
    pipes: [LocalizationPipe]
})

export class HomeComponent {

    private greeting: string;

    constructor() {

        // Example of key injection from the component.
        this.greeting = "GREETING"; // Sets the key.
            
    }

}
