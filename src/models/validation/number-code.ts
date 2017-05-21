import { Injectable } from '@angular/core';

import { LocaleService } from '../../services/locale.service';
import { IntlAPI } from '../../services/intl-api';

@Injectable() export abstract class NumberCode {

    protected get numberCodes(): string[] {
        const numberCodes: string[] = [];

        for (let num: number = 0; num <= 9; num++) {
            numberCodes.push(this.toUnicode(num.toString()));
        }

        if (IntlAPI.hasNumberFormat()) {
            for (let num: number = 0; num <= 9; num++) {
                numberCodes[num] = this.toUnicode(
                    new Intl.NumberFormat(this.locale.getDefaultLocale()).format(num)
                );
            }
        }
        return numberCodes;
    }

    constructor(protected locale: LocaleService) { }

    public abstract parse(s: string): number;

    public abstract getRegExp(digits: string): RegExp;

    protected toChar(pattern: string): string {
        return pattern.replace(/\\u[\dA-F]{4}/gi, (match: string) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
    }

    protected toUnicode(c: string): string {
        return "\\u" + this.toHex(c.charCodeAt(0));
    }

    private toHex(value: number): string {
        let hex: string = value.toString(16).toUpperCase();
        // With padding.
        hex = "0000".substr(0, 4 - hex.length) + hex;
        return hex;
    }

}
