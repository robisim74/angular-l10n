/**
 * Remove when the proposal becomes standard.
 */
declare namespace Intl {
    interface RelativeTimeFormat {
        format(value: number, unit: string): string;
    }
    var RelativeTimeFormat: {
        new(locales?: string | string[], options?: any): RelativeTimeFormat;
        (locales?: string | string[], options?: any): RelativeTimeFormat;
    };
}
