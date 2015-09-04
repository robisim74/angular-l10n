import {Component, View} from 'angular2/angular2';

import {Localization} from '../../services/localization'; // localization class

@Component({
    selector: 'home'
})
@View({
    templateUrl: './components/home/home.html'
})

export class home {

    title: string;
    // add a new property here

    constructor(public localization: Localization) { // inject an instance of localization in the constructor

        // example of key injection from the component
        this.title = "HELLO"; // set key
        // add a new key here   
            
    }
    
    // DIRECT LOADING
    // UNCOMMENT FOLLOWING CODE FOR DIRECT LOADING
    //// translation: direct loading
    //translate(key) {
    //
    //    return this.localization.translate(key);
    //
    //}
    
    // ASYNCHRONOUS LOADING
    // COMMENT FOLLOWING CODE IF DIRECT LOADING
    // translation: asynchronous loading  
    translate(key) {

        return this.localization.asyncTranslate(key);

    }   
        
}
