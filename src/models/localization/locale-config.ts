import { LocaleService } from '../../services/locale.service';
import { Language } from './language';

export class LocaleConfig {

    constructor(private locale: LocaleService) { }

    /**
     * Adds a language to use in the app, specifying the layout direction.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param textDirection Default is ltr (left to right)
     */
    public addLanguage(languageCode: string, textDirection: string = "LTR"): LocaleConfig {
        let language: Language = { code: languageCode, direction: textDirection };
        this.locale.configuration.languageCodes.push(language);
        return this;
    }

    /**
     * Adds the languages to use in the app.
     * @param languageCodes Array of ISO 639 two-letter or three-letter codes of the languages
     */
    public addLanguages(languageCodes: string[]): LocaleConfig {
        for (let languageCode of languageCodes) {
            let language: Language = { code: languageCode, direction: "ltr" };
            this.locale.configuration.languageCodes.push(language);
        }
        return this;
    }

    /**
     * Disables the browser storage for language, default locale & currency.
     */
    public disableStorage(): LocaleConfig {
        this.locale.configuration.storageIsDisabled = true;
        return this;
    }

    /**
     * If the cookie expiration is omitted, the cookie becomes a session cookie.
     */
    public setCookieExpiration(days: number = null): LocaleConfig {
        this.locale.configuration.cookiesExpirationDays = days;
        return this;
    }

    /**
     * Sets browser LocalStorage as default for language, default locale & currency.
     */
    public useLocalStorage(): LocaleConfig {
        this.locale.configuration.localStorage = true;
        return this;
    }

    /**
     * Defines the language to be used:
     *  - tries to get the language from the browser storage;
     *  - tries to get the language of the browser if it has been added;
     *  - otherwise gets the parameter language.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     */
    public defineLanguage(languageCode: string): LocaleConfig {
        this.locale.configuration.languageCode = languageCode;
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
    ): LocaleConfig {
        this.locale.configuration.languageCode = languageCode;
        this.locale.configuration.countryCode = countryCode;
        this.locale.configuration.scriptCode = scriptCode;
        this.locale.configuration.numberingSystem = numberingSystem;
        this.locale.configuration.calendar = calendar;
        return this;
    }

    /**
     * Defines the currency to be used.
     * @param defaultCurrency ISO 4217 three-letter code of the currency
     */
    public defineCurrency(currencyCode: string): LocaleConfig {
        this.locale.configuration.currencyCode = currencyCode;
        return this;
    }

}
