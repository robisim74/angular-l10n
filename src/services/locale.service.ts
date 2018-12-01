import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';

import { IntlAPI } from './intl-api';
import { LocaleStorage } from './locale-storage';
import { LOCALE_CONFIG, LocaleConfig } from '../models/l10n-config';
import { DefaultLocaleBuilder } from '../models/default-locale-builder';
import { IntlFormatter } from '../models/intl-formatter';
import { Language, ISOCode, DateTimeOptions, DigitsOptions, NumberFormatStyle } from '../models/types';

export interface ILocaleService {

    languageCodeChanged: Subject<string>;
    defaultLocaleChanged: Subject<string>;
    currencyCodeChanged: Subject<string>;
    timezoneChanged: Subject<string>;

    loadTranslation: Subject<any>;

    currencyCode: string;
    timezone: string;

    getConfiguration(): LocaleConfig;

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

    formatDate(value: any, defaultLocale?: string, format?: string | DateTimeOptions, timezone?: string): string;

    formatDecimal(value: any, defaultLocale?: string, digits?: string | DigitsOptions): string;

    formatPercent(value: any, defaultLocale?: string, digits?: string | DigitsOptions): string;

    formatCurrency(
        value: any,
        defaultLocale?: string,
        currency?: string,
        currencyDisplay?: string,
        digits?: string | DigitsOptions
    ): string;

    composeLocale(codes: ISOCode[]): string;

    rollback(): void;

}

/**
 * Manages language, default locale, currency & timezone.
 */
@Injectable() export class LocaleService implements ILocaleService {

    public languageCodeChanged: Subject<string> = new Subject<string>();
    public defaultLocaleChanged: Subject<string> = new Subject<string>();
    public currencyCodeChanged: Subject<string> = new Subject<string>();
    public timezoneChanged: Subject<string> = new Subject<string>();

    public loadTranslation: Subject<any> = new Subject();

    public currencyCode: string;
    public timezone: string;

    private rollbackDefaultLocale: string;
    private rollbackCurrencyCode: string;
    private rollbackTimezone: string;

    constructor(
        @Inject(LOCALE_CONFIG) private configuration: LocaleConfig,
        private defaultLocale: DefaultLocaleBuilder,
        private storage: LocaleStorage
    ) { }

    public getConfiguration(): LocaleConfig {
        return this.configuration;
    }

    public async init(): Promise<void> {
        await this.initStorage();

        this.initDefaultLocale();
        this.initLanguage();
        this.initCurrency();
        this.initTimezone();
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
        if (this.configuration.languages) {
            languages = this.configuration.languages.map((language: Language) => language.code);
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
        currencyDisplay: 'code' | 'symbol' | 'name' = 'symbol',
        defaultLocale?: string,
        currency?: string
    ): string {
        let currencySymbol: string = this.currencyCode;
        if (IntlAPI.hasNumberFormat()) {
            const localeZero: string = this.formatDecimal(0, defaultLocale);
            const localeValue: string = this.formatCurrency(0, defaultLocale, currency, currencyDisplay, '1.0-0');
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
            this.rollbackDefaultLocale = this.defaultLocale.value;
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
     * @param defaultLocale The default locale to use. Default is the current locale
     * @param format An alias or a DateTimeOptions object. Default is 'mediumDate'
     * @param timezone The time zone name. Default is the current timezone
     */
    public formatDate(
        value: any,
        defaultLocale: string = this.defaultLocale.value,
        format: string | DateTimeOptions = 'mediumDate',
        timezone: string = this.timezone
    ): string {
        return IntlFormatter.formatDate(value, defaultLocale, format, timezone);
    }

    /**
     * Formats a decimal number according to default locale.
     * @param value The number to be formatted
     * @param defaultLocale The default locale to use. Default is the current locale
     * @param digits An alias or a DigitsOptions object
     */
    public formatDecimal(value: any, defaultLocale: string = this.defaultLocale.value, digits?: string | DigitsOptions): string {
        return IntlFormatter.formatNumber(value, defaultLocale, NumberFormatStyle.Decimal, digits);
    }

    /**
     * Formats a number as a percentage according to default locale.
     * @param value The number to be formatted
     * @param defaultLocale The default locale to use. Default is the current locale
     * @param digits An alias or a DigitsOptions object
     */
    public formatPercent(value: any, defaultLocale: string = this.defaultLocale.value, digits?: string | DigitsOptions): string {
        return IntlFormatter.formatNumber(value, defaultLocale, NumberFormatStyle.Percent, digits);
    }

    /**
     * Formats a number as a currency according to default locale.
     * @param value The number to be formatted
     * @param defaultLocale The default locale to use. Default is the current locale
     * @param currency The currency to use. Default is the current currency
     * @param currencyDisplay The format for the currency. Possible values are 'code', 'symbol', 'name'. Default is 'symbol'
     * @param digits An alias or a DigitsOptions object
     */
    public formatCurrency(
        value: any,
        defaultLocale: string = this.defaultLocale.value,
        currency: string = this.currencyCode,
        currencyDisplay: 'code' | 'symbol' | 'name' = 'symbol',
        digits?: string | DigitsOptions
    ): string {
        return IntlFormatter.formatNumber(
            value,
            defaultLocale,
            NumberFormatStyle.Currency,
            digits,
            currency,
            currencyDisplay
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

    public rollback(): void {
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

    private async initStorage(): Promise<void> {
        // Tries to retrieve default locale & currency from the browser storage.
        if (!this.defaultLocale.value) {
            const defaultLocale: string | null = await this.storage.read("defaultLocale");
            if (!!defaultLocale) {
                this.defaultLocale.value = defaultLocale;
            }
        }
        if (!this.currencyCode) {
            const currencyCode: string | null = await this.storage.read("currency");
            if (!!currencyCode) {
                this.currencyCode = currencyCode;
            }
        }
        if (!this.timezone) {
            const zoneName: string | null = await this.storage.read("timezone");
            if (!!zoneName) {
                this.timezone = zoneName;
            }
        }
    }

    private initDefaultLocale(): void {
        if (this.configuration.defaultLocale) {
            if (!this.defaultLocale.value) {
                this.defaultLocale.build(
                    this.configuration.defaultLocale.languageCode,
                    this.configuration.defaultLocale.countryCode,
                    this.configuration.defaultLocale.scriptCode,
                    this.configuration.defaultLocale.numberingSystem,
                    this.configuration.defaultLocale.calendar
                );
                this.storage.write("defaultLocale", this.defaultLocale.value);
            }
            this.rollbackDefaultLocale = this.defaultLocale.value;
            this.sendDefaultLocaleEvents();
        }
    }

    private initLanguage(): void {
        if (this.configuration.language) {
            if (!this.defaultLocale.languageCode) {
                const browserLanguage: string | null = this.getBrowserLanguage();
                const matchedLanguage: Language | undefined = this.matchLanguage(browserLanguage);
                if (!!browserLanguage && matchedLanguage) {
                    this.defaultLocale.build(browserLanguage);
                } else {
                    this.defaultLocale.build(this.configuration.language);
                }
                this.storage.write("defaultLocale", this.defaultLocale.value);
            }
            this.rollbackDefaultLocale = this.defaultLocale.value;
            this.sendLanguageEvents();
        }
    }

    private initCurrency(): void {
        if (this.configuration.currency) {
            if (!this.currencyCode) {
                this.currencyCode = this.configuration.currency;
                this.storage.write("currency", this.currencyCode);
            }
            this.rollbackCurrencyCode = this.currencyCode;
            this.sendCurrencyEvents();
        }
    }

    private initTimezone(): void {
        if (this.configuration.timezone) {
            if (!this.timezone) {
                this.timezone = this.configuration.timezone;
                this.storage.write("timezone", this.timezone);
            }
            this.rollbackTimezone = this.timezone;
            this.sendCurrencyEvents();
        }
    }

    private matchLanguage(languageCode: string | null): Language | undefined {
        let matchedLanguage: Language | undefined;
        if (this.configuration.languages && languageCode != null) {
            matchedLanguage = this.configuration.languages.find((language: Language) => language.code == languageCode);
        }
        return matchedLanguage;
    }

    private releaseLanguage(): void {
        this.storage.write("defaultLocale", this.defaultLocale.value);
        this.sendLanguageEvents();
        this.sendTranslationEvents();
    }

    private releaseDefaultLocale(): void {
        this.storage.write("defaultLocale", this.defaultLocale.value);
        this.sendDefaultLocaleEvents();
        this.sendTranslationEvents();
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

    /**
     * Sends an event to all Translation services to load the translation data.
     */
    private sendTranslationEvents(): void {
        this.loadTranslation.next();
    }

}
