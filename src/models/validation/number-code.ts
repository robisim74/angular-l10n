import { IntlAPI } from '../../services/intl-api';

/**
 * Converts numbers to Unicode according to default locale.
 */
export abstract class NumberCode {

    /**
     * Unicode for numbers from 0 to 9.
     */
    public numbersCodes: string[] = [];

    constructor(public defaultLocale: string) {
        for (let num: number = 0; num <= 9; num++) {
            this.numbersCodes.push(this.Unicode(num.toString()));
        }

        // Tries to update Unicode for numbers according to default locale.
        if (IntlAPI.HasNumberFormat()) {
            for (let num: number = 0; num <= 9; num++) {
                this.numbersCodes[num] = this.Unicode(
                    new Intl.NumberFormat(defaultLocale).format(num)
                );
            }
        }
    }

    public abstract parse(s: string): number;

    public UnicodeToChar(pattern: string): string {
        return pattern.replace(/\\u[\dA-F]{4}/gi, (match: string) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
    }

    protected Unicode(c: string): string {
        return "\\u" + this.HexEncode(c.charCodeAt(0));
    }

    protected HexEncode(value: number): string {
        let hex: string = value.toString(16).toUpperCase();
        // With padding.
        hex = "0000".substr(0, 4 - hex.length) + hex;
        return hex;
    }

}
