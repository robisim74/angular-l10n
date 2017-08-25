/**
 * Angular l10n
 * An Angular library to translate messages, dates and numbers
 * Copyright Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular-l10n
 *
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Pipe, PipeTransform } from '@angular/core';

import { IntlAPI } from '../services/intl-api';
import { DateFormatter } from '../models/intl';

const ISO8601_DATE_REGEX: RegExp =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

function isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.valueOf());
}

function isoStringToDate(match: RegExpMatchArray): Date {
    const date: Date = new Date(0);
    let tzHour: number = 0;
    let tzMin: number = 0;
    const dateSetter: Function = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter: Function = match[8] ? date.setUTCHours : date.setHours;

    if (match[9]) {
        tzHour = +(match[9] + match[10]);
        tzMin = +(match[9] + match[11]);
    }
    dateSetter.call(date, +(match[1]), +(match[2]) - 1, +(match[3]));
    const h: number = +(match[4] || '0') - tzHour;
    const m: number = +(match[5] || '0') - tzMin;
    const s: number = +(match[6] || '0');
    const ms: number = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
}

/**
 * expression | l10nDate[:defaultLocale[:format]]
 *
 * Where:
 * - `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string
 *   (https://www.w3.org/TR/NOTE-datetime).
 * - `format` indicates which date/time components to include. The format can be predefined as
 *   shown below or custom as shown in the table.
 *   - `'medium'`: equivalent to `'yMMMdjms'` (e.g. `Sep 3, 2010, 12:05:08 PM` for `en-US`)
 *   - `'short'`: equivalent to `'yMdjm'` (e.g. `9/3/2010, 12:05 PM` for `en-US`)
 *   - `'fullDate'`: equivalent to `'yMMMMEEEEd'` (e.g. `Friday, September 3, 2010` for `en-US`)
 *   - `'longDate'`: equivalent to `'yMMMMd'` (e.g. `September 3, 2010` for `en-US`)
 *   - `'mediumDate'`: equivalent to `'yMMMd'` (e.g. `Sep 3, 2010` for `en-US`)
 *   - `'shortDate'`: equivalent to `'yMd'` (e.g. `9/3/2010` for `en-US`)
 *   - `'mediumTime'`: equivalent to `'jms'` (e.g. `12:05:08 PM` for `en-US`)
 *   - `'shortTime'`: equivalent to `'jm'` (e.g. `12:05 PM` for `en-US`)
 *
 *
 *  | Component | Symbol | Narrow | Short Form   | Long Form                 | Numeric   | 2-digit    |
 *  |-----------|:------:|--------|--------------|---------------------------|-----------|------------|
 *  | era       |   G    | G (A)  | GGG (AD)     | GGGG (Anno Domini)        | -         | -          |
 *  | year      |   y    | -      | -            | -                         | y (2015)  | yy (15)    |
 *  | month     |   M    | L (S)  | MMM (Sep)    | MMMM (September)          | M (9)     | MM (09)    |
 *  | day       |   d    | -      | -            | -                         | d (3)     | dd (03)    |
 *  | weekday   |   E    | E (S)  | EEE (Sun)    | EEEE (Sunday)             | -         | -          |
 *  | hour      |   j    | -      | -            | -                         | j (13)    | jj (13)    |
 *  | hour12    |   h    | -      | -            | -                         | h (1 PM)  | hh (01 PM) |
 *  | hour24    |   H    | -      | -            | -                         | H (13)    | HH (13)    |
 *  | minute    |   m    | -      | -            | -                         | m (5)     | mm (05)    |
 *  | second    |   s    | -      | -            | -                         | s (9)     | ss (09)    |
 *  | timezone  |   z    | -      | -            | z (Pacific Standard Time) | -         | -          |
 *  | timezone  |   Z    | -      | Z (GMT-8:00) | -                         | -         | -          |
 *  | timezone  |   a    | -      | a (PM)       | -                         | -         | -          |
 */
@Pipe({
    name: 'l10nDate',
    pure: true
})
export class L10nDatePipe implements PipeTransform {

    public static _ALIASES: { [key: string]: string } = {
        'medium': 'yMMMdjms',
        'short': 'yMdjm',
        'fullDate': 'yMMMMEEEEd',
        'longDate': 'yMMMMd',
        'mediumDate': 'yMMMd',
        'shortDate': 'yMd',
        'mediumTime': 'jms',
        'shortTime': 'jm'
    };

    public transform(value: any, defaultLocale: string, pattern: string = 'mediumDate'): string | null {
        if (value == null || value === "" || value !== value) return null;
        if (typeof defaultLocale === "undefined") return null;

        if (IntlAPI.hasDateTimeFormat()) {
            let date: Date;

            if (typeof value === "string") {
                value = value.trim();
            }

            if (isDate(value)) {
                date = value;
            } else if (!isNaN(value - parseFloat(value))) {
                date = new Date(parseFloat(value));
            } else if (typeof value === "string" && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
                const [y, m, d] = value.split('-').map((val: string) => parseInt(val, 10));
                date = new Date(y, m - 1, d);
            } else {
                date = new Date(value);
            }

            if (!isDate(date)) {
                let match: RegExpMatchArray | null;
                if ((typeof value === "string") && (match = value.match(ISO8601_DATE_REGEX))) {
                    date = isoStringToDate(match);
                }
            }

            return DateFormatter.format(date, defaultLocale, L10nDatePipe._ALIASES[pattern] || pattern);
        }
        // Returns the date without localization.
        return value;
    }

}
