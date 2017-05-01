export interface DefaultLocaleCodes {

    languageCode: string;
    scriptCode?: string;
    countryCode?: string;
    numberingSystem?: string;
    calendar?: string;

}

export interface LocaleCodes extends DefaultLocaleCodes {

    currencyCode: string;

}
