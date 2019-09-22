/**
 * Remove when the proposals becomes standard.
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
        new(locales?: string | string[], options?: RelativeTimeFormatOptions): RelativeTimeFormat;
        (locales?: string | string[], options?: RelativeTimeFormatOptions): RelativeTimeFormat;
    };
    interface ListFormatOptions {
        localeMatcher?: string;
        type?: string;
        style?: string;
    }
    interface ListFormat {
        format(list?: Iterable<string>): string;
    }
    var ListFormat: {
        new(locales?: string | string[], options?: ListFormatOptions): ListFormat;
        (locales?: string | string[], options?: ListFormatOptions): ListFormat;
    };
}
