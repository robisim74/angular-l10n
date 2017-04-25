import { Injectable } from '@angular/core';

import { Provider } from './provider';

@Injectable() export class TranslationConfig {

    public translationData: any = {};
    public providers: Provider[] = [];
    public localeAsLanguage: boolean = false;
    public missingValue: string;
    public missingKey: string;
    public keySeparator: string = ".";
    public i18nPlural: boolean = true;

}
