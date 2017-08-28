/**
 * Original code by Google Inc.
 */

import { NumberFormatStyle, DateFormatterFn } from './types';

export class IntlFormatter {

    private static readonly PATTERN_ALIASES: { [format: string]: DateFormatterFn } = {
        'yMMMdjms': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 3),
                IntlFormatter.digitCondition('day', 1),
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('minute', 1),
                IntlFormatter.digitCondition('second', 1),
            ])),
        'yMdjm': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.digitCondition('month', 1),
                IntlFormatter.digitCondition('day', 1),
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('minute', 1)
            ])),
        'yMMMMEEEEd': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 4),
                IntlFormatter.nameCondition('weekday', 4),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'yMMMMd': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 4),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'yMMMd': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.nameCondition('month', 3),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'yMd': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('year', 1),
                IntlFormatter.digitCondition('month', 1),
                IntlFormatter.digitCondition('day', 1)
            ])),
        'jms': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('second', 1),
                IntlFormatter.digitCondition('minute', 1)
            ])),
        'jm': IntlFormatter.datePartGetterFactory(
            IntlFormatter.combine([
                IntlFormatter.digitCondition('hour', 1),
                IntlFormatter.digitCondition('minute', 1)
            ]))
    };

    private static readonly DATE_FORMATS: { [format: string]: DateFormatterFn } = {
        'yyyy': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('year', 4)),
        'yy': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('year', 2)),
        'y': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('year', 1)),
        'MMMM': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('month', 4)),
        'MMM': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('month', 3)),
        'MM': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('month', 2)),
        'M': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('month', 1)),
        'LLLL': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('month', 4)),
        'L': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('month', 1)),
        'dd': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('day', 2)),
        'd': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('day', 1)),
        'HH': IntlFormatter.digitModifier(
            IntlFormatter.hourExtractor(
                IntlFormatter.datePartGetterFactory(
                    IntlFormatter.hour12Modify(IntlFormatter.digitCondition('hour', 2), false)
                )
            )
        ),
        'H': IntlFormatter.hourExtractor(
            IntlFormatter.datePartGetterFactory(
                IntlFormatter.hour12Modify(IntlFormatter.digitCondition('hour', 1), false)
            )
        ),
        'hh': IntlFormatter.digitModifier(
            IntlFormatter.hourExtractor(
                IntlFormatter.datePartGetterFactory(
                    IntlFormatter.hour12Modify(IntlFormatter.digitCondition('hour', 2), true)
                )
            )
        ),
        'h': IntlFormatter.hourExtractor(
            IntlFormatter.datePartGetterFactory(
                IntlFormatter.hour12Modify(IntlFormatter.digitCondition('hour', 1), true)
            )
        ),
        'jj': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('hour', 2)),
        'j': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('hour', 1)),
        'mm': IntlFormatter.digitModifier(
            IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('minute', 2))
        ),
        'm': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('minute', 1)),
        'ss': IntlFormatter.digitModifier(
            IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('second', 2))
        ),
        's': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('second', 1)),
        'sss': IntlFormatter.datePartGetterFactory(IntlFormatter.digitCondition('second', 3)),
        'EEEE': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('weekday', 4)),
        'EEE': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('weekday', 3)),
        'EE': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('weekday', 2)),
        'E': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('weekday', 1)),
        'a': IntlFormatter.hourClockExtractor(
            IntlFormatter.datePartGetterFactory(
                IntlFormatter.hour12Modify(IntlFormatter.digitCondition('hour', 1), true)
            )
        ),
        'Z': IntlFormatter.timeZoneGetter('short'),
        'z': IntlFormatter.timeZoneGetter('long'),
        'ww': IntlFormatter.datePartGetterFactory({}),
        'w': IntlFormatter.datePartGetterFactory({}),
        'G': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('era', 1)),
        'GG': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('era', 2)),
        'GGG': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('era', 3)),
        'GGGG': IntlFormatter.datePartGetterFactory(IntlFormatter.nameCondition('era', 4))
    };

    private static readonly DATE_FORMATS_SPLIT: RegExp =
    /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;

    private static DATE_FORMATTER_CACHE: Map<string, string[]> = new Map<string, string[]>();

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

        return IntlFormatter.callNumberFormat(num, defaultLocale, style, {
            minimumIntegerDigits: minInt,
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            currency: currency,
            currencyDisplay: currencyDisplay
        });
    }

    public static formatDate(date: Date, defaultLocale: string, pattern: string): string {
        return IntlFormatter.callDateTimeFormat(date, defaultLocale, pattern);
    }

    private static callNumberFormat(num: number, defaultLocale: string, style: NumberFormatStyle, opts: {
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

    private static callDateTimeFormat(date: Date, defaultLocale: string, pattern: string): string {
        const fnPatternAliases: DateFormatterFn = IntlFormatter.PATTERN_ALIASES[pattern];

        if (fnPatternAliases) return fnPatternAliases(date, defaultLocale);

        const cacheKey: string = pattern;
        let parts: string[] | undefined = IntlFormatter.DATE_FORMATTER_CACHE.get(cacheKey);

        if (!parts) {
            parts = [];
            let match: RegExpExecArray | null;
            IntlFormatter.DATE_FORMATS_SPLIT.exec(pattern);

            let format: string | null = pattern;
            while (format) {
                match = IntlFormatter.DATE_FORMATS_SPLIT.exec(format);
                if (match) {
                    parts = parts.concat(match.slice(1));
                    format = parts.pop()!;
                } else {
                    parts.push(format);
                    format = null;
                }
            }

            IntlFormatter.DATE_FORMATTER_CACHE.set(cacheKey, parts);
        }

        return parts.reduce((text: string, part: string) => {
            const fnDateFormats: DateFormatterFn = IntlFormatter.DATE_FORMATS[part];
            return text + (fnDateFormats ? fnDateFormats(date, defaultLocale) : IntlFormatter.partToTime(part));
        }, "");
    }

    private static partToTime(part: string): string {
        return part === '\'\'' ? '\'' : part.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
    }

    private static intlDateTimeFormat(date: Date, defaultLocale: string, options: Intl.DateTimeFormatOptions): string {
        return new Intl.DateTimeFormat(defaultLocale, options).format(date).replace(/[\u200e\u200f]/g, "");
    }

    private static datePartGetterFactory(ret: Intl.DateTimeFormatOptions): DateFormatterFn {
        return (date: Date, defaultLocale: string): string =>
            IntlFormatter.intlDateTimeFormat(date, defaultLocale, ret);
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

    private static digitModifier(inner: DateFormatterFn): DateFormatterFn {
        return function (date: Date, defaultLocale: string): string {
            const result: string = inner(date, defaultLocale);
            return result.length == 1 ? "0" + result : result;
        };
    }

    private static hourClockExtractor(inner: DateFormatterFn): DateFormatterFn {
        return function (date: Date, defaultLocale: string): string {
            return inner(date, defaultLocale).split(" ")[1];
        };
    }

    private static hourExtractor(inner: DateFormatterFn): DateFormatterFn {
        return function (date: Date, defaultLocale: string): string {
            return inner(date, defaultLocale).split(" ")[0];
        };
    }

    private static hour12Modify(
        options: Intl.DateTimeFormatOptions, value: boolean): Intl.DateTimeFormatOptions {
        options.hour12 = value;
        return options;
    }

    private static timeZoneGetter(timezone: string): DateFormatterFn {
        const options: any = { hour: '2-digit', hour12: false, timeZoneName: timezone };
        return function (date: Date, defaultLocale: string): string {
            const result: string = IntlFormatter.intlDateTimeFormat(date, defaultLocale, options);
            return result ? result.substring(3) : "";
        };
    }

}
