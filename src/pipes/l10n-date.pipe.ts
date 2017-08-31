import { Pipe, PipeTransform } from '@angular/core';

import { IntlAPI } from '../services/intl-api';
import { IntlFormatter } from '../models/intl-formatter';
import { DateTimeOptions } from '../models/types';

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
