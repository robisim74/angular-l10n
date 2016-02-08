import {Component} from 'angular2/core';

import {LocalizationPipe} from '../../services/localization'; // Localization pipe.

@Component({
    selector: 'home-component',
    templateUrl: './components/home/home.component.html',
    pipes: [LocalizationPipe] // Add in each component to invoke the transform method.
})

export class HomeComponent {

    title: string;
    // Add a new property here.

    constructor() {

        // Example of key injection from the component.
        this.title = "HELLO"; // Sets the key.
        // Add a new key here.   
            
    }

}
