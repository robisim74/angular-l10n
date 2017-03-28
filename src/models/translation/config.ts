import { Provider } from './provider';

export class Config {

    public providers: Provider[] = [];
    public localeAsLanguage: boolean = false;
    public missingValue: string;
    public missingKey: string;
    public keySeparator: string = ".";

}
