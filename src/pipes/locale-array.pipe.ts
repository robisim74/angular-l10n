/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {isDate, isNumber, isPresent, DateWrapper, isBlank} from '@angular/common/src/facade/lang';
import {DateFormatter, NumberFormatStyle} from '@angular/common/src/facade/intl';
import {StringMapWrapper} from '@angular/common/src/facade/collection';
import {InvalidPipeArgumentException} from '@angular/common/src/pipes/invalid_pipe_argument_exception';

// Services.
import {LocaleNumber} from '../services/locale-number';
import {LocaleService} from '../services/locale.service';

/**
 * 'localearray' pipe function.
 */
@Pipe({
    name: 'localearray',
    pure: false // Required to update the value.
})

/**
 * LocaleArrayPipe class. 
 * An instance of this class is created for each 'localearray' pipe function.
 * 
 * Getting the localized array:
 * 
 * *ngFor="let item of items | localearray: {'keyname': {'pipe': '', 'format': '', 'symbolDisplay': bool, 'digitInfo': ''}
 * 
 * For example, to get the localized array, add in the template:
 * 
 * *ngFor="let item of items | translatearray: {'name': '', 
 *                                              'position': '',
 *                                              'salary': {
 *                                                 'pipe': 'localecurrency', 
 *                                                 'symbolDisplay': true, 
 *                                                 'digits': '1.0-0'
 *                                                 },
 *                                              'startDate': {
 *                                                 'pipe': 'localedate', 
 *                                                 'format': 'mediumDate'
 *                                                 }
 *                                             }"
 * 
 * and include LocaleArrayPipe in the component:
 * 
 * import {LocaleArrayPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *      ...
 *      pipes: [LocaleArrayPipe]
 * })
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocaleArrayPipe extends LocaleNumber implements PipeTransform {

    static ALIASES: { [key: string]: String } = {
        'medium': 'yMMMdjms',
        'short': 'yMdjm',
        'fullDate': 'yMMMMEEEEd',
        'longDate': 'yMMMMd',
        'mediumDate': 'yMMMd',
        'shortDate': 'yMd',
        'mediumTime': 'jms',
        'shortTime': 'jm'
    };

    /**
     * The currency code for LocaleArrayPipe.
     */
    private currencyCode: string;

    /**
     * The default locale for LocaleArrayPipe.
     */
    private defaultLocale: string;

    /**
     * The stored list of LocaleArrayPipe.
     */
    private storedList: Array<any>;

    /**
     * The translated list.
     */
    private translatedList: Array<any>;

    constructor(public locale: LocaleService) {
        super();
    }

    /**
     * LocaleArrayPipe transform method.
     * 
     * @param list An array of objects or an array of arrays
     * @param args Params in Json format
     * @return A new localized list
     */
    transform(list: Array<any>, args: any): Array<any> {
        
        if (list == null || args == null) return null;

            // Checks if list has changed.       
            var equals: boolean = this.compare(this.storedList, list);

            if ((equals == false
                || this.translatedList == null
                || this.currencyCode != this.locale.getCurrentCurrency()
                || this.defaultLocale != this.locale.getDefaultLocale())) {

                // Saves the list.
                this.storedList = new Array<any>();
                this.storedList = list;

                // Updates the currency code for LocaleArrayPipe.
                this.currencyCode = this.locale.getCurrentCurrency();
                // Updates the default locale for LocaleArrayPipe.
                this.defaultLocale = this.locale.getDefaultLocale();

                // Creates a deep copy.
                var workList: Array<any> = new Array<any>();
                workList = this.deepCopy(list);

                var keys: string[] = Object.keys(list[0]); // Gets array keys.

                let i: number = 0;
                for (let key of keys) {

                    switch (args[key]['pipe']) {

                        case 'localedate':
                            workList = this.toLocaleDate(workList, key, args[key]['format']);
                            break;
                        case 'localedecimal':
                            workList = this.toLocaleDecimal(workList, key, args[key]['digitInfo']);
                            break;
                        case 'localepercent':
                            workList = this.toLocalePercent(workList, key, args[key]['digitInfo']);
                            break;
                        case 'localecurrency':
                            workList = this.toLocaleCurrency(workList, key, args[key]['symbolDisplay'], args[key]['digitInfo']);
                            break;

                    }

                    i++;

                }

                // Assigns translatedList.
                this.translatedList = new Array<any>();
                this.translatedList = workList;

            }

            return this.translatedList;

    }

    private supports(obj: any): boolean { return isDate(obj) || isNumber(obj); }

    private toLocaleDate(workList: Array<any>, key: any, pattern: string = 'mediumDate'): Array<any> {

        for (let item of workList) {

            if (isBlank(item[key])) return null;

            if (!this.supports(item[key])) {

                throw new InvalidPipeArgumentException(LocaleArrayPipe, item[key]);

            }

            if (isNumber(item[key])) {

                item[key] = DateWrapper.fromMillis(item[key]);

            }

            if (StringMapWrapper.contains(LocaleArrayPipe.ALIASES, pattern)) {

                pattern = <string>StringMapWrapper.get(LocaleArrayPipe.ALIASES, pattern);

            }

            // Gets the locale date.
            var value: string = DateFormatter.format(item[key], this.defaultLocale, pattern);
            // Replaces the value in the list.
            item[key] = value;

        }

        // Returns the same updated list. 
        return workList;

    }

    private toLocaleDecimal(workList: Array<any>, key: any, digits: string = null): Array<any> {

        for (let item of workList) {

            // Gets the locale decimal.
            var value: string = LocaleNumber.format(this.defaultLocale, item[key], NumberFormatStyle.Decimal, digits);
            // Replaces the value in the list.
            item[key] = value;

        }

        // Returns the same updated list. 
        return workList;

    }

    private toLocalePercent(workList: Array<any>, key: any, digits: string = null): Array<any> {

        for (let item of workList) {

            // Gets the locale percent.
            var value: string = LocaleNumber.format(this.defaultLocale, item[key], NumberFormatStyle.Percent, digits);
            // Replaces the value in the list.
            item[key] = value;

        }

        // Returns the same updated list. 
        return workList;

    }

    private toLocaleCurrency(workList: Array<any>, key: any, symbolDisplay: boolean = false, digits: string = null): Array<any> {

        for (let item of workList) {

            // Gets the locale currency.
            var value: string = LocaleNumber.format(this.defaultLocale, item[key], NumberFormatStyle.Currency, digits, this.currencyCode, symbolDisplay);
            // Replaces the value in the list.
            item[key] = value;

        }

        // Returns the same updated list. 
        return workList;

    }

    private compare(x: Array<any>, y: Array<any>): boolean {

        if (x == null || y == null) return false; // One array is null.

        if (x.length != y.length) return false; // The length of arrays is different.

        // Gets arrays keys.
        var xKeys: string[] = Object.keys(x[0]);
        var yKeys: string[] = Object.keys(y[0]);

        if (xKeys.length != yKeys.length) return false; // The arrays keys are different.

        for (var i: number; i < x.length; i++) {

            for (var j: number; j < xKeys.length; i++) {

                if (x[i][j] != y[i][j]) {

                    return false;

                }

            }

        }

        return true; // The arrays are equal.
    }

    private deepCopy(x: Array<any>): Array<any> {

        var y: Array<any> = new Array<any>();

        var keys: string[] = Object.keys(x[0]); // Gets array keys.

        for (let item of x) {

            var copyOfItem: any = {};
            for (let key of keys) {

                copyOfItem[key] = item[key];

            }
            y.push(copyOfItem);

        }

        return y;

    }

}