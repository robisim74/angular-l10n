import { Codes } from './codes';
import { Language } from './language';

export class Config extends Codes {

    public languageCodes: Language[] = [];

    public storageIsDisabled: boolean = false;
    public localStorage: boolean = false;
    public cookiesExpirationDays: number;

}
