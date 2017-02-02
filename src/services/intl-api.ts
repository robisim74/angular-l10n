/**
 * Provides the methods to check if Intl APIs are supported.
 */
export class IntlAPI {

    public static HasDateTimeFormat(): boolean {
        let hasIntl: boolean = (Intl && typeof Intl === "object");
        return hasIntl && Intl​.hasOwnProperty​("DateTimeFormat");
    }

    public static HasNumberFormat(): boolean {
        let hasIntl: boolean = (Intl && typeof Intl === "object");
        return hasIntl && Intl.hasOwnProperty​("NumberFormat");
    }

    public static HasCollator(): boolean {
        let hasIntl: boolean = (Intl && typeof Intl === "object");
        return hasIntl && Intl.hasOwnProperty​("Collator");
    }

}
