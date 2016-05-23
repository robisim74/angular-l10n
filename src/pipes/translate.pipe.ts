/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {NumberFormatStyle} from '@angular/common/src/facade/intl';

// Services.
import {LocalizationService, ServiceState} from '../services/localization.service';
import {LocaleService} from '../services/locale.service';
import {LocaleNumber} from '../services/locale-number';
import {IntlSupport} from '../services/Intl-support';

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

    constructor(public localization: LocalizationService, public locale: LocaleService) { }

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

            var REGEXP: RegExp = /^\d+\b/;
            var keyStr: string = key;

            // i18n plural.
            if (REGEXP.exec(key) != null) {

                // Tries to extract the number.
                var keyNum: number = parseInt(key);

                // Tries to extract the string. 
                keyStr = key.replace(REGEXP, '');
                keyStr = keyStr.trim();

                // Checks the number & support for Intl.
                if (!isNaN(keyNum) && IntlSupport.NumberFormat(this.locale.getDefaultLocale()) == true) {

                    // Localizes the number.
                    key = key.replace(/^\d+/, LocaleNumber.format(this.locale.getDefaultLocale(), keyNum, NumberFormatStyle.Decimal, '1.0-0'));

                }

            }

            // Gets the value of translation for the key string.
            var value = this.localization.translate(keyStr);

            return key.replace(keyStr, value);

        }

    }

}