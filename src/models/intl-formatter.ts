import { IntlAPI } from '../services/intl-api';
import { NumberFormatStyle, DateFormatterFn, DateTimeOptions, DigitsOptions } from './types';

function intlDateTimeFormat(
    date: Date,
    defaultLocale: string,
    options: Intl.DateTimeFormatOptions,
    timezone?: string
): string {
    options.timeZone = IntlAPI.hasTimezone() ? timezone : 'UTC';

    return new Intl.DateTimeFormat(defaultLocale, options).format(date).replace(/[\u200e\u200f]/g, "");
}

function datePartFactory(options: Intl.DateTimeFormatOptions): DateFormatterFn {
    const dateFactory: (date: Date, defaultLocale: string, timezone?: string) => string =
        (date: Date, defaultLocale: string, timezone?: string): string =>
            intlDateTimeFormat(date, defaultLocale, options, timezone);
    return dateFactory;
}

function combine(options: Intl.DateTimeFormatOptions[]): Intl.DateTimeFormatOptions {
    const reducedOptions: Intl.DateTimeFormatOptions = options.reduce(
        (merged: Intl.DateTimeFormatOptions, opt: Intl.DateTimeFormatOptions) => ({ ...merged, ...opt }), {}
    );
    return reducedOptions;
}

function digitCondition(prop: string, len: number): Intl.DateTimeFormatOptions {
    const result: { [k: string]: string } = {};
    result[prop] = len === 2 ? '2-digit' : 'numeric';
    return result;
}

function nameCondition(prop: string, len: number): Intl.DateTimeFormatOptions {
    const result: { [k: string]: string } = {};
    if (len < 4) {
        result[prop] = len > 1 ? 'short' : 'narrow';
    } else {
        result[prop] = 'long';
    }
    return result;
}

const FORMAT_ALIASES: { [format: string]: DateFormatterFn } = {
    'short': datePartFactory(
        combine([
            digitCondition('year', 1),
            digitCondition('month', 1),
            digitCondition('day', 1),
            digitCondition('hour', 1),
            digitCondition('minute', 1)
        ])),
    'medium': datePartFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 3),
            digitCondition('day', 1),
            digitCondition('hour', 1),
            digitCondition('minute', 1),
            digitCondition('second', 1),
        ])),
    'shortDate': datePartFactory(
        combine([
            digitCondition('year', 1),
            digitCondition('month', 1),
            digitCondition('day', 1)
        ])),
    'mediumDate': datePartFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 3),
            digitCondition('day', 1)
        ])),
    'longDate': datePartFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 4),
            digitCondition('day', 1)
        ])),
    'fullDate': datePartFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 4),
            nameCondition('weekday', 4),
            digitCondition('day', 1)
        ])),
    'shortTime': datePartFactory(
        combine([
            digitCondition('hour', 1),
            digitCondition('minute', 1)
        ])),
    'mediumTime': datePartFactory(
        combine([
            digitCondition('hour', 1),
            digitCondition('second', 1),
            digitCondition('minute', 1)
        ]))
};

const ISO8601_DATE_REGEX: RegExp = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

export function formatDigitsAliases(digits: string): DigitsOptions {
    const digitsOptions: DigitsOptions = {};
    const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;
    const parts: RegExpMatchArray | null = digits.match(NUMBER_FORMAT_REGEXP);
    if (parts != null) {
        if (parts[1] != null) {
            digitsOptions.minimumIntegerDigits = parseInt(parts[1]);
        }
        if (parts[3] != null) {
            digitsOptions.minimumFractionDigits = parseInt(parts[3]);
        }
        if (parts[5] != null) {
            digitsOptions.maximumFractionDigits = parseInt(parts[5]);
        }
    }
    return digitsOptions;
}

export class IntlFormatter {

    public static formatNumber(
        value: any,
        defaultLocale: string,
        style: NumberFormatStyle,
        digits?: string | DigitsOptions,
        currency?: string,
        currencyDisplay?: string
    ): string {
        if (!IntlAPI.hasNumberFormat()) return currency ? value + " " + currency : value;

        value = typeof value === "string" && !isNaN(+value - parseFloat(value)) ? +value : value;

        return IntlFormatter.numberFormatter(value, defaultLocale, style, digits, currency, currencyDisplay);
    }

    public static formatDate(value: any, defaultLocale: string, format: string | DateTimeOptions, timezone?: string): string {
        if (!IntlAPI.hasDateTimeFormat()) return value;

        let date: Date;
        if (typeof value === "string") {
            value = value.trim();
        }
        if (IntlFormatter.isDate(value)) {
            date = value;
        } else if (!isNaN(value - parseFloat(value))) {
            date = new Date(parseFloat(value));
        } else if (typeof value === "string" && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
            const [y, m, d] = value.split('-').map((val: string) => parseInt(val, 10));
            date = new Date(y, m - 1, d);
        } else {
            date = new Date(value);
        }
        if (!IntlFormatter.isDate(date)) {
            let match: RegExpMatchArray | null;
            if ((typeof value === "string") && (match = value.match(ISO8601_DATE_REGEX))) {
                date = IntlFormatter.isoStringToDate(match);
            }
        }

        return IntlFormatter.dateTimeFormatter(date, defaultLocale, format, timezone);
    }

    private static numberFormatter(
        num: number,
        defaultLocale: string,
        style: NumberFormatStyle,
        digits?: string | DigitsOptions,
        currency?: string,
        currencyDisplay?: string
    ): string {
        let options: Intl.NumberFormatOptions = {};
        if (typeof digits === "string") {
            options = formatDigitsAliases(digits);
        } else if (digits) {
            options = digits;
        }
        options.style = NumberFormatStyle[style].toLowerCase();
        if (style == NumberFormatStyle.Currency) {
            options.currency = currency;
            options.currencyDisplay = currencyDisplay;
        }
        return new Intl.NumberFormat(defaultLocale, options).format(num);
    }

    private static dateTimeFormatter(date: Date, defaultLocale: string, format: string | DateTimeOptions, timezone?: string): string {
        let options: Intl.DateTimeFormatOptions = {};
        if (typeof format === "string") {
            const formatAliases: DateFormatterFn = FORMAT_ALIASES[format];
            if (formatAliases) return formatAliases(date, defaultLocale, timezone);
        } else {
            options = format;
        }
        return intlDateTimeFormat(date, defaultLocale, options, timezone);
    }

    private static isDate(value: any): value is Date {
        return value instanceof Date && !isNaN(value.valueOf());
    }

    private static isoStringToDate(match: RegExpMatchArray): Date {
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
