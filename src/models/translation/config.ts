import { Provider } from './provider';

export class Config {

    public translationData: any = {};
    public providers: Provider[] = [];
    public localeAsLanguage: boolean = false;
    public missingValue: string;
    public missingKey: string;
    public keySeparator: string = ".";
    public i18nPlural: boolean = true;

}
