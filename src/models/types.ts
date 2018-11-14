export interface PropertyDecorator {

    <T extends Function>(type: T): T;

    (target: Object, propertyKey?: string | symbol): void;

}

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

export interface LocalizedRoutingSchema extends DefaultLocaleCodes {

    currency?: string;
    timezone?: string;
    text?: string;

}

export interface LocalizedRoutingOptions {
    /**
     * Disables/enables default routing for default language or locale.
     */
    defaultRouting?: boolean;

    /**
     * Provides the schema to the default behaviour of localized routing.
     */
    schema?: LocalizedRoutingSchema[];
}

export interface Decimal {

    minusSign: string;
    decimalSeparator: string;
    thousandSeparator: string;

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

export enum LoadingMode {

    Direct,
    Async

}

export enum ServiceState {

    isReady,
    isLoading,
    isWaiting

}

export enum NumberFormatStyle {

    Decimal,
    Percent,
    Currency

}

export type DateFormatterFn = (date: Date, defaultLocale: string, timezone?: string) => string;
