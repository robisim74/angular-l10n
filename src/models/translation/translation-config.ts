import { TranslationService } from '../../services/translation.service';

export class TranslationConfig {

    constructor(private translation: TranslationService) { }

    /**
     * Direct loading: adds translation data.
     * @param languageCode ISO 639 two-letter or three-letter code of the language
     * @param translation Translation data of the language
     */
    public AddTranslation(languageCode: string, translation: any): TranslationConfig {
        this.translation.configuration.translationData[languageCode] = translation;
        return this;
    }

    /**
     * Asynchronous loading: adds a translation provider.
     * @param prefix The path prefix of the json files
     * @param dataFormat Data format: default & supported value is 'json'
     * @param webAPI True if the asynchronous loading uses a Web API to get the data
     */
    public AddProvider(prefix: string, dataFormat: string = "json", webAPI: boolean = false): TranslationConfig {
        this.translation.configuration.providers.push({ prefix, dataFormat, webAPI });
        return this;
    }

    /**
     * Sets the use of locale (languageCode-countryCode) as language.
     */
    public UseLocaleAsLanguage(): TranslationConfig {
        this.translation.configuration.localeAsLanguage = true;
        return this;
    }

    /**
     * Sets the value to use for missing keys.
     */
    public SetMissingValue(value: string): TranslationConfig {
        this.translation.configuration.missingValue = value;
        return this;
    }

    /**
     * Sets the key to use for missing keys.
     */
    public SetMissingKey(key: string): TranslationConfig {
        this.translation.configuration.missingKey = key;
        return this;
    }

    /**
     * Sets composed key separator. Default is the point '.'.
     */
    public SetComposedKeySeparator(keySeparator: string): TranslationConfig {
        this.translation.configuration.keySeparator = keySeparator;
        return this;
    }

}
