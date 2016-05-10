/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from '@angular/core';
// Services.
import {LocalizationService, ServiceState} from '../services/localization.service';

/**
 * 'translate' pipe function.
 */
@Pipe({
    name: 'translate',
    pure: true
})

/**
 * TranslatePipe class.
 * 
 * Getting the message translation:
 * 
 * expression | translate:lang
 * 
 * where 'expression' is a string key that indicates the message to translate and 'lang' is the language code for the LocalizationService.
 * 
 * For example, to get the translation, add in the template:
 * 
 * {{ 'TITLE' | translate:lang }}
 * 
 * and include in the component:
 * 
 * import {LocalizationService} from 'angular2localization/angular2localization';
 * import {TranslatePipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *     ...
 *     pipes: [TranslatePipe]
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public localization: LocalizationService) {
 *         ...
 *     }
 * 
 *     // Gets the language code for the LocalizationService.
 *     get lang(): string {
 *
 *         return this.localization.languageCode;
 *      
 *     }
 * 
 * }
 * 
 * With Angular 2 I18nSelectPipe that displays the string that matches the current value:
 *
 * {{ expression | i18nSelect:mapping | translate:lang }}
 * 
 * With Angular 2 I18nPluralPipe that pluralizes the value properly:
 *
 * {{ expression | i18nPlural:mapping | translate:lang }}
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class TranslatePipe implements PipeTransform {

    constructor(public localization: LocalizationService) { }

    /**
     * TranslatePipe transform method.
     * 
     * @param key The key to be translated
     * @param lang The current language code for the LocalizationService
     * @return The value of translation
     */
    transform(key: string, lang: string): string {

        // Checks the service state.
        if (this.localization.serviceState == ServiceState.isReady) {

            // i18n: removes the value of template locale variable. 
            var formatKey: string = key.replace(/^\d+\b/, '');
            formatKey = formatKey.trim();

            // Gets the value of translation for the key.
            var value = this.localization.translate(formatKey);

            return key.replace(formatKey, value);

        }

    }

}