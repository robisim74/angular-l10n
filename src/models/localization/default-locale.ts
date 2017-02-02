import { DefaultLocaleCodes } from './default-locale-codes';

export class DefaultLocale extends DefaultLocaleCodes {

    public get value(): string {
        return this._value;
    }

    public set value(defaultLocale: string) {
        this._value = defaultLocale;
        this.parseValue();
    }

    private _value: string;

    public build(
        languageCode: string,
        countryCode?: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): void {
        this.languageCode = languageCode;
        this.scriptCode = scriptCode;
        this.countryCode = countryCode;
        this.numberingSystem = numberingSystem;
        this.calendar = calendar;

        let value: string[] = [];
        value.push(languageCode);
        value.push(!!scriptCode ? "-" + scriptCode : "");
        value.push(!!countryCode ? "-" + countryCode : "");
        // Adds the 'u' (Unicode) extension.
        value.push((!!numberingSystem || !!calendar) ? "-u" : "");
        value.push(!!numberingSystem ? "-nu-" + numberingSystem : "");
        value.push(!!calendar ? "-ca-" + calendar : "");
        this._value = value.join("");
    }

    private parseValue(): void {
        if (!!this.value) {
            let value: string = this.value;
            // Looks for the 'u' (Unicode) extension.
            let index: number = value.search("-u");
            if (index != -1) {
                let extensions: string[] = value.substring(index + 1).split("-");
                switch (extensions.length) {
                    case 3:
                        if (extensions[1] == "nu") {
                            this.numberingSystem = extensions[2];
                        } else if (extensions[1] == "ca") {
                            this.calendar = extensions[2];
                        }
                        break;
                    default:
                        this.numberingSystem = extensions[2];
                        this.calendar = extensions[4];
                        break;
                }
                // Extracts the codes.
                value = value.substring(0, index);
            }

            let codes: string[] = value.split("-");
            switch (codes.length) {
                case 1:
                    this.languageCode = codes[0];
                    break;
                case 2:
                    this.languageCode = codes[0];
                    this.countryCode = codes[1];
                    break;
                default:
                    this.languageCode = codes[0];
                    this.scriptCode = codes[1];
                    this.countryCode = codes[2];
                    break;
            }
        }
    }

}
