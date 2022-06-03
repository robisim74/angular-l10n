export type L10nFormat = 'language' | 'language-script' | 'language-region' | 'language-script-region';

export interface L10nProvider {
    /**
     * The name of the provider.
     */
    name: string;
    /**
     * The asset of the provider.
     */
    asset: any;
    /**
     * Options to pass the loader.
     */
    options?: any;
}

export interface L10nLocale {
    /**
     * language[-script][-region][-extension]
     * Where:
     * - language: ISO 639 two-letter or three-letter code
     * - script: ISO 15924 four-letter script code
     * - region: ISO 3166 two-letter, uppercase code
     * - extension: 'u' (Unicode) extensions
     */
    language: string;
    /**
     * Alternative language to translate dates.
     */
    dateLanguage?: string;
    /**
     * Alternative language to translate numbers.
     */
    numberLanguage?: string;
    /**
     * ISO 4217 three-letter code.
     */
    currency?: string;
    /**
     * Time zone name from the IANA time zone database.
     */
    timeZone?: string;

    /**
     * Key value pairs of unit identifiers.
     */
    units?: { [key: string]: string }
}

export interface L10nSchema {
    locale: L10nLocale;
    /**
     * Language direction.
     */
    dir?: 'ltr' | 'rtl';
    text?: string;
}

export interface L10nDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
    /**
     * The date formatting style.
     */
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    /**
     * The time formatting style.
     */
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    /**
     * To handle missing properties in ts definition files.
     */
    [key: string]: any;
}

export interface L10nNumberFormatOptions extends Intl.NumberFormatOptions {
    /**
     * The digits formatting.
     */
    digits?: string;
    /**
     * To handle missing properties in ts definition files.
     */
    [key: string]: any;
}
