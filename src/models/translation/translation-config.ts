import { Injectable } from '@angular/core';

import { Provider } from '../types';

export interface ITranslationConfig {

    translationData: any;

    providers: Provider[];
    localeAsLanguage: boolean;
    missingValue: string;
    keySeparator: string;
    i18nPlural: boolean;

}

@Injectable() export class TranslationConfig implements ITranslationConfig {

    public translationData: any = {};

    public providers: Provider[] = [];
    public localeAsLanguage: boolean = false;
    public missingValue: string;
    public keySeparator: string = ".";
    public i18nPlural: boolean = true;

}
