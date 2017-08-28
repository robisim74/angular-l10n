export interface PropertyDecorator {

    <T extends Function>(type: T): T;

    (target: Object, propertyKey?: string | symbol): void;

}

export interface Type<T> extends Function {

    new(...args: any[]): T;

}

export interface DefaultLocaleCodes {
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

    numberingSystem?: string;
    calendar?: string;
}

export type Language = {
    /**
     * ISO 639 two-letter or three-letter code.
     */
    code: string;

    /**
     * 'ltr' or 'rtl'.
     */
    dir: string;
};

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

    Language,
    Country,
    Script

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

export type DateFormatterFn = (date: Date, defaultLocale: string) => string;

export type Decimal = {

    minusSign: string;
    decimalSeparator: string;
    thousandSeparator: string;

};
