import { TranslationConfig } from './translation-config';

export interface ITranslationConfigAPI {

    /**
     * Direct loading: adds translation data.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param translation Translation data of the language
     */
    addTranslation(languageCode: string, translation: any): ITranslationConfigAPI;

    /**
     * Asynchronous loading: adds a translation provider.
     * @param prefix The path prefix of the json files
     * @param dataFormat Data format: default & supported value is 'json'
     */
    addProvider(prefix: string, dataFormat?: string): ITranslationConfigAPI;

    /**
     * Asynchronous loading: adds a Web API provider.
     * @param path [path]{languageCode} will be the URL used by the Http GET requests
     * @param dataFormat Data format: default & supported value is 'json'
     */
    addWebAPIProvider(path: string, dataFormat?: string): ITranslationConfigAPI;

    /**
     * Asynchronous loading: adds a custom provider.
     */
    addCustomProvider(args: any): ITranslationConfigAPI;

    /**
     * Sets the use of locale (languageCode-countryCode) as language.
     */
    useLocaleAsLanguage(): ITranslationConfigAPI;

    /**
     * Sets the value to use for missing keys.
     */
    setMissingValue(value: string): ITranslationConfigAPI;

    /**
     * Sets the key to use for missing keys.
     */
    setMissingKey(key: string): ITranslationConfigAPI;

    /**
     * Sets composed key separator. Default is the point '.'.
     */
    setComposedKeySeparator(keySeparator: string): ITranslationConfigAPI;

    /**
     * Disables the translation of numbers that are contained at the beginning of the keys.
     */
    disableI18nPlural(): ITranslationConfigAPI;

}

export class TranslationConfigAPI {

    constructor(private configuration: TranslationConfig) { }

    public addTranslation(languageCode: string, translation: any): ITranslationConfigAPI {
        this.configuration.translationData[languageCode] =
            typeof this.configuration.translationData[languageCode] !== "undefined"
                ? { ...this.configuration.translationData[languageCode], ...translation } // Object spread.
                : translation;
        return this;
    }

    public addProvider(prefix: string, dataFormat: string = "json"): ITranslationConfigAPI {
        this.configuration.providers.push({ args: { type: "Static", prefix: prefix, dataFormat: dataFormat } });
        return this;
    }

    public addWebAPIProvider(path: string, dataFormat: string = "json"): ITranslationConfigAPI {
        this.configuration.providers.push({ args: { type: "WebAPI", path: path, dataFormat: dataFormat } });
        return this;
    }

    public addCustomProvider(args?: any): ITranslationConfigAPI {
        this.configuration.providers.push({ args: args });
        return this;
    }

    public useLocaleAsLanguage(): ITranslationConfigAPI {
        this.configuration.localeAsLanguage = true;
        return this;
    }

    public setMissingValue(value: string): ITranslationConfigAPI {
        this.configuration.missingValue = value;
        return this;
    }

    public setMissingKey(key: string): ITranslationConfigAPI {
        this.configuration.missingKey = key;
        return this;
    }

    public setComposedKeySeparator(keySeparator: string): ITranslationConfigAPI {
        this.configuration.keySeparator = keySeparator;
        return this;
    }

    public disableI18nPlural(): ITranslationConfigAPI {
        this.configuration.i18nPlural = false;
        return this;
    }

}
