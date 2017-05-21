import { Injectable } from '@angular/core';

import { LocaleCodes } from './locale-codes';
import { Language } from '../types';

export interface ILocaleConfig extends LocaleCodes {

    languageCodes: Language[];

    storageIsDisabled: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    cookiesExpirationDays?: number;

}

@Injectable() export class LocaleConfig implements ILocaleConfig {

    public languageCode: string;
    public scriptCode?: string;
    public countryCode?: string;
    public numberingSystem?: string;
    public calendar?: string;

    public currencyCode: string;

    public languageCodes: Language[] = [];

    public storageIsDisabled: boolean = false;
    public localStorage: boolean = false;
    public sessionStorage: boolean = false;
    public cookiesExpirationDays?: number;

}
