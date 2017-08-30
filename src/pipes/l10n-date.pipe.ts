import { Pipe, PipeTransform } from '@angular/core';

import { IntlAPI } from '../services/intl-api';
import { IntlFormatter } from '../models/intl-formatter';
import { DateTimeOptions } from '../models/types';

/**
 * expression | l10nDate[:defaultLocale[:format[:timezone]]]
 *
 * Where:
 * - `expression` is a date object or a number (milliseconds since UTC epoch) or an ISO string.
 * - `format` indicates which date/time components to include. The format can be predefined as shown below:
 *   - `'short'`: equivalent to `'M/d/y, h:mm'` (e.g. `8/29/2017, 4:37 PM` for `en-US`)
 *   - `'medium'`: equivalent to `'MMM d, y, h:mm:ss'` (e.g. `Aug 29, 2017, 4:32:43 PM` for `en-US`)
 *   - `'shortDate'`: equivalent to `'M/d/y'` (e.g. `8/29/2017` for `en-US`)
 *   - `'mediumDate'`: equivalent to `'MMM d, y'` (e.g. `Aug 29, 2017` for `en-US`)
 *   - `'longDate'`: equivalent to `'MMMM d, y'` (e.g. `August 29, 2017` for `en-US`)
 *   - `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` (e.g. `Tuesday, August 29, 2017` for `en-US`)
 *   - `'shortTime'`: equivalent to `'h:mm'` (e.g. `4:53 PM` for `en-US`)
 *   - `'mediumTime'`: equivalent to `'h:mm:ss'` (e.g. `4:54:15 PM` for `en-US`)
 *
 *   Or it can be an object with some or all of the following properties:
 *      - `weekday` The representation of the weekday. Possible values are "narrow", "short", "long".
 *      - `era` The representation of the era. Possible values are "narrow", "short", "long".
 *      - `year` The representation of the year. Possible values are "numeric", "2-digit".
 *      - `month` The representation of the month. Possible values are "numeric", "2-digit", "narrow", "short", "long".
 *      - `day` The representation of the day. Possible values are "numeric", "2-digit".
 *      - `hour` The representation of the hour. Possible values are "numeric", "2-digit".
 *      - `minute` The representation of the minute. Possible values are "numeric", "2-digit".
 *      - `second` The representation of the second. Possible values are "numeric", "2-digit".
 *      - `timeZoneName` The representation of the time zone name. Possible values are "short", "long".
 *      - `hour12` Whether to use 12-hour time (as opposed to 24-hour time).
 *        Possible values are true and false; the default is locale dependent.
 */
@Pipe({
    name: 'l10nDate',
    pure: true
})
export class L10nDatePipe implements PipeTransform {

    private readonly ISO8601_DATE_REGEX: RegExp =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

    public transform(
        value: any,
        defaultLocale: string,
        format: string | DateTimeOptions = 'mediumDate',
        timezone?: string): string | null {

        if (value == null || value === "" || value !== value) return null;
        if (typeof defaultLocale === "undefined") return null;

        if (IntlAPI.hasDateTimeFormat()) {
            let date: Date;

            if (typeof value === "string") {
                value = value.trim();
            }

            if (this.isDate(value)) {
                date = value;
            } else if (!isNaN(value - parseFloat(value))) {
                date = new Date(parseFloat(value));
            } else if (typeof value === "string" && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
                const [y, m, d] = value.split('-').map((val: string) => parseInt(val, 10));
                date = new Date(y, m - 1, d);
            } else {
                date = new Date(value);
            }

            if (!this.isDate(date)) {
                let match: RegExpMatchArray | null;
                if ((typeof value === "string") && (match = value.match(this.ISO8601_DATE_REGEX))) {
                    date = this.isoStringToDate(match);
                }
            }

            return IntlFormatter.formatDate(date, defaultLocale, format, timezone);
        }
        // Returns the date without localization.
        return value;
    }

    private isDate(value: any): value is Date {
        return value instanceof Date && !isNaN(value.valueOf());
    }

    private isoStringToDate(match: RegExpMatchArray): Date {
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

}
