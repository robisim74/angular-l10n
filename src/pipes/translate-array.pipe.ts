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
import {LocalizationService, ServiceState} from '../services/localization.service';

/**
 * 'translatearray' pipe function.
 */
@Pipe({
    name: 'translatearray',
    pure: false // Required to update the value.
})

/**
 * TranslateArrayPipe class. 
 * An instance of this class is created for each 'translatearray' pipe function.
 * 
 * Getting the localized array:
 * 
 * *ngFor="let item of items | translatearray: {'keyname': {'pipe': '', 'format': '', 'symbolDisplay': bool, 'digitInfo': ''}
 * 
 * For example, to get the localized array, add in the template:
 * 
 * *ngFor="let item of items | translatearray: {'name': '', 
 *                                              'position': {
 *                                                 'pipe': 'translate'
 *                                                 },
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
 * and include TranslateArrayPipe in the component:
 * 
 * import {TranslateArrayPipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *      ...
 *      pipes: [TranslateArrayPipe]
 * })
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class TranslateArrayPipe extends LocaleNumber implements PipeTransform {

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
     * The language code for TranslateArrayPipe.
     */
    private languageCode: string;

    /**
     * The currency code for TranslateArrayPipe.
     */
    private currencyCode: string;

    /**
     * The default locale for TranslateArrayPipe.
     */
    private defaultLocale: string;

    /**
     * The stored list of TranslateArrayPipe.
     */
    private storedList: Array<any>;

    /**
     * The translated list.
     */
    private translatedList: Array<any>;

    /**
     * Sorting key.
     */
    private keyName: any;

    /**
     * 'asc' or 'desc'.
     */
    private order: string;

    /**
     * The value to search for.
     */
    private search: string;

    constructor(public locale: LocaleService, public localization: LocalizationService) {
        super();
    }

    /**
     * TranslateArrayPipe transform method.
     * 
     * @param list An array of objects or an array of arrays
     * @param args Params in Json format
     * @param keyName Sorting key. Not yet implemented
     * @param order 'asc' or 'desc'. Not yet implemented
     * @param search The value to search for. Not yet implemented
     * @return A new localized list
     */
    transform(list: Array<any>, args: any, keyName?: any, order?: string, search?: string): Array<any> {

        if (list == null || args == null) return null;

        // When the language changes, updates the language code and loads the translation data for the asynchronous loading.
        if (this.locale.getCurrentLanguage() != "" && this.locale.getCurrentLanguage() != this.localization.languageCode) {

            this.localization.updateTranslation();

        }

        // Checks the service state.
        if (this.localization.serviceState == ServiceState.isReady) {

            // Checks if list has changed.       
            var equals: boolean = this.compare(this.storedList, list);

            if ((equals == false
                || this.translatedList == null
                || this.languageCode != this.localization.languageCode
                || this.currencyCode != this.locale.getCurrentCurrency()
                || this.defaultLocale != this.locale.getDefaultLocale())) {
                
                // Saves the list.
                this.storedList = new Array<any>();
                this.storedList = list;

                // Updates the language code for TranslateArrayPipe.
                this.languageCode = this.localization.languageCode;
                // Updates the currency code for TranslateArrayPipe.
                this.currencyCode = this.locale.getCurrentCurrency();
                // Updates the default locale for TranslateArrayPipe.
                this.defaultLocale = this.locale.getDefaultLocale();

                // Creates a deep copy.
                var workList: Array<any> = new Array<any>();
                workList = this.deepCopy(list);

                var keys: string[] = Object.keys(list[0]); // Gets array keys.

                let i: number = 0;
                for (let key of keys) {

                    switch (args[key]['pipe']) {

                        case 'translate':
                            workList = this.tranlate(workList, key);
                            break;
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

            // TODO Sorting.

            // TODO Search.

        } else {

            // The service isn't ready.
            return this.translatedList;

        }

    }

    private supports(obj: any): boolean { return isDate(obj) || isNumber(obj); }

    private tranlate(workList: Array<any>, key: any): Array<any> {

        for (let item of workList) {

            // Gets the value of translation for the key.
            var value: string = this.localization.getValue(item[key]);
            // Replaces the value in the list.
            item[key] = value;

        }

        // Returns the same updated list. 
        return workList;

    }

    private toLocaleDate(workList: Array<any>, key: any, pattern: string = 'mediumDate'): Array<any> {

        for (let item of workList) {

            if (isBlank(item[key])) return null;

            if (!this.supports(item[key])) {

                throw new InvalidPipeArgumentException(TranslateArrayPipe, item[key]);

            }

            if (isNumber(item[key])) {

                item[key] = DateWrapper.fromMillis(item[key]);

            }

            if (StringMapWrapper.contains(TranslateArrayPipe.ALIASES, pattern)) {

                pattern = <string>StringMapWrapper.get(TranslateArrayPipe.ALIASES, pattern);

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

        if (x == null || y == null) return false; // An array is null.

        if (x.length != y.length) return false; // The length of arrays is different.

        // Gets arrays keys.
        var xKeys: string[] = Object.keys(x[0]);
        var yKeys: string[] = Object.keys(y[0]);

        if (xKeys != yKeys) return false; // The arrays keys are different.

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

