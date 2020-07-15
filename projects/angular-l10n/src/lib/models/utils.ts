import { L10nFormat, L10nSchema } from './types';
import { l10nError } from './l10n-error';

export function validateLanguage(language: string): boolean {
    const regExp = new RegExp(/^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?(-u.+)?$/);
    return regExp.test(language);
}

export function formatLanguage(language: string, format: L10nFormat): string {
    if (language == null || language === '') return '';
    if (!validateLanguage(language)) throw l10nError(formatLanguage, 'Invalid language');

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
    const groups = language.match(/^([a-z]{2,3})(\-([A-Z][a-z]{3}))?(\-([A-Z]{2}))?(-u.+)?$/);
    if (groups == null) throw l10nError(parseLanguage, 'Invalid language');

    return {
        language: groups[1],
        script: groups[3],
        region: groups[5],
        extension: groups[6]
    };
}

export function getBrowserLanguage(): string | null {
    let browserLanguage = null;
    if (typeof navigator !== 'undefined' && navigator.language) {
        browserLanguage = navigator.language.split('-')[0];
    }
    return browserLanguage;
}

export function getSchema(schema: L10nSchema[], language: string, format: L10nFormat): L10nSchema | undefined {
    const element = schema.find(item => formatLanguage(item.locale.language, format) === language);
    return element;
}

export function getValue(key: string, data: { [key: string]: any }, keySeparator: string): string | any | null {
    if (data) {
        if (keySeparator) {
            return key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur]) || null, data);
        }
        return data[key];
    }
    return null;
}

export function handleParams(value: string, params: any): string {
    const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
        const replacer = params[parsedKey];
        return replacer !== undefined ? replacer : substring;
    });
    return replacedValue;
}

export function mergeDeep(target: { [key: string]: any }, source: { [key: string]: any }): any {
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
    const isAvailable = typeof Intl === 'object' && !!Intl;
    return isAvailable;
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

export function hasListFormat(): boolean {
    return hasIntl() && Intl.hasOwnProperty('ListFormat');
}

export function toNumber(value: any): number {
    const parsedValue = typeof value === 'string' && !isNaN(+value - parseFloat(value)) ? +value : value;
    return parsedValue;
}

export function toDate(value: any): Date {
    if (isDate(value)) {
        return value;
    }

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
        const match = value.match(/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/);
        if (match) {
            return isoStringToDate(match);
        }
    }

    const date = new Date(value as any);
    if (!isDate(date)) {
        throw l10nError(toDate, 'Invalid date');
    }
    return date;
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
    const groups = digits.match(/^(\d+)?\.((\d+)(\-(\d+))?)?$/);
    if (groups == null) throw l10nError(parseDigits, 'Invalid digits');

    return {
        minimumIntegerDigits: groups[1] ? parseInt(groups[1]) : undefined,
        minimumFractionDigits: groups[3] ? parseInt(groups[3]) : undefined,
        maximumFractionDigits: groups[5] ? parseInt(groups[5]) : undefined,
    };
}

function isObject(item: any): boolean {
    return typeof item === 'object' && !Array.isArray(item);
}

function isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.valueOf());
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
