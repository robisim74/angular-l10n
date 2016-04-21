/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from 'angular2/core';
// Services.
import {LocaleService} from '../services/locale.service';
import {LocalizationService} from '../services/localization.service';

/**
 * translate pipe function.
 */
@Pipe({
    name: 'translate',
    pure: false // Required to update the value.
})

/**
 * TranslatePipe class. 
 * An instance of this class is created for each translate pipe function.
 * 
 * Getting the message translation:
 * 
 * expression | translate
 * 
 * where 'expression' is a string key that indicates the message to translate.
 * 
 * For example, to get the translation, add in the template:
 * 
 * {{ 'TITLE' | translate }}
 * 
 * and in the component:
 * 
 * @Component({
 *      ...
 *      pipes: [TranslatePipe]
 * })
 * 
 * With 'I18nSelectPipe' that displays the string that matches the current value:
 *
 * {{ gender | i18nSelect: inviteMapping | translate }}
 * 
 * With 'I18nPluralPipe' that pluralizes the value properly:
 *
 * {{ messages.length | i18nPlural: messageMapping | translate }}
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class TranslatePipe implements PipeTransform {

    /**
     * The language code for the translate pipe.
     */
    private languageCode: string;

    /**
     * The key of the translate pipe.
     */
    private key: string;

    /**
     * The value of the translation for the key.
     */
    private value: string;

    constructor(public locale: LocaleService, public localization: LocalizationService) { }

    /**
     * Translate pipe transform method.
     * 
     * @params key The key to be translated
     * @return The value of the translation
     */
    transform(key: string): string {

        // When the language changes, updates the language code and loads the translations data for the asynchronous loading.
        if (this.locale.getCurrentLanguage() != "" && this.locale.getCurrentLanguage() != this.localization.languageCode) {

            this.localization.updateTranslation();

        }

        // Checks the service state.
        if (this.localization.isReady) {

            // Updates the key & the value of the translation for the key if:
            // - the key has changed (i18n);
            // - the value is empty;
            // - the language has changed.
            if (this.key != key || this.value == "" || this.languageCode != this.localization.languageCode) {

                // i18n: remove the value of template locale variable. 
                var formatKey: string = key.replace(/^\d+\b/, '');
                formatKey = formatKey.trim();

                // Gets the value of the translation.
                this.localization.translate(formatKey).forEach(

                    // Next.
                    (value: string) => {

                        this.value = key.replace(formatKey, value);

                    }, null

                ).then(

                    () => {

                        // Updates the language code for the translate pipe.
                        this.languageCode = this.localization.languageCode;
                        // Updates the key of the translate pipe.
                        this.key = key;

                        return this.value;

                    });

            } else {

                // The value of the translation hasn't changed.
                return this.value;

            }

        } else {

            // The service isn't ready.
            return this.value;

        }

    }

}