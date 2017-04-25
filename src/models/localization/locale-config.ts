import { Injectable } from '@angular/core';

import { Codes } from './codes';
import { Language } from './language';

@Injectable() export class LocaleConfig extends Codes {

    public languageCodes: Language[] = [];

    public storageIsDisabled: boolean = false;
    public localStorage: boolean = false;
    public cookiesExpirationDays: number;

}
