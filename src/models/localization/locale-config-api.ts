import { LocaleConfig } from './locale-config';
import { Language } from '../types';

export interface ILocaleConfigAPI {

    /**
     * Adds a language to use in the app, specifying the layout direction.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param textDirection Default is ltr (left to right)
     */
    addLanguage(languageCode: string, textDirection?: string): ILocaleConfigAPI;

    /**
     * Adds the languages to use in the app.
     * @param languageCodes Array of ISO 639 two-letter or three-letter codes of the languages
     */
    addLanguages(languageCodes: string[]): ILocaleConfigAPI;

    /**
     * Disables the browser storage for language, default locale & currency.
     */
    disableStorage(): ILocaleConfigAPI;

    /**
     * If the cookie expiration is omitted, the cookie becomes a session cookie.
     */
    setCookieExpiration(days?: number): ILocaleConfigAPI;

    /**
     * Sets browser LocalStorage as default for language, default locale & currency.
     */
    useLocalStorage(): ILocaleConfigAPI;

    /**
     * Sets browser SessionStorage as default for language, default locale & currency.
     */
    useSessionStorage(): ILocaleConfigAPI;

    /**
     * Defines the language to be used:
     *  - tries to get the language from the browser storage;
     *  - tries to get the language of the browser if it has been added;
     *  - otherwise gets the parameter language.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     */
    defineLanguage(languageCode: string): ILocaleConfigAPI;

    /**
     * Defines the default locale to be used, regardless of the browser language.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param countryCode ISO 3166 two-letter, uppercase code of the country
     * @param scriptCode Optional ISO 15924 four-letter script code
     * @param numberingSystem Optional numbering system
     * @param calendar Optional calendar
     */
    defineDefaultLocale(
        languageCode: string,
        countryCode: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): ILocaleConfigAPI;

    /**
     * Defines the currency to be used.
     * @param defaultCurrency ISO 4217 three-letter code of the currency
     */
    defineCurrency(currencyCode: string): ILocaleConfigAPI;

}

export class LocaleConfigAPI implements ILocaleConfigAPI {

    constructor(private configuration: LocaleConfig) { }

    public addLanguage(languageCode: string, textDirection: string = "LTR"): ILocaleConfigAPI {
        this.configuration.languageCodes.push({ code: languageCode, direction: textDirection });
        return this;
    }

    public addLanguages(languageCodes: string[]): ILocaleConfigAPI {
        for (const languageCode of languageCodes) {
            this.configuration.languageCodes.push({ code: languageCode, direction: "ltr" });
        }
        return this;
    }

    public disableStorage(): ILocaleConfigAPI {
        this.configuration.storageIsDisabled = true;
        return this;
    }

    public setCookieExpiration(days?: number): ILocaleConfigAPI {
        this.configuration.cookiesExpirationDays = days;
        return this;
    }

    public useLocalStorage(): ILocaleConfigAPI {
        this.configuration.localStorage = true;
        return this;
    }

    public useSessionStorage(): ILocaleConfigAPI {
        this.configuration.sessionStorage = true;
        return this;
    }

    public defineLanguage(languageCode: string): ILocaleConfigAPI {
        this.configuration.languageCode = languageCode;
        return this;
    }

    public defineDefaultLocale(
        languageCode: string,
        countryCode: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): ILocaleConfigAPI {
        this.configuration.languageCode = languageCode;
        this.configuration.countryCode = countryCode;
        this.configuration.scriptCode = scriptCode;
        this.configuration.numberingSystem = numberingSystem;
        this.configuration.calendar = calendar;
        return this;
    }

    public defineCurrency(currencyCode: string): ILocaleConfigAPI {
        this.configuration.currencyCode = currencyCode;
        return this;
    }

}
