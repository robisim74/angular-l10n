import { TranslationConfig } from './translation-config';

export class TranslationConfigAPI {

    constructor(private configuration: TranslationConfig) { }

    /**
     * Direct loading: adds translation data.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param translation Translation data of the language
     */
    public addTranslation(languageCode: string, translation: any): TranslationConfigAPI {
        this.configuration.translationData[languageCode] =
            typeof this.configuration.translationData[languageCode] !== "undefined"
                ? { ...this.configuration.translationData[languageCode], ...translation } // Object spread.
                : translation;
        return this;
    }

    /**
     * Asynchronous loading: adds a translation provider.
     * @param prefix The path prefix of the json files
     * @param dataFormat Data format: default & supported value is 'json'
     */
    public addProvider(prefix: string, dataFormat: string = "json"): TranslationConfigAPI {
        this.configuration.providers.push({ path: prefix, dataFormat: "json", webAPI: false });
        return this;
    }

    /**
     * Asynchronous loading: adds a Web API provider.
     * @param path [path]{languageCode} will be the URL used by the Http GET requests
     * @param dataFormat Data format: default & supported value is 'json'
     */
    public addWebAPIProvider(path: string, dataFormat: string = "json"): TranslationConfigAPI {
        this.configuration.providers.push({ path: path, dataFormat: dataFormat, webAPI: true });
        return this;
    }

    /**
     * Sets the use of locale (languageCode-countryCode) as language.
     */
    public useLocaleAsLanguage(): TranslationConfigAPI {
        this.configuration.localeAsLanguage = true;
        return this;
    }

    /**
     * Sets the value to use for missing keys.
     */
    public setMissingValue(value: string): TranslationConfigAPI {
        this.configuration.missingValue = value;
        return this;
    }

    /**
     * Sets the key to use for missing keys.
     */
    public setMissingKey(key: string): TranslationConfigAPI {
        this.configuration.missingKey = key;
        return this;
    }

    /**
     * Sets composed key separator. Default is the point '.'.
     */
    public setComposedKeySeparator(keySeparator: string): TranslationConfigAPI {
        this.configuration.keySeparator = keySeparator;
        return this;
    }

    /**
     * Disables the translation of numbers that are contained at the beginning of the keys.
     */
    public disableI18nPlural(): TranslationConfigAPI {
        this.configuration.i18nPlural = false;
        return this;
    }

}
