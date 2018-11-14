import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { IntlAPI } from './intl-api';
import { LocaleStorage } from './locale-storage';
import { LOCALE_CONFIG, LocaleConfig } from '../models/l10n-config';
import { DefaultLocaleBuilder } from '../models/default-locale-builder';
import { Language, ISOCode } from '../models/types';

export interface ILocaleService {

    languageCodeChanged: EventEmitter<string>;
    defaultLocaleChanged: EventEmitter<string>;
    currencyCodeChanged: EventEmitter<string>;
    timezoneChanged: EventEmitter<string>;

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

    getCurrencySymbol(
        currencyDisplay?: 'code' | 'symbol' | 'name',
        defaultLocale?: string,
        currency?: string
    ): string;

    getCurrentTimezone(): string;

    setCurrentLanguage(languageCode: string): void;

    setDefaultLocale(
        languageCode: string,
        countryCode?: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): void;

    setCurrentNumberingSystem(numberingSystem: string): void;

    setCurrentCalendar(calendar: string): void;

    setCurrentCurrency(currencyCode: string): void;

    setCurrentTimezone(zoneName: string): void;

    composeLocale(codes: ISOCode[]): string;

}

/**
 * Manages language, default locale, currency & timezone.
 */
@Injectable() export class LocaleService implements ILocaleService {

    @Output() public languageCodeChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public defaultLocaleChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public currencyCodeChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public timezoneChanged: EventEmitter<string> = new EventEmitter<string>(true);

    public loadTranslation: Subject<any> = new Subject();

    public currencyCode: string;
    public timezone: string;

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
        defaultLocale: string = this.defaultLocale.value,
        currency: string = this.currencyCode
    ): string {
        let currencySymbol: string = currency;
        if (IntlAPI.hasNumberFormat()) {
            const localeZero: string = new Intl.NumberFormat(defaultLocale).format(0);
            const value: number = 0; // Reference value.
            const localeValue: string = new Intl.NumberFormat(
                defaultLocale,
                {
                    style: 'currency',
                    currency: currency,
                    currencyDisplay: currencyDisplay,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            ).format(value);
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
            this.defaultLocale.build(languageCode);
            this.storage.write("defaultLocale", this.defaultLocale.value);
            this.sendLanguageEvents();
            this.sendTranslationEvents();
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

            this.defaultLocale.build(
                languageCode,
                countryCode,
                scriptCode,
                numberingSystem,
                calendar
            );
            this.storage.write("defaultLocale", this.defaultLocale.value);
            this.sendDefaultLocaleEvents();
            this.sendTranslationEvents();
        }
    }

    public setCurrentNumberingSystem(numberingSystem: string): void {
        if (this.defaultLocale.numberingSystem != numberingSystem) {
            this.defaultLocale.build(
                this.defaultLocale.languageCode,
                this.defaultLocale.countryCode,
                this.defaultLocale.scriptCode,
                numberingSystem,
                this.defaultLocale.calendar
            );
            this.storage.write("defaultLocale", this.defaultLocale.value);
            this.sendDefaultLocaleEvents();
        }
    }

    public setCurrentCalendar(calendar: string): void {
        if (this.defaultLocale.calendar != calendar) {
            this.defaultLocale.build(
                this.defaultLocale.languageCode,
                this.defaultLocale.countryCode,
                this.defaultLocale.scriptCode,
                this.defaultLocale.numberingSystem,
                calendar
            );
            this.storage.write("defaultLocale", this.defaultLocale.value);
            this.sendDefaultLocaleEvents();
        }
    }

    public setCurrentCurrency(currencyCode: string): void {
        if (this.currencyCode != currencyCode) {
            this.currencyCode = currencyCode;
            this.storage.write("currency", this.currencyCode);
            this.sendCurrencyEvents();
        }
    }

    public setCurrentTimezone(zoneName: string): void {
        if (this.timezone != zoneName) {
            this.timezone = zoneName;
            this.storage.write("timezone", this.timezone);
            this.sendTimezoneEvents();
        }
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
            this.sendLanguageEvents();
        }
    }

    private initCurrency(): void {
        if (this.configuration.currency) {
            if (!this.currencyCode) {
                this.currencyCode = this.configuration.currency;
                this.storage.write("currency", this.currencyCode);
            }
            this.sendCurrencyEvents();
        }
    }

    private initTimezone(): void {
        if (this.configuration.timezone) {
            if (!this.timezone) {
                this.timezone = this.configuration.timezone;
                this.storage.write("timezone", this.timezone);
            }
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

    private sendLanguageEvents(): void {
        this.languageCodeChanged.emit(this.defaultLocale.languageCode);
    }

    private sendDefaultLocaleEvents(): void {
        this.defaultLocaleChanged.emit(this.defaultLocale.value);
    }

    private sendCurrencyEvents(): void {
        this.currencyCodeChanged.emit(this.currencyCode);
    }

    private sendTimezoneEvents(): void {
        this.timezoneChanged.emit(this.timezone);
    }

    private sendTranslationEvents(): void {
        // This event is subscribed by TranslationService to load the translation data.
        this.loadTranslation.next();
    }

}
