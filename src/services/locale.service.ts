import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ILocaleConfig, LocaleConfig } from '../models/localization/locale-config';
import { ILocaleConfigAPI, LocaleConfigAPI } from '../models/localization/locale-config-api';
import { DefaultLocale } from '../models/localization/default-locale';
import { Browser } from '../models/localization/browser';
import { Language } from '../models/types';

/**
 * Manages language, default locale & currency.
 */
export interface ILocaleService {

    languageCodeChanged: EventEmitter<string>;
    defaultLocaleChanged: EventEmitter<string>;
    currencyCodeChanged: EventEmitter<string>;

    loadTranslation: Subject<any>;

    /**
     * Configure the service in the application root module or in a feature module with lazy loading.
     */
    addConfiguration(): ILocaleConfigAPI;

    getConfiguration(): ILocaleConfig;

    /**
     * Call this method after the configuration to initialize the service.
     */
    init(): void;

    getAvailableLanguages(): string[];

    getLanguageDirection(languageCode?: string): string;

    getCurrentLanguage(): string;

    getCurrentCountry(): string;

    getCurrentLocale(): string;

    getCurrentScript(): string;

    getCurrentNumberingSystem(): string;

    getCurrentCalendar(): string;

    getDefaultLocale(): string;

    getCurrentCurrency(): string;

    setCurrentLanguage(languageCode: string): void;

    setDefaultLocale(
        languageCode: string,
        countryCode: string,
        scriptCode?: string,
        numberingSystem?: string,
        calendar?: string
    ): void;

    setCurrentCurrency(currencyCode: string): void;

}

@Injectable() export class LocaleService implements ILocaleService {

    @Output() public languageCodeChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public defaultLocaleChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public currencyCodeChanged: EventEmitter<string> = new EventEmitter<string>(true);

    public loadTranslation: Subject<any> = new Subject();

    private defaultLocale: DefaultLocale = new DefaultLocale();

    private currencyCode: string;

    private browser: Browser = new Browser(this.configuration);

    constructor(private configuration: LocaleConfig) { }

    public addConfiguration(): ILocaleConfigAPI {
        return new LocaleConfigAPI(this.configuration);
    }

    public getConfiguration(): ILocaleConfig {
        return this.configuration;
    }

    public init(): void {
        this.initStorage();

        if (!!this.configuration.languageCode && !!this.configuration.countryCode) {
            this.initDefaultLocale();
        } else if (!!this.configuration.languageCode) {
            this.initLanguage();
        }

        if (!!this.configuration.currencyCode) {
            this.initCurrency();
        }
    }

    public getAvailableLanguages(): string[] {
        return this.configuration.languageCodes.map((language: Language) => language.code);
    }

    public getLanguageDirection(languageCode: string = this.defaultLocale.languageCode): string {
        const matchedLanguages: Language[] = this.matchLanguage(languageCode);
        return matchedLanguages[0].direction;
    }

    public getCurrentLanguage(): string {
        return this.defaultLocale.languageCode;
    }

    public getCurrentCountry(): string {
        if (!!this.defaultLocale.countryCode) {
            return this.defaultLocale.countryCode;
        }
        return "";
    }

    public getCurrentScript(): string {
        if (!!this.defaultLocale.scriptCode) {
            return this.defaultLocale.scriptCode;
        }
        return "";
    }

    public getCurrentLocale(): string {
        const locale: string = !!this.defaultLocale.countryCode
            ? this.defaultLocale.languageCode + "-" + this.defaultLocale.countryCode
            : this.defaultLocale.languageCode;
        return locale;
    }

    public getCurrentNumberingSystem(): string {
        if (!!this.defaultLocale.numberingSystem) {
            return this.defaultLocale.numberingSystem;
        }
        return "";
    }

    public getCurrentCalendar(): string {
        if (!!this.defaultLocale.calendar) {
            return this.defaultLocale.calendar;
        }
        return "";
    }

    public getDefaultLocale(): string {
        return this.defaultLocale.value;
    }

    public getCurrentCurrency(): string {
        return this.currencyCode;
    }

    public setCurrentLanguage(languageCode: string): void {
        if (this.defaultLocale.languageCode != languageCode) {
            this.defaultLocale.build(languageCode);
            this.browser.writeStorage("locale", this.defaultLocale.value);
            this.sendLanguageEvents();
            this.sendTranslationEvents();
        }
    }

    public setDefaultLocale(
        languageCode: string,
        countryCode: string,
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

            this.browser.writeStorage("locale", this.defaultLocale.value);
            this.sendDefaultLocaleEvents();
            this.sendTranslationEvents();
        }
    }

    public setCurrentCurrency(currencyCode: string): void {
        if (this.currencyCode != currencyCode) {
            this.currencyCode = currencyCode;
            this.browser.writeStorage("currency", this.currencyCode);
            this.sendCurrencyEvents();
        }
    }

    private initStorage(): void {
        this.browser.storageIsDisabled = this.configuration.storageIsDisabled;

        // Tries to retrieve default locale & currency from the browser storage.
        const defaultLocale: string | null = this.browser.readStorage("locale");
        if (!!defaultLocale) {
            this.defaultLocale.value = defaultLocale;
        }
        const currencyCode: string | null = this.browser.readStorage("currency");
        if (!!currencyCode) {
            this.currencyCode = currencyCode;
        }
    }

    private initLanguage(): void {
        if (this.defaultLocale.languageCode == null) {
            const browserLanguage: string | null = this.browser.getBrowserLanguage();
            let matchedLanguages: Language[] = [];
            if (!!browserLanguage) {
                matchedLanguages = this.matchLanguage(browserLanguage);
            }
            if (!!browserLanguage && matchedLanguages.length > 0) {
                this.defaultLocale.build(browserLanguage);
            } else {
                this.defaultLocale.build(this.configuration.languageCode);
            }
            this.browser.writeStorage("locale", this.defaultLocale.value);
        }
        this.sendLanguageEvents();
    }

    private matchLanguage(languageCode: string): Language[] {
        const matchedLanguages: Language[] = this.configuration.languageCodes.filter(
            (language: Language) => {
                return language.code == languageCode;
            });
        return matchedLanguages;
    }

    private initDefaultLocale(): void {
        if (this.defaultLocale.value == null) {
            this.defaultLocale.build(
                this.configuration.languageCode,
                this.configuration.countryCode,
                this.configuration.scriptCode,
                this.configuration.numberingSystem,
                this.configuration.calendar
            );
            this.browser.writeStorage("locale", this.defaultLocale.value);
        }
        this.sendDefaultLocaleEvents();
    }

    private initCurrency(): void {
        if (this.currencyCode == null) {
            this.currencyCode = this.configuration.currencyCode;
            this.browser.writeStorage("currency", this.currencyCode);
        }
        this.sendCurrencyEvents();
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

    private sendTranslationEvents(): void {
        // This event is subscribed by TranslationService to load the translation data.
        this.loadTranslation.next();
    }

}
