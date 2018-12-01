import { Injectable } from '@angular/core';

import { LocaleService } from './locale.service';
import { IntlAPI } from './intl-api';
import { formatDigitsAliases } from '../models/intl-formatter';
import { Decimal, DigitsOptions } from '../models/types';

export interface ILocaleValidation {

    parseNumber(s: string, defaultLocale?: string): number | null;

    getRegExp(digits: string): RegExp;

}

/**
 * Provides the methods for locale validation.
 */
@Injectable() export class LocaleValidation implements ILocaleValidation {

    constructor(private locale: LocaleService) { }

    /**
     * Converts a string to a number according to default locale.
     * If the string cannot be converted to a number, returns NaN.
     */
    public parseNumber(s: string, defaultLocale?: string): number | null {
        if (s == "" || s == null) {
            return null;
        }
        let value: string = "";

        const decimalCode: Decimal = this.getDecimalCode(defaultLocale);
        const numberCodes: string[] = this.getNumberCodes(defaultLocale);

        const characters: string[] = s.split("");
        for (const char of characters) {
            const charCode: string = this.toUnicode(char);
            const index: number = numberCodes.indexOf(charCode);
            if (index != -1) {
                value += index;
            } else if (charCode == decimalCode.minusSign) {
                value += "-";
            } else if (charCode == decimalCode.decimalSeparator) {
                value += ".";
            } else if (charCode == decimalCode.thousandSeparator) {
                continue;
            } else { return NaN; }
        }
        return parseFloat(value);
    }

    public getRegExp(digits: string | DigitsOptions): RegExp {
        const digitsOptions: DigitsOptions = typeof digits === "string" ? formatDigitsAliases(digits) : digits;
        const minInt: number = digitsOptions.minimumIntegerDigits || 1;
        const minFraction: number = digitsOptions.minimumFractionDigits || 0;
        const maxFraction: number = digitsOptions.maximumFractionDigits || 3;

        const decimalCode: Decimal = this.getDecimalCode();
        const numberCodes: string[] = this.getNumberCodes();

        const minusSign: string = decimalCode.minusSign;
        const zero: string = numberCodes[0];
        const decimalSeparator: string = decimalCode.decimalSeparator;
        const thousandSeparator: string = decimalCode.thousandSeparator;
        const nine: string = numberCodes[9];

        // Pattern for 1.0-2 digits: /^-?[0-9]{1,}(\.[0-9]{0,2})?$/
        // Unicode pattern = "^\u002d?[\u0030-\u0039]{1,}(\\u002e[\u0030-\u0039]{0,2})?$"
        // Complete Pattern with thousand separator:
        // /^-?([0-9]{1,}|(?=(?:\,*[0-9]){1,}(\.|$))(?!0(?!\.|[0-9]))[0-9]{1,3}(\,[0-9]{3})*)(\.[0-9]{0,2})?$/
        // where:
        // (?=(?:\,*[0-9]){1,}(\.|$)) => Positive Lookahead to count the integer digits
        // (?!0(?!\.|[0-9])) => Negative Lookahead to avoid 0,1111.00
        // [0-9]{1,3}(\,[0-9]{3})* => Allows thousand separator
        const d: string = `[${zero}-${nine}]`;
        const n: string = `{${minInt},}`;
        const nm: string = `{${minFraction},${maxFraction}}`;
        const plainPattern: string = `${d}${n}`;
        // tslint:disable-next-line
        const thousandPattern: string = `(?=(?:\\${thousandSeparator}*${d})${n}(\\${decimalSeparator}|$))(?!${zero}(?!\\${decimalSeparator}|${d}))${d}{1,3}(\\${thousandSeparator}${d}{3})*`;

        let pattern: string = `^${minusSign}?(${plainPattern}|${thousandPattern})`;
        if (minFraction > 0 && maxFraction > 0) {
            // Decimal separator is mandatory.
            pattern += `\\${decimalSeparator}${d}${nm}$`;
        } else if (minFraction == 0 && maxFraction > 0) {
            // Decimal separator is optional.
            pattern += `(\\${decimalSeparator}${d}${nm})?$`;
        } else {
            // Integer number.
            pattern += `$`;
        }
        pattern = this.toChar(pattern);

        return new RegExp(pattern);
    }

    private getDecimalCode(defaultLocale?: string): Decimal {
        let decimalCode: Decimal = {
            minusSign: this.toUnicode("-"),
            decimalSeparator: this.toUnicode("."),
            thousandSeparator: this.toUnicode(",")
        };

        if (IntlAPI.hasNumberFormat()) {
            const value: number = -1000.9; // Reference value.
            const localeValue: string = this.locale.formatDecimal(value, defaultLocale);

            const unicodeChars: string[] = [];
            for (let i: number = 0; i <= 7; i++) {
                unicodeChars.push(this.toUnicode(localeValue.charAt(i)));
            }

            // Right to left:
            // checks Unicode characters 'RIGHT-TO-LEFT MARK' (U+200F) & 'Arabic Letter Mark' (U+061C),
            // or the reverse order.
            // Left to right:
            // checks Unicode character 'LEFT-TO-RIGHT MARK' (U+200E).
            if (unicodeChars[0] == "\\u200F" || unicodeChars[0] == "\\u061C") {
                decimalCode = {
                    minusSign: unicodeChars[1],
                    decimalSeparator: unicodeChars[7],
                    thousandSeparator: unicodeChars[3]
                };
            } else if (unicodeChars[0] == this.toUnicode(this.locale.formatDecimal(1, defaultLocale))) {
                decimalCode = {
                    minusSign: unicodeChars[7],
                    decimalSeparator: unicodeChars[5],
                    thousandSeparator: unicodeChars[1]
                };
            } else if (unicodeChars[0] == "\\u200E") {
                decimalCode = {
                    minusSign: unicodeChars[1],
                    decimalSeparator: unicodeChars[7],
                    thousandSeparator: unicodeChars[3]
                };
            } else {
                decimalCode = {
                    minusSign: unicodeChars[0],
                    decimalSeparator: unicodeChars[6],
                    thousandSeparator: unicodeChars[2]
                };
            }
        }
        return decimalCode;
    }

    private getNumberCodes(defaultLocale?: string): string[] {
        const numberCodes: string[] = [];

        for (let num: number = 0; num <= 9; num++) {
            numberCodes.push(this.toUnicode(num.toString()));
        }

        if (IntlAPI.hasNumberFormat()) {
            for (let num: number = 0; num <= 9; num++) {
                numberCodes[num] = this.toUnicode(this.locale.formatDecimal(num, defaultLocale));
            }
        }
        return numberCodes;
    }

    private toChar(pattern: string): string {
        return pattern.replace(/\\u[\dA-F]{4}/gi, (match: string) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
    }

    private toUnicode(c: string): string {
        return "\\u" + this.toHex(c.charCodeAt(0));
    }

    private toHex(value: number): string {
        let hex: string = value.toString(16).toUpperCase();
        // With padding.
        hex = "0000".substr(0, 4 - hex.length) + hex;
        return hex;
    }

}
