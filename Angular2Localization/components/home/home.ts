import {Component, View} from 'angular2/angular2';

import {LocalizationPipe} from '../../services/localization'; // localization pipe

@Component({
    selector: 'home',
    templateUrl: './components/home/home.html',
    pipes: [LocalizationPipe] // add in each component to invoke the transform method
})

export class home {

    title: string;
    // add a new property here

    constructor() {

        // example of key injection from the component
        this.title = "HELLO"; // set key
        // add a new key here   
            
    }
        
}
