import { Injectable } from '@angular/core';

import { NumberCode } from './number-code';
import { LocaleService } from '../../services/locale.service';
import { IntlAPI } from '../../services/intl-api';
import { Decimal } from '../types';

@Injectable() export class DecimalCode extends NumberCode {

    protected get decimalCodes(): Decimal {
        let decimalCodes: Decimal = {
            minusSign: this.toUnicode("-"),
            decimalSeparator: this.toUnicode(".")
        };

        if (IntlAPI.hasNumberFormat()) {
            const value: number = -0.9; // Reference value.
            const localeValue: string = new Intl.NumberFormat(this.locale.getDefaultLocale()).format(value);

            const unicodeChars: string[] = [];
            unicodeChars.push(this.toUnicode(localeValue.charAt(0)));
            unicodeChars.push(this.toUnicode(localeValue.charAt(1)));
            unicodeChars.push(this.toUnicode(localeValue.charAt(2)));
            unicodeChars.push(this.toUnicode(localeValue.charAt(3)));

            // Right to left:
            // checks Unicode characters 'RIGHT-TO-LEFT MARK' (U+200F) & 'Arabic Letter Mark' (U+061C),
            // or the reverse order.
            // Left to right:
            // checks Unicode character 'LEFT-TO-RIGHT MARK' (U+200E).
            if (unicodeChars[0] == "\\u200F" || unicodeChars[0] == "\\u061C") {
                decimalCodes = {
                    minusSign: unicodeChars[1],
                    decimalSeparator: unicodeChars[3]
                };
            } else if (unicodeChars[0] == this.toUnicode(
                new Intl.NumberFormat(this.locale.getDefaultLocale()).format(0))
            ) {
                decimalCodes = {
                    minusSign: unicodeChars[3],
                    decimalSeparator: unicodeChars[1]
                };
            } else if (unicodeChars[0] == "\\u200E") {
                decimalCodes = {
                    minusSign: unicodeChars[1],
                    decimalSeparator: unicodeChars[3]
                };
            } else {
                decimalCodes = {
                    minusSign: unicodeChars[0],
                    decimalSeparator: unicodeChars[2]
                };
            }
        }
        return decimalCodes;
    }

    constructor(protected locale: LocaleService) {
        super(locale);
    }

    public parse(s: string): number {
        let value: string = "";

        const decimalCodes: Decimal = this.decimalCodes;

        const characters: string[] = s.split("");
        for (const char of characters) {
            const charCode: string = this.toUnicode(char);
            const index: number = this.numberCodes.indexOf(charCode);
            if (index != -1) {
                value += index;
            } else if (charCode == decimalCodes.minusSign) {
                value += "-";
            } else if (charCode == decimalCodes.decimalSeparator) {
                value += ".";
            } else { return NaN; }
        }
        return parseFloat(value);
    }

    public getRegExp(digits: string): RegExp {
        let minInt: number = 1;
        let minFraction: number = 0;
        let maxFraction: number = 3;

        if (!!digits) {
            const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;
            const parts: RegExpMatchArray | null = digits.match(NUMBER_FORMAT_REGEXP);
            if (parts != null) {
                if (parts[1] != null) {  // Min integer digits.
                    minInt = parseInt(parts[1]);
                }
                if (parts[3] != null) {  // Min fraction digits.
                    minFraction = parseInt(parts[3]);
                }
                if (parts[5] != null) {  // Max fraction digits.
                    maxFraction = parseInt(parts[5]);
                }
            }
        }

        const minusSign: string = this.decimalCodes.minusSign;
        const zero: string = this.numberCodes[0];
        const decimalSeparator: string = this.decimalCodes.decimalSeparator;
        const nine: string = this.numberCodes[9];

        // Pattern for 1.2-2 digits: /^-?[0-9]{1,}\.[0-9]{2,2}$/
        // Unicode pattern = "^\u002d?[\u0030-\u0039]{1,}\\u002e[\u0030-\u0039]{2,2}$"
        let pattern: string;
        if (minFraction > 0 && maxFraction > 0) {
            pattern = "^"
                + minusSign
                + "?[" + zero + "-" + nine
                + "]{" + minInt + ",}\\"
                + decimalSeparator
                + "[" + zero + "-" + nine
                + "]{" + minFraction + "," + maxFraction
                + "}$";
        } else if (minFraction == 0 && maxFraction > 0) {
            // Decimal separator is optional.
            pattern = "^"
                + minusSign
                + "?[" + zero + "-" + nine
                + "]{" + minInt + ",}\\"
                + decimalSeparator
                + "?[" + zero + "-" + nine
                + "]{" + minFraction + "," + maxFraction
                + "}$";
        } else {
            // Integer number.
            pattern = "^"
                + minusSign
                + "?[" + zero + "-" + nine
                + "]{" + minInt + ",}$";
        }
        pattern = this.toChar(pattern);
        const regExp: RegExp = new RegExp(pattern);
        return regExp;
    }

}
