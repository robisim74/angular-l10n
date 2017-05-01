import { IntlAPI } from '../../services/intl-api';
import { NumberCode } from './number-code';

/**
 * Converts numbers & signs to Unicode according to default locale.
 */
export class DecimalCode extends NumberCode {

    /**
     * Unicode for minus sign.
     */
    public minusSignCode: string;

    /**
     * Unicode for decimal separator.
     */
    public decimalSeparatorCode: string;

    constructor(public defaultLocale: string) {
        super(defaultLocale);

        this.minusSignCode = this.Unicode("-");
        this.decimalSeparatorCode = this.Unicode(".");

        // Tries to update Unicode for signs according to default locale.
        if (IntlAPI.HasNumberFormat()) {
            let value: number = -0.9; // Reference value.
            let localeValue: string = new Intl.NumberFormat(defaultLocale).format(value);

            const unicodeChars: string[] = [];
            unicodeChars.push(this.Unicode(localeValue.charAt(0)));
            unicodeChars.push(this.Unicode(localeValue.charAt(1)));
            unicodeChars.push(this.Unicode(localeValue.charAt(2)));
            unicodeChars.push(this.Unicode(localeValue.charAt(3)));

            // Checks Unicode characters 'RIGHT-TO-LEFT MARK' (U+200F) & 'Arabic Letter Mark (U+061C)'.
            if (unicodeChars[0] == "\\u200F" || unicodeChars[0] == "\\u061C") {
                // Right to left.
                this.minusSignCode = unicodeChars[1];
                this.decimalSeparatorCode = unicodeChars[3];
            } else if (unicodeChars[0] == this.Unicode(new Intl.NumberFormat(defaultLocale).format(0))) {
                // Some IE & Edge versions reverse the order.
                this.minusSignCode = unicodeChars[3];
                this.decimalSeparatorCode = unicodeChars[1];
            } else {
                // Left to right.
                this.minusSignCode = unicodeChars[0];
                this.decimalSeparatorCode = unicodeChars[2];
            }
        }
    }

    public parse(s: string): number {
        let characters: string[] = s.split("");
        let value: string = "";
        for (let char of characters) {
            let charCode: string = this.Unicode(char);
            let index: number = this.numbersCodes.indexOf(charCode);
            if (index != -1) {
                value += index;
            } else if (charCode == this.minusSignCode) {
                value += "-";
            } else if (charCode == this.decimalSeparatorCode) {
                value += ".";
            } else { return NaN; }
        }
        return parseFloat(value);
    }

}
