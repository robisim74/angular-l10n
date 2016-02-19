import {Component} from 'angular2/core';
// Services.
import {LocalizationPipe} from '../../services/localization-service';

@Component({
    selector: 'home-component',
    templateUrl: './app/home/home.component.html',
    pipes: [LocalizationPipe]
})

export class HomeComponent {

    private title: string;
    // Add a new property here.

    constructor() {

        // Example of key injection from the component.
        this.title = "HELLO"; // Sets the key.
        // Add a new key here.   
            
    }

}
