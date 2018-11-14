import { Injectable } from '@angular/core';

import { DefaultLocaleCodes } from './types';

@Injectable() export class DefaultLocaleBuilder implements DefaultLocaleCodes {

    public languageCode: string;
    public scriptCode?: string;
    public countryCode?: string;
    public numberingSystem?: string;
    public calendar?: string;

    public get value(): string {
        return this.formattedValue;
    }

    public set value(defaultLocale: string) {
        this.formattedValue = defaultLocale;
        this.parseValue();
    }

    private formattedValue: string;

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

        let value: string = languageCode;
        value += !!scriptCode ? "-" + scriptCode : "";
        value += !!countryCode ? "-" + countryCode : "";
        // Adds the 'u' (Unicode) extension.
        value += (!!numberingSystem || !!calendar) ? "-u" : "";
        value += !!numberingSystem ? "-nu-" + numberingSystem : "";
        value += !!calendar ? "-ca-" + calendar : "";
        this.formattedValue = value;
    }

    private parseValue(): void {
        if (!!this.value) {
            let value: string = this.value;
            // Looks for the 'u' (Unicode) extension.
            const index: number = value.search("-u");
            if (index != -1) {
                const extensions: string[] = value.substring(index + 1).split("-");
                switch (extensions.length) {
                    case 3:
                        if (extensions[1] == "nu") {
                            this.numberingSystem = extensions[2];
                            this.calendar = undefined;
                        } else if (extensions[1] == "ca") {
                            this.numberingSystem = undefined;
                            this.calendar = extensions[2];
                        }
                        break;
                    default:
                        this.numberingSystem = extensions[2];
                        this.calendar = extensions[4];
                }
                // Extracts the codes.
                value = value.substring(0, index);
            }

            const codes: string[] = value.split("-");
            switch (codes.length) {
                case 1:
                    this.languageCode = codes[0];
                    this.scriptCode = undefined;
                    this.countryCode = undefined;
                    break;
                case 2:
                    this.languageCode = codes[0];
                    this.scriptCode = undefined;
                    this.countryCode = codes[1];
                    break;
                default:
                    this.languageCode = codes[0];
                    this.scriptCode = codes[1];
                    this.countryCode = codes[2];
            }
        }
    }

}
