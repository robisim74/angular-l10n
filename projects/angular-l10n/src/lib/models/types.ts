export type L10nFormat = 'language' | 'language-script' | 'language-region' | 'language-script-region';

export interface L10nProvider {
    /**
     * The name of the provider.
     */
    name: string;
    /**
     * The asset of the provider.
     */
    asset: any | string;
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
     * ISO 4217 three-letter code.
     */
    currency?: string;
    /**
     * Time zone name from the IANA time zone database.
     */
    timezone?: string;
}

export interface L10nSchema {
    locale: L10nLocale;
    /**
     * Language direction.
     */
    dir?: 'ltr' | 'rtl';
    text?: string;
}
