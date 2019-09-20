/**
 * Remove when the proposal becomes standard.
 */
declare namespace Intl {
    interface RelativeTimeFormatOptions {
        localeMatcher?: string;
        numeric?: string;
        style?: string;
    }
    interface RelativeTimeFormat {
        format(value: number, unit: string): string;
    }
    var RelativeTimeFormat: {
        new(locales?: string | string[], options?: any): RelativeTimeFormat;
        (locales?: string | string[], options?: any): RelativeTimeFormat;
    };
}
