/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// Services.
import { LocalizationService, ServiceState } from '../services/localization.service';
import { LocaleService } from '../services/locale.service';
import { IntlSupport } from '../services/Intl-support';

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
export class TranslatePipe implements PipeTransform {

    constructor(public localization: LocalizationService, public locale: LocaleService) { }

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

            var REGEXP: RegExp = /^\d+\b/;
            var keyStr: string = key;

            // i18n plural.
            if (REGEXP.exec(key) != null) {

                // Tries to extract the number.
                var keyNum: number = parseFloat(key);

                // Tries to extract the string. 
                keyStr = key.replace(REGEXP, "");
                keyStr = keyStr.trim();

                // Checks the number & support for Intl.
                if (!isNaN(keyNum) && IntlSupport.NumberFormat(this.locale.getDefaultLocale()) == true) {

                    var localeDecimal: DecimalPipe = new DecimalPipe(this.locale.getDefaultLocale());

                    // Localizes the number.
                    key = key.replace(/^\d+/, localeDecimal.transform(keyNum, '1.0-3'));

                }

            }

            // Gets the value of translation for the key string.
            var value: string = this.localization.translate(keyStr, args[0], lang);

            return key.replace(keyStr, value);

        }

        return "";

    }

}
