import { DecimalCode } from './decimal-code';

export class RegExpFactory {

    /**
     * Builds the regular expression for a number according to default locale.
     */
    public static number(defaultLocale: string, digits: string): RegExp {
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

        const decimalCode: DecimalCode = new DecimalCode(defaultLocale);

        const minusSign: string = decimalCode.minusSignCode;
        const zero: string = decimalCode.numbersCodes[0];
        const decimalSeparator: string = decimalCode.decimalSeparatorCode;
        const nine: string = decimalCode.numbersCodes[9];

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
        pattern = decimalCode.UnicodeToChar(pattern);
        const regExp: RegExp = new RegExp(pattern);
        return regExp;
    }

}
