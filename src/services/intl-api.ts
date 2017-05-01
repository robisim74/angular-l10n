/**
 * Provides the methods to check if Intl APIs are supported.
 */
export class IntlAPI {

    public static HasDateTimeFormat(): boolean {
        const hasIntl: boolean = (Intl && typeof Intl === "object");
        return hasIntl && Intl​.hasOwnProperty​("DateTimeFormat");
    }

    public static HasNumberFormat(): boolean {
        const hasIntl: boolean = (Intl && typeof Intl === "object");
        return hasIntl && Intl.hasOwnProperty​("NumberFormat");
    }

    public static HasCollator(): boolean {
        const hasIntl: boolean = (Intl && typeof Intl === "object");
        return hasIntl && Intl.hasOwnProperty​("Collator");
    }

}
