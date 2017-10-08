import { IntlAPI } from '../services/intl-api';
import { NumberFormatStyle, DateFormatterFn, DateTimeOptions } from './types';

function intlDateTimeFormat(
    date: Date,
    defaultLocale: string,
    options: Intl.DateTimeFormatOptions,
    timezone?: string
): string {
    const marks: RegExp = /[\u200e\u200f]/g;
    options.timeZone = IntlAPI.hasTimezone() ? timezone : 'UTC';
    return new Intl.DateTimeFormat(defaultLocale, options).format(date).replace(marks, "");
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
        ])),
};

export class IntlFormatter {

    public static formatNumber(
        num: number,
        defaultLocale: string,
        style: NumberFormatStyle,
        digits?: string,
        currency?: string,
        currencyDisplay?: string): string | null {

        let minInt: number | undefined;
        let minFraction: number | undefined;
        let maxFraction: number | undefined;
        if (style !== NumberFormatStyle.Currency) {
            minInt = 1;
            minFraction = 0;
            maxFraction = 3;
        }

        if (!!digits) {
            const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;
            const parts: RegExpMatchArray | null = digits.match(NUMBER_FORMAT_REGEXP);
            if (parts != null) {
                if (parts[1] != null) {  // Min integer digits.
                    minInt = parseInt(parts[1]);
                }
                if (parts[3] != null) {  // Min fraction digits.
                    minFraction = parseInt(parts[3]);
                }
                if (parts[5] != null) {  // Max fraction digits.
                    maxFraction = parseInt(parts[5]);
                }
            }
        }

        return IntlFormatter.numberFormatter(num, defaultLocale, style, {
            minimumIntegerDigits: minInt,
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            currency: currency,
            currencyDisplay: currencyDisplay
        });
    }

    public static formatDate(
        date: Date,
        defaultLocale: string,
        format: string | DateTimeOptions,
        timezone?: string): string {

        return IntlFormatter.dateTimeFormatter(date, defaultLocale, format, timezone);
    }

    private static numberFormatter(num: number, defaultLocale: string, style: NumberFormatStyle, opts: {
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

    private static dateTimeFormatter(
        date: Date, defaultLocale: string,
        format: string | DateTimeOptions,
        timezone?: string): string {

        let options: Intl.DateTimeFormatOptions = {};
        if (typeof format === "string") {
            const fnFormatAliases: DateFormatterFn = FORMAT_ALIASES[format];
            if (fnFormatAliases) return fnFormatAliases(date, defaultLocale, timezone);
        } else {
            options = format;
        }
        // If the format is wrong, returns the default Intl format.
        return intlDateTimeFormat(date, defaultLocale, options, timezone);
    }

}
