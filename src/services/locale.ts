/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

// Services.
import {LocaleService} from './locale.service';
import {LocalizationService} from '../services/localization.service';

/**
 * Locale superclass.
 * 
 * Extend this class in components to provide the necessary methods for localization:
 * 
 * export class AppComponent extends Locale {
 *
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 *         super(locale, localization);
 *
 *     }
 *
 * } 
 * 
 * @author Roberto Simonetti
 */
export class Locale {

    constructor(public locale?: LocaleService, public localization?: LocalizationService) { }

    // Gets the language code for the LocalizationService.
    get lang(): string {

        return this.localization.languageCode;

    }

    // Gets the default locale.
    get defaultLocale(): string {

        return this.locale.getDefaultLocale();

    }

    // Gets the current currency.
    get currency(): string {

        return this.locale.getCurrentCurrency();

    }

}