export type PropertyDecorator = (target: Object, propertyKey?: string | symbol) => void;

export interface Type<T> extends Function {

    new(...args: any[]): T;

}

export interface DateTimeOptions {

    weekday?: string;
    era?: string;
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minute?: string;
    second?: string;
    timeZoneName?: string;
    hour12?: boolean;

}

export interface DigitsOptions {

    minimumIntegerDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
    useGrouping?: boolean;

}

export interface LocaleCodes {
    /**
     * ISO 639 two-letter or three-letter code.
     */
    languageCode: string;

    /**
     * ISO 3166 two-letter, uppercase code.
     */
    countryCode?: string;

    /**
     * ISO 15924 four-letter script code.
     */
    scriptCode?: string;
}

export interface DefaultLocaleCodes extends LocaleCodes {

    numberingSystem?: string;
    calendar?: string;
}

export interface Language {
    /**
     * ISO 639 two-letter or three-letter code.
     */
    code: string;

    /**
     * 'ltr' or 'rtl'.
     */
    dir: string;
}

export interface Decimal {

    minusSign: string;
    decimalSeparator: string;
    thousandSeparator: string;

}

export interface Schema extends DefaultLocaleCodes {

    currency?: string;
    timezone?: string;
    text?: string;

}

export interface Log {

    name: string;
    message: string;

}

export enum StorageStrategy {

    Session,
    Local,
    Cookie,
    Disabled

}

export enum ProviderType {

    Fallback,
    Static,
    WebAPI

}

export enum ISOCode {

    Language = 'languageCode',
    Country = 'countryCode',
    Script = 'scriptCode'

}

export enum ExtraCode {

    NumberingSystem = 'numberingSystem',
    Calendar = 'calendar',
    Currency = 'currency',
    Timezone = 'timezone'

}

export enum LogLevel {

    Error,
    Warn,
    Log,
    Off

}

export enum NumberFormatStyle {

    Decimal,
    Percent,
    Currency

}

export const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;

export const ISO8601_DATE_REGEX: RegExp =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

export const FORMAT_ALIASES: { [format: string]: DateTimeOptions } = {
    'short': { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    'medium': { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
    'long': { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
    'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
    'shortDate': { year: 'numeric', month: 'numeric', day: 'numeric' },
    'mediumDate': { year: 'numeric', month: 'short', day: 'numeric' },
    'longDate': { year: 'numeric', month: 'long', day: 'numeric' },
    'fullDate': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    'shortTime': { hour: 'numeric', minute: 'numeric' },
    'mediumTime': { hour: 'numeric', minute: 'numeric', second: 'numeric' }
};

export const LOG_MESSAGES: { [message: string]: string } = {
    'missingOnInit': "Missing 'ngOnInit' method: required by AoT compilation",
    'missingOnDestroy': "Missing 'ngOnDestroy' method to cancel subscriptions: required by AoT compilation",
    'missingLang': "Missing 'lang' parameter",
    'missingDefaultLocale': "Missing 'defaultLocale' parameter",
    'missingCurrency': "Missing 'currency' parameter",
    'invalidNumberFormatAlias': "Invalid number format alias: the default format will be used",
    'invalidDateFormatAlias': "Invalid date format alias: the default format will be used"
};
