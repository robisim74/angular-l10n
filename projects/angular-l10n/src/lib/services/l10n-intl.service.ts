/// <reference path='../../typings.d.ts'/>

import { Injectable, Inject } from '@angular/core';

import { L10nLocale, L10nDateTimeFormatOptions, L10nNumberFormatOptions, Unit } from '../models/types';
import { L10N_LOCALE } from '../models/l10n-config';
import {
    hasDateTimeFormat,
    hasTimeZone,
    hasNumberFormat,
    hasRelativeTimeFormat,
    hasCollator,
    hasPluralRules,
    hasListFormat,
    toDate,
    toNumber,
    PARSE_DATE_STYLE,
    PARSE_TIME_STYLE,
    parseDigits
} from '../models/utils';
import { L10nTranslationService } from './l10n-translation.service';

@Injectable() export class L10nIntlService {

    constructor(@Inject(L10N_LOCALE) private locale: L10nLocale, private translation: L10nTranslationService) { }

    /**
     * Formats a date.
     * @param value A date, a number (milliseconds since UTC epoch) or an ISO 8601 string
     * @param options A L10n or Intl DateTimeFormatOptions object
     * @param language The current language
     * @param timeZone The current time zone
     */
    public formatDate(
        value: any,
        options?: L10nDateTimeFormatOptions,
        language = this.locale.dateLanguage || this.locale.language,
        timeZone = this.locale.timeZone
    ): string {
        if (!hasDateTimeFormat() || language == null || language === '') return value;

        value = toDate(value);

        let dateTimeFormatOptions: Intl.DateTimeFormatOptions = {};
        if (options) {
            if (options) {
                const { dateStyle, timeStyle, ...rest } = options;
                if (dateStyle) {
                    dateTimeFormatOptions = { ...dateTimeFormatOptions, ...PARSE_DATE_STYLE[dateStyle] };
                }
                if (timeStyle) {
                    dateTimeFormatOptions = { ...dateTimeFormatOptions, ...PARSE_TIME_STYLE[timeStyle] };
                }
                dateTimeFormatOptions = { ...dateTimeFormatOptions, ...rest };
            }
        }
        if (hasTimeZone() && timeZone) {
            dateTimeFormatOptions.timeZone = timeZone;
        }

        return new Intl.DateTimeFormat(language, dateTimeFormatOptions).format(value);
    }

    /**
     * Formats a number.
     * @param value A number or a string
     * @param options A L10n or Intl NumberFormatOptions object
     * @param language The current language
     * @param currency The current currency
     */
    public formatNumber(
        value: any,
        options?: L10nNumberFormatOptions,
        language = this.locale.numberLanguage || this.locale.language,
        currency = this.locale.currency
    ): string {
        if (!hasNumberFormat() && options && options.style === 'currency') return `${value} ${currency}`;
        if (!hasNumberFormat() || language == null || language === '') return value;

        value = toNumber(value);

        let numberFormatOptions: Intl.NumberFormatOptions = {};
        if (options) {
            const { digits, ...rest } = options;
            if (digits) {
                numberFormatOptions = { ...numberFormatOptions, ...parseDigits(digits) };
            }
            numberFormatOptions = { ...numberFormatOptions, ...rest };
        }
        if (currency) numberFormatOptions.currency = currency;

        return new Intl.NumberFormat(language, numberFormatOptions).format(value);
    }

    /**
     * Formats a relative time.
     * @param value A negative (or positive) number
     * @param unit The unit of the value
     * @param options A Intl RelativeTimeFormatOptions object
     * @param language The current language
     */
    public formatRelativeTime(
        value: any,
        unit: Unit,
        options?: Intl.RelativeTimeFormatOptions,
        language = this.locale.dateLanguage || this.locale.language
    ): string {
        if (!hasRelativeTimeFormat() || language == null || language === '') return value;

        value = toNumber(value);

        return new Intl.RelativeTimeFormat(language, options).format(value, unit);
    }

    public getCurrencySymbol(locale = this.locale): string | undefined {
        let symbol = locale.currency;
        if (hasNumberFormat()) {
            const decimal = this.formatNumber(0, { digits: '1.0-0' }, locale.numberLanguage || locale.language);
            const currency = this.formatNumber(
                0,
                { digits: '1.0-0', style: 'currency', currencyDisplay: 'symbol' },
                locale.numberLanguage || locale.language,
                locale.currency
            );
            symbol = currency.replace(decimal, '');
            symbol = symbol.trim();
        }
        return symbol;
    }

    /**
     * Compares two keys by the value of translation.
     * @param key1, First key to compare
     * @param key1, Second key to compare
     * @param options A Intl CollatorOptions object
     * @param language The current language
     * @return A negative value if the value of translation of key1 comes before the value of translation of key2;
     *         a positive value if key1 comes after key2;
     *         0 if they are considered equal or Intl.Collator is not supported
     */
    public compare(key1: string, key2: string, options?: Intl.CollatorOptions, language = this.locale.language): number {
        if (!hasCollator() || language == null || language === '') return 0;

        const value1 = this.translation.translate(key1);
        const value2 = this.translation.translate(key2);

        return new Intl.Collator(language, options).compare(value1, value2);
    }

    /**
     * Gets the plural for a number.
     * @param value The number to get the plural
     * @param options A Intl PluralRulesOptions object
     * @param language The current language
     */
    public plural(value: number, options?: Intl.PluralRulesOptions, language = this.locale.language): string {
        if (!hasPluralRules() || language == null || language === '') return value.toString();

        const rule = new Intl.PluralRules(language, options).select(value);

        return this.translation.has(rule) ? this.translation.translate(rule) : rule;
    }

    /**
     * Returns the representation of a list.
     * @param list An array of keys
     * @param options A Intl ListFormatOptions object
     * @param language The current language
     */
    public list(list: string[], options?: Intl.ListFormatOptions, language = this.locale.language): string {
        const values = list.map(key => this.translation.translate(key));
        if (!hasListFormat() || language == null || language === '') return values.toString();

        return new Intl.ListFormat(language, options).format(values);
    }

}
