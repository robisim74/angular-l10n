import { Injectable, Inject } from '@angular/core';

import { L10nLocale, L10nDateTimeFormatOptions, L10nNumberFormatOptions } from '../models/types';
import { L10nConfig, L10N_CONFIG, L10N_LOCALE } from '../models/l10n-config';
import {
    hasDateTimeFormat,
    hasTimeZone,
    hasNumberFormat,
    hasRelativeTimeFormat,
    hasCollator,
    hasPluralRules,
    hasListFormat,
    hasDisplayNames,
    toDate,
    toNumber,
    PARSE_DATE_STYLE,
    PARSE_TIME_STYLE,
    parseDigits
} from '../models/utils';
import { L10nTranslationService } from './l10n-translation.service';

@Injectable() export class L10nIntlService {

    constructor(
        @Inject(L10N_CONFIG) private config: L10nConfig,
        @Inject(L10N_LOCALE) private locale: L10nLocale,
        private translation: L10nTranslationService
    ) { }

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
     * @param convert An optional function to convert the value, with value and locale in the signature. 
     * For example:
     * ```
     * const convert = (value: number, locale: L10nLocale) => { return ... };
     * ```
     * @param convertParams Optional parameters for the convert function
     */
    public formatNumber(
        value: any,
        options?: L10nNumberFormatOptions,
        language = this.locale.numberLanguage || this.locale.language,
        currency = this.locale.currency,
        convert?: (value: number, locale: L10nLocale, params: any) => number,
        convertParams?: any
    ): string {
        if (!hasNumberFormat() && options && options.style === 'currency') return `${value} ${currency}`;
        if (options && options.style === 'unit' && !options.unit) return value;
        if (!hasNumberFormat() && options && options.style === 'unit') return `${value} ${options.unit}`;
        if (!hasNumberFormat() || language == null || language === '') return value;

        value = toNumber(value);

        // Optional conversion.
        if (typeof convert === 'function') {
            value = convert(value, this.locale, Object.values(convertParams || {})); // Destructures params
        }

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
     * @param unit An Intl RelativeTimeFormatUnit value
     * @param options An Intl RelativeTimeFormatOptions object
     * @param language The current language
     */
    public formatRelativeTime(
        value: any,
        unit: Intl.RelativeTimeFormatUnit,
        options?: Intl.RelativeTimeFormatOptions,
        language = this.locale.dateLanguage || this.locale.language
    ): string {
        if (!hasRelativeTimeFormat() || language == null || language === '') return value;

        value = toNumber(value);

        return new Intl.RelativeTimeFormat(language, options).format(value, unit);
    }

    public getCurrencySymbol(locale = this.locale): string | undefined {
        if (!hasNumberFormat()) return locale.currency;

        const decimal = this.formatNumber(0, { digits: '1.0-0' }, locale.numberLanguage || locale.language);
        const currency = this.formatNumber(
            0,
            { digits: '1.0-0', style: 'currency', currencyDisplay: 'symbol' },
            locale.numberLanguage || locale.language,
            locale.currency
        );
        let symbol = currency.replace(decimal, '');
        symbol = symbol.trim();

        return symbol;
    }

    /**
     * Compares two keys by the value of translation.
     * @param key1 First key to compare
     * @param key1 Second key to compare
     * @param options An Intl CollatorOptions object
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
     * Gets the plural by a number.
     * @param value The number to get the plural
     * @param prefix Optional prefix for the key
     * @param options An Intl PluralRulesOptions object
     * @param language The current language
     */
    public plural(value: any, prefix = '', options?: Intl.PluralRulesOptions, language = this.locale.language): string {
        if (!hasPluralRules() || language == null || language === '') return value.toString();

        value = toNumber(value);

        const rule = new Intl.PluralRules(language, options).select(value);

        const key = prefix ? `${prefix}${this.config.keySeparator}${rule}` : rule;

        return this.translation.translate(key);
    }

    /**
     * Returns the representation of a list.
     * @param list An array of keys
     * @param options An Intl ListFormatOptions object
     * @param language The current language
     */
    public list(list: string[], options?: any, language = this.locale.language): string {
        const values = list.map(key => this.translation.translate(key));
        if (!hasListFormat() || language == null || language === '') return values.join(', ');

        return new (Intl as any).ListFormat(language, options).format(values);
    }

    /**
     * Returns translation of language, region, script or currency display names
     * @param code ISO code of language, region, script or currency
     * @param options An Intl DisplayNamesOptions object
     * @param language The current language
     */
    public displayNames(code: string, options?: any, language = this.locale.language): string {
        if (!hasDisplayNames() || language == null || language === '') return code;

        return new (Intl as any).DisplayNames(language, options).of(code);
    }

}
