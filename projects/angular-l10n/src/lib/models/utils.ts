import { L10nFormat, L10nSchema, L10nDateTimeFormatOptions, L10nNumberFormatOptions } from './types';
import { l10nError } from './l10n-error';

export const ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

export function validateLanguage(language: string): boolean {
    return /^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?(-u.+)?$/
        .test(language);
}

export function formatLanguage(language: string, format?: L10nFormat): string {
    if (!validateLanguage(language)) throw l10nError(formatLanguage, 'Invalid language');
    if (format == null) return language;

    const [, LANGUAGE = '', SCRIPT = '', REGION = ''] = language.match(/^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?/) || [];
    switch (format) {
        case 'language':
            return LANGUAGE;
        case 'language-script':
            return LANGUAGE + SCRIPT;
        case 'language-region':
            return LANGUAGE + REGION;
        case 'language-script-region':
            return LANGUAGE + SCRIPT + REGION;
    }
}

export function parseLanguage(language: string) {
    const match = language
        .match(/^(?<LANGUAGE>[a-z]{2,3})(\-(?<SCRIPT>[A-Z][a-z]{3}))?(\-(?<REGION>[A-Z]{2}))?(?<EXTENSION>-u.+)?$/);

    if (!match || !match.groups) throw l10nError(parseLanguage, 'Invalid language');

    const groups = match.groups;
    return {
        language: groups.LANGUAGE,
        script: groups.SCRIPT,
        region: groups.REGION,
        extension: groups.EXTENSION
    };
}

export function getBrowserLanguage(): string | null {
    let browserLanguage = null;
    if (navigator !== undefined && navigator.language) {
        browserLanguage = navigator.language;
    }
    if (browserLanguage != null) {
        browserLanguage = browserLanguage.split('-')[0];
    }
    return browserLanguage;
}

export function lookupMatcher(schema: L10nSchema[], format: L10nFormat, language: string): boolean {
    return schema.find((element) => formatLanguage(element.locale.language, format) === language) !== undefined;
}

export function getValue(key: string, data: any, keySeparator?: string): string | any | null {
    if (data) {
        if (keySeparator) {
            return key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur]) || null, data);
        }
        return data[key];
    }
    return null;
}

export function handleParams(value: string, params: any): string {
    return value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
        const replacer = params[parsedKey];
        return replacer !== undefined ? replacer : substring;
    });
}

export function mergeDeep(target: any, source: any): any {
    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
}

export function hasIntl(): boolean {
    return typeof Intl === 'object' && !!Intl;
}

export function hasDateTimeFormat(): boolean {
    return hasIntl() && Intl.hasOwnProperty('DateTimeFormat');
}

export function hasNumberFormat(): boolean {
    return hasIntl() && Intl.hasOwnProperty('NumberFormat');
}

export function hasTimeZone(): boolean {
    if (hasIntl() && hasDateTimeFormat()) {
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles' }).format(new Date());
        } catch (e) {
            return false;
        }
        return true;
    }
    return false;
}

export function hasRelativeTimeFormat(): boolean {
    return hasIntl() && Intl.hasOwnProperty('RelativeTimeFormat');
}

export function hasCollator(): boolean {
    return hasIntl() && Intl.hasOwnProperty('Collator');
}

export function hasPluralRules(): boolean {
    return hasIntl() && Intl.hasOwnProperty('PluralRules');
}

export function toNumber(value: any): number {
    return typeof value === 'string' && !isNaN(+value - parseFloat(value)) ? +value : value;
}

export function toDate(value: any): Date {
    if (typeof value === 'number' && !isNaN(value)) {
        return new Date(value);
    }
    if (typeof value === 'string') {
        value = value.trim();
        if (!isNaN(value - parseFloat(value))) {
            return new Date(parseFloat(value));
        }
        if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
            const [y, m, d] = value.split('-').map((val: string) => +val);
            return new Date(y, m - 1, d);
        }
        const match = value.match(ISO8601_DATE_REGEX);
        if (match) {
            return isoStringToDate(match);
        }
    }
    return value;
}

export function isL10nDateTimeFormatOptions(
    options: L10nDateTimeFormatOptions | Intl.DateTimeFormatOptions
): options is L10nDateTimeFormatOptions {
    return (options as L10nDateTimeFormatOptions).dateStyle !== undefined || (options as L10nDateTimeFormatOptions).timeStyle !== undefined;
}

export function isL10nNumberFormatOptions(
    options: L10nNumberFormatOptions | Intl.NumberFormatOptions
): options is L10nNumberFormatOptions {
    return (options as L10nNumberFormatOptions).digits !== undefined;
}

export const PARSE_DATE_STYLE: { [format: string]: any } = {
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    short: { year: '2-digit', month: 'numeric', day: 'numeric' }
};

export const PARSE_TIME_STYLE: { [format: string]: any } = {
    full: { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long' },
    long: { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' },
    medium: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
    short: { hour: 'numeric', minute: 'numeric' }
};

export function parseDigits(digits: string) {
    const match = digits.match(/^(?<MIN_INT>\d+)?\.((?<MIN_FRACTION>\d+)(\-(?<MAX_FRACTION>\d+))?)?$/);
    if (!match || !match.groups) throw l10nError(parseDigits, 'Invalid digits');

    const groups = match.groups;
    return {
        minimumIntegerDigits: groups.MIN_INT ? parseInt(groups.MIN_INT, 10) : undefined,
        minimumFractionDigits: groups.MIN_FRACTION ? parseInt(groups.MIN_FRACTION, 10) : undefined,
        maximumFractionDigits: groups.MAX_FRACTION ? parseInt(groups.MAX_FRACTION, 10) : undefined,
    };
}

function isObject(item: any): boolean {
    return (typeof item === 'object' && !Array.isArray(item));
}

/**
 * Converts a date in ISO 8601 to a Date.
 */
function isoStringToDate(match: RegExpMatchArray): Date {
    const date = new Date(0);
    let tzHour = 0;
    let tzMin = 0;
    const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter = match[8] ? date.setUTCHours : date.setHours;
    if (match[9]) {
        tzHour = Number(match[9] + match[10]);
        tzMin = Number(match[9] + match[11]);
    }
    dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const h = Number(match[4] || 0) - tzHour;
    const m = Number(match[5] || 0) - tzMin;
    const s = Number(match[6] || 0);
    const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
}
