/// <reference path="./typings/tsd.d.ts" />

import {Component, View, bootstrap, NgIf} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'http/http'; // http module

import {home} from './components/home/home';

import {Localization} from './services/localization'; // localization class

@Component({
    selector: 'app',
    bindings: [Localization] // localization binding: inherited by all descendants
})
@View({
    templateUrl: './app.html',
    directives: [home, NgIf]
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

bootstrap(app, [HTTP_BINDINGS]); // http bindings