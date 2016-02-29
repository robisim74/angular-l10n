/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */

import {Injectable} from 'angular2/core';
import {Pipe, PipeTransform} from 'angular2/core';
// Services.
import {LocalizationService} from '../services/localization.service';

/**
 * Translate pipe function.
 */
@Pipe({
    name: 'translate',
    pure: false // Required to update the value.
})

/**
 * Localization pipe class.
 * An instance is created for each key. 
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocalizationPipe implements PipeTransform {

    /**
     * The language code for the key.
     */
    private locale: string;

    /**
     * The value of the translation for the key.
     */
    private value: string;

    constructor(public localization: LocalizationService) { }

    /**
     * Translate pipe transform method.
     * 
     * @params key The key to be translated
     * @return The value of the translation
     */
    transform(key: string): string {

        // Checks the service state.
        if (this.localization.isReady) {

            // Updates the value of the translation if it's empty or if the language is changed.
            if (this.value == "" || this.locale != this.localization.getCurrentLanguage()) {

                // Gets the value of the translation.
                this.localization.translate(key).forEach(
                    
                    // Next.
                    (value: string) => {

                        this.value = value;

                    }, null

                ).then(

                    () => {
                        
                        // Updates the language code for the key.
                        this.locale = this.localization.getCurrentLanguage();

                        return this.value;

                    });

            } else {
                
                // The value of the translation isn't changed.
                return this.value;

            }

        } else {
            
            // The service isn't ready.
            return this.value;

        }

    }

}