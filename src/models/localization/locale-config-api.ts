import { LocaleConfig } from './locale-config';
import { Language } from './language';

export class LocaleConfigAPI {

    constructor(private configuration: LocaleConfig) { }

    /**
     * Adds a language to use in the app, specifying the layout direction.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param textDirection Default is ltr (left to right)
     */
    public addLanguage(languageCode: string, textDirection: string = "LTR"): LocaleConfigAPI {
        let language: Language = { code: languageCode, direction: textDirection };
        this.configuration.languageCodes.push(language);
        return this;
    }

    /**
     * Adds the languages to use in the app.
     * @param languageCodes Array of ISO 639 two-letter or three-letter codes of the languages
     */
    public addLanguages(languageCodes: string[]): LocaleConfigAPI {
        for (let languageCode of languageCodes) {
            let language: Language = { code: languageCode, direction: "ltr" };
            this.configuration.languageCodes.push(language);
        }
        return this;
    }

    /**
     * Disables the browser storage for language, default locale & currency.
     */
    public disableStorage(): LocaleConfigAPI {
        this.configuration.storageIsDisabled = true;
        return this;
    }

    /**
     * If the cookie expiration is omitted, the cookie becomes a session cookie.
     */
    public setCookieExpiration(days: number = null): LocaleConfigAPI {
        this.configuration.cookiesExpirationDays = days;
        return this;
    }

    /**
     * Sets browser LocalStorage as default for language, default locale & currency.
     */
    public useLocalStorage(): LocaleConfigAPI {
        this.configuration.localStorage = true;
        return this;
    }

    /**
     * Defines the language to be used:
     *  - tries to get the language from the browser storage;
     *  - tries to get the language of the browser if it has been added;
     *  - otherwise gets the parameter language.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     */
    public defineLanguage(languageCode: string): LocaleConfigAPI {
        this.configuration.languageCode = languageCode;
        return this;
    }

    /**
     * Defines the default locale to be used, regardless of the browser language.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param countryCode ISO 3166 two-letter, uppercase code of the country
     * @param scriptCode Optional ISO 15924 four-letter script code
     * @param numberingSystem Optional numbering system
     * @param calendar Optional calendar
     */
    public defineDefaultLocale(
        languageCode: string,
        countryCode: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): LocaleConfigAPI {
        this.configuration.languageCode = languageCode;
        this.configuration.countryCode = countryCode;
        this.configuration.scriptCode = scriptCode;
        this.configuration.numberingSystem = numberingSystem;
        this.configuration.calendar = calendar;
        return this;
    }

    /**
     * Defines the currency to be used.
     * @param defaultCurrency ISO 4217 three-letter code of the currency
     */
    public defineCurrency(currencyCode: string): LocaleConfigAPI {
        this.configuration.currencyCode = currencyCode;
        return this;
    }

}
