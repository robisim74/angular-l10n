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

import { NumberFormatStyle } from './types';

type DateFormatterFn = (date: Date, defaultLocale: string) => string;

const DATE_FORMATS_SPLIT: RegExp =
    /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;

const PATTERN_ALIASES: { [format: string]: DateFormatterFn } = {
    'yMMMdjms': datePartGetterFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 3),
            digitCondition('day', 1),
            digitCondition('hour', 1),
            digitCondition('minute', 1),
            digitCondition('second', 1),
        ])),
    'yMdjm': datePartGetterFactory(
        combine([
            digitCondition('year', 1),
            digitCondition('month', 1),
            digitCondition('day', 1),
            digitCondition('hour', 1),
            digitCondition('minute', 1)
        ])),
    'yMMMMEEEEd': datePartGetterFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 4),
            nameCondition('weekday', 4),
            digitCondition('day', 1)
        ])),
    'yMMMMd': datePartGetterFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 4),
            digitCondition('day', 1)
        ])),
    'yMMMd': datePartGetterFactory(
        combine([
            digitCondition('year', 1),
            nameCondition('month', 3),
            digitCondition('day', 1)
        ])),
    'yMd': datePartGetterFactory(
        combine([
            digitCondition('year', 1),
            digitCondition('month', 1),
            digitCondition('day', 1)
        ])),
    'jms': datePartGetterFactory(
        combine([
            digitCondition('hour', 1),
            digitCondition('second', 1),
            digitCondition('minute', 1)
        ])),
    'jm': datePartGetterFactory(
        combine([
            digitCondition('hour', 1),
            digitCondition('minute', 1)
        ]))
};

const DATE_FORMATS: { [format: string]: DateFormatterFn } = {
    'yyyy': datePartGetterFactory(digitCondition('year', 4)),
    'yy': datePartGetterFactory(digitCondition('year', 2)),
    'y': datePartGetterFactory(digitCondition('year', 1)),
    'MMMM': datePartGetterFactory(nameCondition('month', 4)),
    'MMM': datePartGetterFactory(nameCondition('month', 3)),
    'MM': datePartGetterFactory(digitCondition('month', 2)),
    'M': datePartGetterFactory(digitCondition('month', 1)),
    'LLLL': datePartGetterFactory(nameCondition('month', 4)),
    'L': datePartGetterFactory(nameCondition('month', 1)),
    'dd': datePartGetterFactory(digitCondition('day', 2)),
    'd': datePartGetterFactory(digitCondition('day', 1)),
    'HH': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), false)))),
    'H': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), false))),
    'hh': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), true)))),
    'h': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
    'jj': datePartGetterFactory(digitCondition('hour', 2)),
    'j': datePartGetterFactory(digitCondition('hour', 1)),
    'mm': digitModifier(datePartGetterFactory(digitCondition('minute', 2))),
    'm': datePartGetterFactory(digitCondition('minute', 1)),
    'ss': digitModifier(datePartGetterFactory(digitCondition('second', 2))),
    's': datePartGetterFactory(digitCondition('second', 1)),
    'sss': datePartGetterFactory(digitCondition('second', 3)),
    'EEEE': datePartGetterFactory(nameCondition('weekday', 4)),
    'EEE': datePartGetterFactory(nameCondition('weekday', 3)),
    'EE': datePartGetterFactory(nameCondition('weekday', 2)),
    'E': datePartGetterFactory(nameCondition('weekday', 1)),
    'a': hourClockExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
    'Z': timeZoneGetter('short'),
    'z': timeZoneGetter('long'),
    'ww': datePartGetterFactory({}),
    'w': datePartGetterFactory({}),
    'G': datePartGetterFactory(nameCondition('era', 1)),
    'GG': datePartGetterFactory(nameCondition('era', 2)),
    'GGG': datePartGetterFactory(nameCondition('era', 3)),
    'GGGG': datePartGetterFactory(nameCondition('era', 4))
};

const DATE_FORMATTER_CACHE: Map<string, string[]> = new Map<string, string[]>();

export class NumberFormatter {

    public static format(num: number, defaultLocale: string, style: NumberFormatStyle, opts: {
        minimumIntegerDigits?: number,
        minimumFractionDigits?: number,
        maximumFractionDigits?: number,
        currency?: string,
        currencyDisplay?: string
    } = {}): string {
        const { minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, currency, currencyDisplay } = opts;
        const options: Intl.NumberFormatOptions = {
            minimumIntegerDigits,
            minimumFractionDigits,
            maximumFractionDigits,
            style: NumberFormatStyle[style].toLowerCase()
        };

        if (style == NumberFormatStyle.Currency) {
            options.currency = currency;
            options.currencyDisplay = currencyDisplay;
        }
        return new Intl.NumberFormat(defaultLocale, options).format(num);
    }
}

export class DateFormatter {

    public static format(date: Date, defaultLocale: string, pattern: string): string {
        return dateFormatter(pattern, date, defaultLocale);
    }

}

function dateFormatter(format: string, date: Date, defaultLocale: string): string {
    const fnPatternAliases: DateFormatterFn = PATTERN_ALIASES[format];

    if (fnPatternAliases) return fnPatternAliases(date, defaultLocale);

    const cacheKey: string = format;
    let parts: string[] | undefined = DATE_FORMATTER_CACHE.get(cacheKey);

    if (!parts) {
        parts = [];
        let match: RegExpExecArray | null;
        DATE_FORMATS_SPLIT.exec(format);

        let _format: string | null = format;
        while (_format) {
            match = DATE_FORMATS_SPLIT.exec(_format);
            if (match) {
                parts = parts.concat(match.slice(1));
                _format = parts.pop()!;
            } else {
                parts.push(_format);
                _format = null;
            }
        }

        DATE_FORMATTER_CACHE.set(cacheKey, parts);
    }

    return parts.reduce((text: string, part: string) => {
        const fnDateFormats: DateFormatterFn = DATE_FORMATS[part];
        return text + (fnDateFormats ? fnDateFormats(date, defaultLocale) : partToTime(part));
    }, "");
}

function intlDateFormat(date: Date, defaultLocale: string, options: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(defaultLocale, options).format(date).replace(/[\u200e\u200f]/g, "");
}

function partToTime(part: string): string {
    return part === '\'\'' ? '\'' : part.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
}

function datePartGetterFactory(ret: Intl.DateTimeFormatOptions): DateFormatterFn {
    return (date: Date, defaultLocale: string): string => intlDateFormat(date, defaultLocale, ret);
}

function combine(options: Intl.DateTimeFormatOptions[]): Intl.DateTimeFormatOptions {
    return options.reduce(
        (merged: Intl.DateTimeFormatOptions, opt: Intl.DateTimeFormatOptions) => ({ ...merged, ...opt }), {}
    );
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

function digitModifier(inner: DateFormatterFn): DateFormatterFn {
    return function (date: Date, defaultLocale: string): string {
        const result: string = inner(date, defaultLocale);
        return result.length == 1 ? "0" + result : result;
    };
}

function hourClockExtractor(inner: DateFormatterFn): DateFormatterFn {
    return function (date: Date, defaultLocale: string): string { return inner(date, defaultLocale).split(" ")[1]; };
}

function hourExtractor(inner: DateFormatterFn): DateFormatterFn {
    return function (date: Date, defaultLocale: string): string { return inner(date, defaultLocale).split(" ")[0]; };
}

function hour12Modify(
    options: Intl.DateTimeFormatOptions, value: boolean): Intl.DateTimeFormatOptions {
    options.hour12 = value;
    return options;
}

function timeZoneGetter(timezone: string): DateFormatterFn {
    const options: any = { hour: '2-digit', hour12: false, timeZoneName: timezone };
    return function (date: Date, defaultLocale: string): string {
        const result: string = intlDateFormat(date, defaultLocale, options);
        return result ? result.substring(3) : "";
    };
}
