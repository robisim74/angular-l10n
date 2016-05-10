/**
 * ANGULAR 2 MAPS
 * Google Maps JavaScript API in the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2maps
 */

import {LocaleService} from './locale.service';
import {LocalizationService} from '../services/localization.service';

/**
 * Locale superclass.
 * 
 * Extend this class in components to provide the necessary methods to localization:
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

    // Gets the current locale.
    get defaultLocale(): string {

        return this.locale.getDefaultLocale();

    }

    // Gets the current currency.
    get currency(): string {

        return this.locale.getCurrentCurrency();

    }

}