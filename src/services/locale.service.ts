import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';

import { IntlAPI } from './intl-api';
import { LocaleStorage } from './locale-storage';
import { L10N_CONFIG, L10nConfigRef } from "../models/l10n-config";
import { DefaultLocale } from '../models/default-locale';
import { IntlFormatter } from '../models/intl-formatter';
import { Language, ISOCode, DateTimeOptions, DigitsOptions, NumberFormatStyle } from '../models/types';

export interface ILocaleService {

    languageCodeChanged: Subject<string>;
    defaultLocaleChanged: Subject<string>;
    currencyCodeChanged: Subject<string>;
    timezoneChanged: Subject<string>;

    getConfiguration(): L10nConfigRef['locale'];

    init(): Promise<void>;

    getBrowserLanguage(): string | null;

    getAvailableLanguages(): string[];

    getLanguageDirection(languageCode?: string): string;

    getCurrentLanguage(): string;

    getCurrentCountry(): string;

    getCurrentScript(): string;

    getCurrentLocale(): string;

    getCurrentNumberingSystem(): string;

    getCurrentCalendar(): string;

    getDefaultLocale(): string;

    getCurrentCurrency(): string;

    getCurrencySymbol(currencyDisplay?: string, defaultLocale?: string, currency?: string): string;

    getCurrentTimezone(): string;

    setCurrentLanguage(languageCode: string): void;

    setDefaultLocale(
        languageCode: string,
        countryCode?: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): void;

    setCurrentCurrency(currencyCode: string): void;

    setCurrentTimezone(zoneName: string): void;

    formatDate(value: any, format?: string | DateTimeOptions, defaultLocale?: string, timezone?: string): string;

    formatDecimal(value: any, digits?: string | DigitsOptions, defaultLocale?: string): string;

    formatPercent(value: any, digits?: string | DigitsOptions, defaultLocale?: string): string;

    formatCurrency(
        value: any,
        digits?: string | DigitsOptions,
        currencyDisplay?: string,
        defaultLocale?: string,
        currency?: string
    ): string;

    composeLocale(codes: ISOCode[]): string;

    rollback(): void;

}

/**
 * Manages language, default locale, currency & timezone.
 */
@Injectable() export class LocaleService implements ILocaleService {

    /**
     * Fired when the language changes. Returns the language code.
     */
    public languageCodeChanged: Subject<string> = new Subject<string>();
    /**
     * Fired when the default locale changes. Returns the default locale.
     */
    public defaultLocaleChanged: Subject<string> = new Subject<string>();
    /**
     * Fired when the currency changes. Returns the currency code.
     */
    public currencyCodeChanged: Subject<string> = new Subject<string>();
    /**
     * Fired when the timezone changes. Returns the timezone.
     */
    public timezoneChanged: Subject<string> = new Subject<string>();

    private defaultLocale: DefaultLocale = new DefaultLocale();
    private currencyCode: string;
    private timezone: string;

    private rollbackLanguageCode: string;
    private rollbackDefaultLocale: string;
    private rollbackCurrencyCode: string;
    private rollbackTimezone: string;

    constructor(@Inject(L10N_CONFIG) private configuration: L10nConfigRef, private storage: LocaleStorage) { }

    public getConfiguration(): L10nConfigRef['locale'] {
        return this.configuration.locale;
    }

    public async init(): Promise<void> {
        await this.initLanguage();
        await this.initDefaultLocale();
        await this.initCurrency();
        await this.initTimezone();
    }

    public getBrowserLanguage(): string | null {
        let browserLanguage: string | null = null;
        if (typeof navigator !== "undefined" && navigator.language) {
            browserLanguage = navigator.language;
        }
        if (browserLanguage != null) {
            browserLanguage = browserLanguage.split("-")[0];
        }
        return browserLanguage;
    }

    public getAvailableLanguages(): string[] {
        let languages: string[] = [];
        if (this.configuration.locale.languages) {
            languages = this.configuration.locale.languages.map((language: Language) => language.code);
        }
        return languages;
    }

    public getLanguageDirection(languageCode: string = this.defaultLocale.languageCode): string {
        const matchedLanguage: Language | undefined = this.matchLanguage(languageCode);
        return matchedLanguage ? matchedLanguage.dir : "";
    }

    public getCurrentLanguage(): string {
        return this.defaultLocale.languageCode;
    }

    public getCurrentCountry(): string {
        return this.defaultLocale.countryCode || "";
    }

    public getCurrentScript(): string {
        return this.defaultLocale.scriptCode || "";
    }

    /**
     * Returns the well formatted locale as {languageCode}[-scriptCode][-countryCode]
     */
    public getCurrentLocale(): string {
        let locale: string = this.defaultLocale.languageCode;
        locale += !!this.defaultLocale.scriptCode ? "-" + this.defaultLocale.scriptCode : "";
        locale += !!this.defaultLocale.countryCode ? "-" + this.defaultLocale.countryCode : "";
        return locale;
    }

    public getCurrentNumberingSystem(): string {
        return this.defaultLocale.numberingSystem || "";
    }

    public getCurrentCalendar(): string {
        return this.defaultLocale.calendar || "";
    }

    public getDefaultLocale(): string {
        return this.defaultLocale.value;
    }

    public getCurrentCurrency(): string {
        return this.currencyCode;
    }

    public getCurrencySymbol(
        currencyDisplay: 'code' | 'symbol' | 'name',
        defaultLocale?: string,
        currency?: string
    ): string {
        let currencySymbol: string = this.currencyCode;
        if (IntlAPI.hasNumberFormat()) {
            const localeZero: string = this.formatDecimal(0, '1.0-0', defaultLocale);
            const localeValue: string = this.formatCurrency(0, '1.0-0', currencyDisplay, defaultLocale, currency);
            currencySymbol = localeValue.replace(localeZero, "");
            currencySymbol = currencySymbol.trim();
        }
        return currencySymbol;
    }

    public getCurrentTimezone(): string {
        return this.timezone;
    }

    public setCurrentLanguage(languageCode: string): void {
        if (this.defaultLocale.languageCode != languageCode) {
            this.rollbackLanguageCode = this.defaultLocale.languageCode;
            this.defaultLocale.build(languageCode);
            this.releaseLanguage();
        }
    }

    public setDefaultLocale(
        languageCode: string,
        countryCode?: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): void {
        if (this.defaultLocale.languageCode != languageCode ||
            this.defaultLocale.countryCode != countryCode ||
            this.defaultLocale.scriptCode != scriptCode ||
            this.defaultLocale.numberingSystem != numberingSystem ||
            this.defaultLocale.calendar != calendar) {

            this.rollbackDefaultLocale = this.defaultLocale.value;
            this.defaultLocale.build(languageCode, countryCode, scriptCode, numberingSystem, calendar);
            this.releaseDefaultLocale();
        }
    }

    public setCurrentCurrency(currencyCode: string): void {
        if (this.currencyCode != currencyCode) {
            this.rollbackCurrencyCode = this.currencyCode;
            this.currencyCode = currencyCode;
            this.releaseCurrency();
        }
    }

    public setCurrentTimezone(zoneName: string): void {
        if (this.timezone != zoneName) {
            this.rollbackTimezone = this.timezone;
            this.timezone = zoneName;
            this.releaseTimezone();
        }
    }

    /**
     * Formats a date according to default locale.
     * @param value A Date, a number (milliseconds since UTC epoch) or an ISO string
     * @param format An alias or a DateTimeOptions object of the format. Default is 'mediumDate'
     * @param defaultLocale The default locale to use. Default is the current locale
     * @param timezone The time zone name. Default is the current timezone
     */
    public formatDate(value: any, format?: string | DateTimeOptions, defaultLocale?: string, timezone?: string): string {
        return IntlFormatter.formatDate(
            value,
            defaultLocale || this.defaultLocale.value,
            format || 'mediumDate',
            timezone || this.timezone
        );
    }

    /**
     * Formats a decimal number according to default locale.
     * @param value The number to be formatted
     * @param digits An alias or a DigitsOptions object of the format
     * @param defaultLocale The default locale to use. Default is the current locale
     */
    public formatDecimal(value: any, digits?: string | DigitsOptions, defaultLocale?: string): string {
        return IntlFormatter.formatNumber(value, defaultLocale || this.defaultLocale.value, NumberFormatStyle.Decimal, digits);
    }

    /**
     * Formats a number as a percentage according to default locale.
     * @param value The number to be formatted
     * @param digits An alias or a DigitsOptions object of the format
     * @param defaultLocale The default locale to use. Default is the current locale
     */
    public formatPercent(value: any, digits?: string | DigitsOptions, defaultLocale?: string): string {
        return IntlFormatter.formatNumber(value, defaultLocale || this.defaultLocale.value, NumberFormatStyle.Percent, digits);
    }

    /**
     * Formats a number as a currency according to default locale.
     * @param value The number to be formatted
     * @param digits An alias or a DigitsOptions object of the format
     * @param currencyDisplay The format for the currency. Possible values are 'code', 'symbol', 'name'. Default is 'symbol'
     * @param defaultLocale The default locale to use. Default is the current locale
     * @param currency The currency to use. Default is the current currency
     */
    public formatCurrency(
        value: any,
        digits?: string | DigitsOptions,
        currencyDisplay?: 'code' | 'symbol' | 'name',
        defaultLocale?: string,
        currency?: string
    ): string {
        return IntlFormatter.formatNumber(
            value,
            defaultLocale || this.defaultLocale.value,
            NumberFormatStyle.Currency,
            digits,
            currency || this.currencyCode,
            currencyDisplay || 'symbol'
        );
    }

    public composeLocale(codes: ISOCode[]): string {
        let locale: string = "";
        if (this.defaultLocale.languageCode) {
            for (const code of codes) {
                switch (code) {
                    case ISOCode.Script:
                        locale += "-" + this.defaultLocale.scriptCode;
                        break;
                    case ISOCode.Country:
                        locale += "-" + this.defaultLocale.countryCode;
                        break;
                    default:
                        locale += this.defaultLocale.languageCode;
                }
            }
        }
        return locale;
    }

    /**
     * Rollbacks to previous language, default locale, currency & timezone.
     */
    public rollback(): void {
        if (this.rollbackLanguageCode && this.rollbackLanguageCode != this.defaultLocale.languageCode) {
            this.defaultLocale.value = this.rollbackLanguageCode;
            this.releaseLanguage();
        }
        if (this.rollbackDefaultLocale && this.rollbackDefaultLocale != this.defaultLocale.value) {
            this.defaultLocale.value = this.rollbackDefaultLocale;
            this.releaseDefaultLocale();
        }
        if (this.rollbackCurrencyCode && this.rollbackCurrencyCode != this.currencyCode) {
            this.currencyCode = this.rollbackCurrencyCode;
            this.releaseCurrency();
        }
        if (this.rollbackTimezone && this.rollbackTimezone != this.timezone) {
            this.timezone = this.rollbackTimezone;
            this.releaseTimezone();
        }
    }

    private async initLanguage(): Promise<void> {
        if (this.configuration.locale.language) {
            if (!this.defaultLocale.languageCode) {
                // Tries to get the language from the storage.
                const defaultLocale: string | null = await this.storage.read("defaultLocale");
                if (!!defaultLocale) {
                    this.defaultLocale.value = defaultLocale;
                } else {
                    // Tries to get the language from the browser.
                    const browserLanguage: string | null = this.getBrowserLanguage();
                    const matchedLanguage: Language | undefined = this.matchLanguage(browserLanguage);
                    if (!!browserLanguage && matchedLanguage) {
                        this.defaultLocale.build(browserLanguage);
                    } else {
                        // Uses the language set in the configuration.
                        this.defaultLocale.build(this.configuration.locale.language);
                    }
                    this.storage.write("defaultLocale", this.defaultLocale.value);
                }
                this.rollbackLanguageCode = this.defaultLocale.languageCode;
                this.sendLanguageEvents();
            }
        }
    }

    private async initDefaultLocale(): Promise<void> {
        if (this.configuration.locale.defaultLocale) {
            if (!this.defaultLocale.value) {
                const defaultLocale: string | null = await this.storage.read("defaultLocale");
                if (!!defaultLocale) {
                    this.defaultLocale.value = defaultLocale;
                } else {
                    this.defaultLocale.build(
                        this.configuration.locale.defaultLocale.languageCode,
                        this.configuration.locale.defaultLocale.countryCode,
                        this.configuration.locale.defaultLocale.scriptCode,
                        this.configuration.locale.defaultLocale.numberingSystem,
                        this.configuration.locale.defaultLocale.calendar
                    );
                    this.storage.write("defaultLocale", this.defaultLocale.value);
                }
                this.rollbackDefaultLocale = this.defaultLocale.value;
                this.sendDefaultLocaleEvents();
            }
        }
    }

    private async initCurrency(): Promise<void> {
        if (this.configuration.locale.currency) {
            if (!this.currencyCode) {
                const currencyCode: string | null = await this.storage.read("currency");
                if (!!currencyCode) {
                    this.currencyCode = currencyCode;
                } else {
                    this.currencyCode = this.configuration.locale.currency;
                    this.storage.write("currency", this.currencyCode);
                }
                this.rollbackCurrencyCode = this.currencyCode;
                this.sendCurrencyEvents();
            }
        }
    }

    private async initTimezone(): Promise<void> {
        if (this.configuration.locale.timezone) {
            if (!this.timezone) {
                const zoneName: string | null = await this.storage.read("timezone");
                if (!!zoneName) {
                    this.timezone = zoneName;
                } else {
                    this.timezone = this.configuration.locale.timezone;
                    this.storage.write("timezone", this.timezone);
                }
                this.rollbackTimezone = this.timezone;
                this.sendTimezoneEvents();
            }
        }
    }

    private matchLanguage(languageCode: string | null): Language | undefined {
        let matchedLanguage: Language | undefined;
        if (this.configuration.locale.languages && languageCode != null) {
            matchedLanguage = this.configuration.locale.languages.find((language: Language) => language.code == languageCode);
        }
        return matchedLanguage;
    }

    private releaseLanguage(): void {
        this.storage.write("defaultLocale", this.defaultLocale.value);
        this.sendLanguageEvents();
    }

    private releaseDefaultLocale(): void {
        this.storage.write("defaultLocale", this.defaultLocale.value);
        this.sendDefaultLocaleEvents();
    }

    private releaseCurrency(): void {
        this.storage.write("currency", this.currencyCode);
        this.sendCurrencyEvents();
    }

    private releaseTimezone(): void {
        this.storage.write("timezone", this.timezone);
        this.sendTimezoneEvents();
    }

    private sendLanguageEvents(): void {
        this.languageCodeChanged.next(this.defaultLocale.languageCode);
    }

    private sendDefaultLocaleEvents(): void {
        this.defaultLocaleChanged.next(this.defaultLocale.value);
    }

    private sendCurrencyEvents(): void {
        this.currencyCodeChanged.next(this.currencyCode);
    }

    private sendTimezoneEvents(): void {
        this.timezoneChanged.next(this.timezone);
    }

}
