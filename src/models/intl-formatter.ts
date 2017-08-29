import { IntlAPI } from '../services/intl-api';
import { NumberFormatStyle, DateFormatterFn, DateTimeOptions } from './types';

export class IntlFormatter {

    private static readonly FORMAT_ALIASES: { [format: string]: DateFormatterFn } = {
        'short': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.digitCondition('month', 1),
                IntlFormatter.digitCondition('day', 1),
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('minute', 1)
            ])),
        'medium': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 3),
                IntlFormatter.digitCondition('day', 1),
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('minute', 1),
                IntlFormatter.digitCondition('second', 1),
            ])),
        'shortDate': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.digitCondition('month', 1),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'mediumDate': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 3),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'longDate': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 4),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'fullDate': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 4),
                IntlFormatter.nameCondition('weekday', 4),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'shortTime': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('minute', 1)
            ])),
        'mediumTime': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('second', 1),
                IntlFormatter.digitCondition('minute', 1)
            ])),
    };

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

        return IntlFormatter.sendNumberFormat(num, defaultLocale, style, {
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

        return IntlFormatter.sendDateTimeFormat(date, defaultLocale, format, timezone);
    }

    private static sendNumberFormat(num: number, defaultLocale: string, style: NumberFormatStyle, opts: {
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

    private static sendDateTimeFormat(
        date: Date, defaultLocale: string,
        format: string | DateTimeOptions,
        timezone?: string): string {

        let options: Intl.DateTimeFormatOptions = {};
        if (typeof format === "string") {
            const fnFormatAliases: DateFormatterFn = IntlFormatter.FORMAT_ALIASES[format];
            if (fnFormatAliases) return fnFormatAliases(date, defaultLocale, timezone);
        } else {
            options = format;
            options.timeZone = IntlAPI.hasTimezone() ? timezone : 'UTC';
        }
        // If the format is wrong, returns the default Intl format.
        return IntlFormatter.intlDateTimeFormat(date, defaultLocale, options);
    }

    private static intlDateTimeFormat(date: Date, defaultLocale: string, options: Intl.DateTimeFormatOptions): string {
        return new Intl.DateTimeFormat(defaultLocale, options).format(date).replace(/[\u200e\u200f]/g, "");
    }

    private static datePartGetterFactory(options: Intl.DateTimeFormatOptions): DateFormatterFn {
        return (date: Date, defaultLocale: string, timezone?: string): string => {
            options.timeZone = IntlAPI.hasTimezone() ? timezone : 'UTC';
            return IntlFormatter.intlDateTimeFormat(date, defaultLocale, options);
        };
    }

    private static combine(options: Intl.DateTimeFormatOptions[]): Intl.DateTimeFormatOptions {
        return options.reduce(
            (merged: Intl.DateTimeFormatOptions, opt: Intl.DateTimeFormatOptions) => ({ ...merged, ...opt }), {}
        );
    }

    private static digitCondition(prop: string, len: number): Intl.DateTimeFormatOptions {
        const result: { [k: string]: string } = {};
        result[prop] = len === 2 ? '2-digit' : 'numeric';
        return result;
    }

    private static nameCondition(prop: string, len: number): Intl.DateTimeFormatOptions {
        const result: { [k: string]: string } = {};
        if (len < 4) {
            result[prop] = len > 1 ? 'short' : 'narrow';
        } else {
            result[prop] = 'long';
        }
        return result;
    }

}
