/**
 * Provides the methods to check if Intl APIs are supported.
 */
export class IntlAPI {

    public static HasDateTimeFormat(): boolean {
        let hasIntl: boolean = typeof Intl === "object" && !!Intl;
        return hasIntl && Intl​.hasOwnProperty​("DateTimeFormat");
    }

    public static HasNumberFormat(): boolean {
        let hasIntl: boolean = typeof Intl === "object" && !!Intl;
        return hasIntl && Intl.hasOwnProperty​("NumberFormat");
    }

    public static HasCollator(): boolean {
        let hasIntl: boolean = typeof Intl === "object" && !!Intl;
        return hasIntl && Intl.hasOwnProperty​("Collator");
    }

}
