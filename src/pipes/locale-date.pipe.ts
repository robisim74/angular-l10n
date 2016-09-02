/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

// Services.
import { IntlSupport } from '../services/Intl-support';

/**
 * 'localedate' pipe function.
 */
@Pipe({
    name: 'localeDate',
    pure: true
})

/**
 * LocaleDatePipe class.
 * Localizes dates.
 * 
 * Getting the local date:
 * 
 * expression | localedate[:defaultLocale[:format]]
 * 
 * where 'expression' is a date object or a number (milliseconds since UTC epoch) and 'format' indicates which date/time components to include.
 * 
 * For example, to get the local date, add in the template:
 * 
 * {{ today | localedate:defaultLocale:'fullDate' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 * ...
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 *         ...
 *     }
 * 
 *     // Gets the default locale.
 *     get defaultLocale(): string {
 *
 *         return this.locale.getDefaultLocale();
 *      
 *     }
 * 
 * }
 * 
 * @author Roberto Simonetti
 * @see Angular 2 DatePipe for further information
 */
export class LocaleDatePipe implements PipeTransform {

    /**
     * LocaleDatePipe transform method.
     * 
     * @param value The date to be localized
     * @param defaultLocale The default locale
     * @param pattern The format of the date
     * @return The locale date
     */
    public transform(value: any, defaultLocale: string, pattern: string = 'mediumDate'): string {

        // Checks for support for Intl.
        if (IntlSupport.DateTimeFormat(defaultLocale) == true) {

            var localeDate: DatePipe = new DatePipe(defaultLocale);

            return localeDate.transform(value, pattern);

        }

        // Returns the date without localization.
        return value;

    }

}
