import { Injectable, EventEmitter, Output } from '@angular/core';

import { LocaleConfig } from '../models/localization/locale-config';
import { Config } from '../models/localization/config';
import { Language } from '../models/localization/language';
import { DefaultLocale } from '../models/localization/default-locale';
import { Browser } from '../models/localization/browser';

/**
 * Manages language, default locale & currency.
 */
@Injectable() export class LocaleService {

    @Output() public languageCodeChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public defaultLocaleChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public currencyCodeChanged: EventEmitter<string> = new EventEmitter<string>(true);
    @Output() public loadTranslation: EventEmitter<any> = new EventEmitter<any>(true);

    public get configuration(): Config {
        return this._configuration;
    }

    private _configuration: Config = new Config();

    private defaultLocale: DefaultLocale = new DefaultLocale();

    private currencyCode: string;

    private browser: Browser = new Browser(this);

    /**
     * Configure the service in the application root module or bootstrap component.
     */
    public AddConfiguration(): LocaleConfig {
        return new LocaleConfig(this);
    }

    /**
     * Call this method after the configuration to initialize the service.
     */
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

    public getLanguageDirection(languageCode: string): string {
        let matchedLanguages: Language[] = this.matchLanguage(languageCode);
        return matchedLanguages[0].direction;
    }

    public getCurrentLanguage(): string {
        return this.defaultLocale.languageCode;
    }

    public getCurrentCountry(): string {
        return this.defaultLocale.countryCode;
    }

    public getCurrentScript(): string {
        return this.defaultLocale.scriptCode;
    }

    public getCurrentNumberingSystem(): string {
        return this.defaultLocale.numberingSystem;
    }

    public getCurrentCalendar(): string {
        return this.defaultLocale.calendar;
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
        this.defaultLocale.value = this.browser.readStorage("locale");
        this.currencyCode = this.browser.readStorage("currency");
    }

    private initLanguage(): void {
        if (this.defaultLocale.languageCode == null) {
            let browserLanguage: string = this.browser.getBrowserLanguage();
            let matchedLanguages: Language[] = this.matchLanguage(browserLanguage);
            if (matchedLanguages.length > 0) {
                this.defaultLocale.build(browserLanguage);
            } else {
                this.defaultLocale.build(this.configuration.languageCode);
            }
            this.browser.writeStorage("locale", this.defaultLocale.value);
        }
        this.sendLanguageEvents();
    }

    private matchLanguage(languageCode: string): Language[] {
        let matchedLanguages: Language[] = this.configuration.languageCodes.filter(
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
        this.loadTranslation.emit(null);
    }

}
