import { DecimalCode } from './decimal-code';

export function isPresent(obj: any): boolean {
    return typeof obj !== "undefined" && obj != null;
}

export class RegExpFactory {

    /**
     * Builds the regular expression for a number according to default locale.
     */
    public number(defaultLocale: string, digits: string): RegExp {
        let minInt: number = 1;
        let minFraction: number = 0;
        let maxFraction: number = 3;

        if (isPresent(digits)) {
            const NUMBER_FORMAT_REGEXP: RegExp = /^(\d+)?\.((\d+)(\-(\d+))?)?$/;
            let parts: RegExpMatchArray = digits.match(NUMBER_FORMAT_REGEXP);
            if (isPresent(parts[1])) {  // Min integer digits.
                minInt = parseInt(parts[1]);
            }
            if (isPresent(parts[3])) {  // Min fraction digits.
                minFraction = parseInt(parts[3]);
            }
            if (isPresent(parts[5])) {  // Max fraction digits.
                maxFraction = parseInt(parts[5]);
            }
        }

        let decimalCode: DecimalCode = new DecimalCode(defaultLocale);

        let minusSign: string = decimalCode.minusSignCode;
        let zero: string = decimalCode.numbersCodes[0];
        let decimalSeparator: string = decimalCode.decimalSeparatorCode;
        let nine: string = decimalCode.numbersCodes[9];

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
        let regExp: RegExp = new RegExp(pattern);
        return regExp;
    }

}
