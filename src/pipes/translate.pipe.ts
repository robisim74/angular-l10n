/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Pipe, PipeTransform } from '@angular/core';

// Services.
import { LocalizationService, ServiceState } from '../services/localization.service';
import { LocaleService } from '../services/locale.service';
import { I18nPlural } from '../services/i18n';

/**
 * 'translate' pipe function.
 */
@Pipe({
    name: 'translate',
    pure: true
})

/**
 * TranslatePipe class.
 * Translates messages.
 * 
 * @author Roberto Simonetti
 */
export class TranslatePipe extends I18nPlural implements PipeTransform {

    constructor(public localization: LocalizationService, public locale: LocaleService) {
        super(locale);
    }

    /**
     * TranslatePipe transform method.
     * 
     * @param key The key to be translated
     * @param lang The current language code for the LocalizationService
     * @param args Optional parameters
     * @return The value of translation
     */
    public transform(key: string, lang: string, ...args: Array<any>): string {

        // Checks the service state.
        if (this.localization.serviceState == ServiceState.isReady) {

            // Looks for a number at the beginning of the key. 
            key = this.translateNumber(key);

            // Gets the value of translation for the key string.
            var value: string = this.localization.translate(this.keyStr, args[0], lang);

            return key.replace(this.keyStr, value);

        }

        // If the service is not ready, returns an empty string.
        return "";

    }

}
