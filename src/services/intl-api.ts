/**
 * Provides the methods to check if Intl APIs are supported.
 */
export class IntlAPI {

    public static hasIntl(): boolean {
        const hasIntl: boolean = typeof Intl === "object" && Intl;
        return hasIntl;
    }

    public static hasDateTimeFormat(): boolean {
        return IntlAPI.hasIntl && Intl​.hasOwnProperty​("DateTimeFormat");
    }

    public static hasTimezone(): boolean {
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles' }).format(new Date());
        } catch (e) {
            return false;
        }
        return true;
    }

    public static hasNumberFormat(): boolean {
        return IntlAPI.hasIntl && Intl.hasOwnProperty​("NumberFormat");
    }

    public static hasCollator(): boolean {
        return IntlAPI.hasIntl && Intl.hasOwnProperty​("Collator");
    }

}
