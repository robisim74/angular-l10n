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

            // Checks Unicode character 'RIGHT-TO-LEFT MARK' (U+200F).
            if (this.Unicode(localeValue.charAt(0)) == "\\u200F") {
                // Right to left.
                this.minusSignCode = this.Unicode(localeValue.charAt(1));
                this.decimalSeparatorCode = this.Unicode(localeValue.charAt(3));
            } else if (this.Unicode(localeValue.charAt(0)) == this.Unicode(
                new Intl.NumberFormat(defaultLocale).format(0)
            )) {
                // IE & Edge reverse the order.
                this.minusSignCode = this.Unicode(localeValue.charAt(3));
                this.decimalSeparatorCode = this.Unicode(localeValue.charAt(1));
            } else {
                // Left to right.
                this.minusSignCode = this.Unicode(localeValue.charAt(0));
                this.decimalSeparatorCode = this.Unicode(localeValue.charAt(2));
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
