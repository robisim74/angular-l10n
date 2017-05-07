/**
 * Provides the methods to check if Intl APIs are supported.
 */
export class IntlAPI {

    private static readonly hasIntl: boolean = (typeof Intl === "object");

    public static HasDateTimeFormat(): boolean {
        return IntlAPI.hasIntl && Intl​.hasOwnProperty​("DateTimeFormat");
    }

    public static HasNumberFormat(): boolean {
        return IntlAPI.hasIntl && Intl.hasOwnProperty​("NumberFormat");
    }

    public static HasCollator(): boolean {
        return IntlAPI.hasIntl && Intl.hasOwnProperty​("Collator");
    }

}
