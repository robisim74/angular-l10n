import { Injectable, Inject } from '@angular/core';

import { L10nLocale, L10nDateTimeFormatOptions, L10nNumberFormatOptions, Unit } from '../models/types';
import { L10N_LOCALE } from '../models/l10n-config';
import {
    hasDateTimeFormat,
    hasTimeZone,
    hasNumberFormat,
    hasRelativeTimeFormat,
    toDate,
    toNumber,
    isL10nDateTimeFormatOptions,
    isL10nNumberFormatOptions,
    PARSE_DATE_STYLE,
    PARSE_TIME_STYLE,
    parseDigits
} from '../models/utils';

@Injectable() export class L10nIntlService {

    constructor(@Inject(L10N_LOCALE) private locale: L10nLocale) { }

    /**
     * Formats a date.
     * @param value A date, a number (milliseconds since UTC epoch) or an ISO 8601 string
     * @param options A l10n or intl DateTimeFormatOptions object
     * @param language The current language
     * @param timeZone The current time zone
     */
    public formatDate(
        value: any,
        options?: L10nDateTimeFormatOptions | Intl.DateTimeFormatOptions,
        language = this.locale.language,
        timeZone = this.locale.timeZone
    ): string {
        if (!hasDateTimeFormat) return value;

        value = toDate(value);

        let dateTimeFormatOptions: Intl.DateTimeFormatOptions = {};
        if (options) {
            if (isL10nDateTimeFormatOptions(options)) {
                if (options.dateStyle) {
                    dateTimeFormatOptions = { ...dateTimeFormatOptions, ...PARSE_DATE_STYLE[options.dateStyle] };
                }
                if (options.timeStyle) {
                    dateTimeFormatOptions = { ...dateTimeFormatOptions, ...PARSE_TIME_STYLE[options.timeStyle] };
                }
            } else {
                dateTimeFormatOptions = { ...options };
            }
        }
        if (hasTimeZone()) {
            dateTimeFormatOptions.timeZone = timeZone;
        }

        return new Intl.DateTimeFormat(language, dateTimeFormatOptions).format(value);
    }

    /**
     * Formats a number.
     * @param value A number or a string
     * @param options A l10n or intl NumberFormatOptions object
     * @param language The current language
     * @param currency The current currency
     */
    public formatNumber(
        value: any,
        options?: L10nNumberFormatOptions | Intl.NumberFormatOptions,
        language = this.locale.language,
        currency = this.locale.currency
    ): string {
        if (!hasNumberFormat) return value;

        value = toNumber(value);

        let numberFormatOptions: Intl.NumberFormatOptions = {};
        if (options) {
            if (isL10nNumberFormatOptions(options)) {
                if (options.digits) {
                    numberFormatOptions = { ...numberFormatOptions, ...parseDigits(options.digits) };
                }
                numberFormatOptions.style = options.style;
                numberFormatOptions.currencyDisplay = options.currencyDisplay;
            } else {
                numberFormatOptions = { ...options };
            }
        }
        numberFormatOptions.currency = currency;

        return new Intl.NumberFormat(language, numberFormatOptions).format(value);
    }

    /**
     * Formats a relative time.
     * @param value A negative (or positive) number
     * @param unit The unit of the value
     * @param options A intl RelativeTimeFormatOptions object
     * @param language The current language
     */
    public formatRelativeTime(
        value: any,
        unit: Unit,
        options?: Intl.RelativeTimeFormatOptions,
        language = this.locale.language
    ): string {
        if (!hasRelativeTimeFormat) return value;

        return new Intl.RelativeTimeFormat(language, options).format(value, unit);
    }

    public getCurrencySymbol(locale = this.locale): string | undefined {
        let symbol = locale.currency;
        if (hasNumberFormat()) {
            const decimal = this.formatNumber(0, { digits: '1.0-0' }, locale.language);
            const currency = this.formatNumber(
                0,
                { digits: '1.0-0', style: 'currency', currencyDisplay: 'symbol' },
                locale.language,
                locale.currency
            );
            symbol = currency.replace(decimal, '');
            symbol = symbol.trim();
        }
        return symbol;
    }

}
