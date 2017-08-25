/**
 * Provides the methods to check if Intl APIs are supported.
 */
export class IntlAPI {

    public static hasIntl(): boolean {
        const hasIntl: boolean = Intl && typeof Intl === "object";
        return hasIntl;
    }

    public static hasDateTimeFormat(): boolean {
        return IntlAPI.hasIntl && Intl​.hasOwnProperty​("DateTimeFormat");
    }

    public static hasNumberFormat(): boolean {
        return IntlAPI.hasIntl && Intl.hasOwnProperty​("NumberFormat");
    }

    public static hasCollator(): boolean {
        return IntlAPI.hasIntl && Intl.hasOwnProperty​("Collator");
    }

}
