import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IntlAPI } from '../services/intl-api';
import { LOCALE_CONFIG, LocaleConfig } from '../models/l10n-config';
import { LocaleStorage } from './locale-storage';
import { DefaultLocale } from '../models/default-locale';
import { Language, ISOCode } from '../models/types';
import { InjectorRef } from '../models/injector-ref';

/**
 * Manages language, default locale, currency & timezone.
 */
export interface ILocaleService {

    languageCodeChanged: EventEmitter<string>;
    defaultLocaleChanged: EventEmitter<string>;
    currencyCodeChanged: EventEmitter<string>;
    timezoneChanged: EventEmitter<string>;

    loadTranslation: Subject<any>;

    getConfiguration(): LocaleConfig;

    init(): Promise<void>;

    getBrowserLanguage(): string | null;

    getAvailableLanguages(): string[];

    getLanguageDirection(languageCode?: string): string;

    getCurrentLanguage(): string;

    getCurrentCountry(): string;

    /**
     * Returns the well formatted locale as {languageCode}[-scriptCode][-countryCode]
     */
    getCurrentLocale(): string;

    getCurrentScript(): string;

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

    private defaultLocale: DefaultLocale = new DefaultLocale();

    private currencyCode: string;
    private timezone: string;

    private router: Router;

    private location: Location;

    constructor(
        @Inject(LOCALE_CONFIG) private configuration: LocaleConfig,
        private storage: LocaleStorage
    ) { }

    public getConfiguration(): LocaleConfig {
        return this.configuration;
    }

    public async init(): Promise<void> {
        if (this.configuration.localizedRouting) {
            this.initByRouting();
        }

        await this.initByStorage();

        if (this.configuration.defaultLocale) {
            this.initDefaultLocale();
        } else if (this.configuration.language) {
            this.initLanguage();
        }

        if (this.configuration.currency) {
            this.initCurrency();
        }

        if (this.configuration.timezone) {
            this.initTimezone();
        }
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
        if (!!this.defaultLocale.scriptCode) {
            locale += ("-" + this.defaultLocale.scriptCode);
        }
        if (!!this.defaultLocale.countryCode) {
            locale += ("-" + this.defaultLocale.countryCode);
        }
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
        let currencySymbol: string = this.currencyCode;
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
            if (this.configuration.localizedRouting) {
                this.replacePath(this.composeLocale(this.configuration.localizedRouting));
            }
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
            if (this.configuration.localizedRouting) {
                this.replacePath(this.composeLocale(this.configuration.localizedRouting));
            }
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
        if (codes.length > 0) {
            for (let i: number = 0; i < codes.length; i++) {
                switch (codes[i]) {
                    case ISOCode.Script:
                        locale += this.defaultLocale.scriptCode;
                        break;
                    case ISOCode.Country:
                        locale += this.defaultLocale.countryCode;
                        break;
                    default:
                        locale += this.defaultLocale.languageCode;
                }
                if (i < codes.length - 1) {
                    locale += "-";
                }
            }
        }
        return locale;
    }

    private initByRouting(): void {
        this.router = InjectorRef.get(Router);
        this.location = InjectorRef.get(Location);

        // Parses the url to find the locale when the app starts.
        const path: string = this.location.path();
        this.parsePath(path);

        // Parses the url to find the locale when a navigation starts.
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationStart)
        ).subscribe((data: NavigationStart) => {
            this.parsePath(data.url, data.navigationTrigger == "popstate");
            this.redirectToPath(data.url);
        });
        // Replaces url when a navigation ends.
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ).subscribe((data: NavigationEnd) => {
            const url: string = (!!data.url && data.url != "/" && data.url == data.urlAfterRedirects) ? data.url : data.urlAfterRedirects;
            this.replacePath(this.composeLocale(this.configuration.localizedRouting!), url);
        });
    }

    private async initByStorage(): Promise<void> {
        // Tries to retrieve default locale & currency from the browser storage.
        if (!this.defaultLocale.value) {
            const defaultLocale: string | null = await this.storage.read("defaultLocale");
            if (!!defaultLocale) {
                this.defaultLocale.value = defaultLocale;
            }
        }
        if (this.currencyCode == null) {
            const currencyCode: string | null = await this.storage.read("currency");
            if (!!currencyCode) {
                this.currencyCode = currencyCode;
            }
        }
        if (this.timezone == null) {
            const zoneName: string | null = await this.storage.read("timezone");
            if (!!zoneName) {
                this.timezone = zoneName;
            }
        }
    }

    private initLanguage(): void {
        if (!this.defaultLocale.languageCode) {
            const browserLanguage: string | null = this.getBrowserLanguage();
            const matchedLanguage: Language | undefined = this.matchLanguage(browserLanguage);
            if (!!browserLanguage && matchedLanguage) {
                this.defaultLocale.build(browserLanguage);
            } else if (this.configuration.language) {
                this.defaultLocale.build(this.configuration.language);
            }
            this.storage.write("defaultLocale", this.defaultLocale.value);
        }
        this.sendLanguageEvents();
    }

    private initDefaultLocale(): void {
        if (!this.defaultLocale.value) {
            if (this.configuration.defaultLocale) {
                this.defaultLocale.build(
                    this.configuration.defaultLocale.languageCode,
                    this.configuration.defaultLocale.countryCode,
                    this.configuration.defaultLocale.scriptCode,
                    this.configuration.defaultLocale.numberingSystem,
                    this.configuration.defaultLocale.calendar
                );
                this.storage.write("defaultLocale", this.defaultLocale.value);
            }
        }
        this.sendDefaultLocaleEvents();
    }

    private initCurrency(): void {
        if (this.currencyCode == null) {
            if (this.configuration.currency) {
                this.currencyCode = this.configuration.currency;
                this.storage.write("currency", this.currencyCode);
            }
        }
        this.sendCurrencyEvents();
    }

    private initTimezone(): void {
        if (this.timezone == null) {
            if (this.configuration.timezone) {
                this.timezone = this.configuration.timezone;
                this.storage.write("timezone", this.timezone);
            }
        }
        this.sendCurrencyEvents();
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

    private replacePath(locale: string, path?: string): void {
        if (path) {
            // Replaces the path with the locale without pushing a new state into history.
            this.location.replaceState(this.getLocalizedPath(locale, path));
        } else {
            path = this.location.path();
            // Parses the path to find the locale.
            const segment: string | null = this.getLocalizedSegment(path);
            if (segment != null) {
                // Removes the locale from the path.
                path = path.replace(segment, "/");
            }
            // Replaces path with the locale pushing a new state into history.
            this.location.go(this.getLocalizedPath(locale, path));
        }
    }

    private getLocalizedPath(locale: string, path: string): string {
        return "/" + locale + path;
    }

    /**
     * Parses path to find the locale in path.
     * @param path The path to be parsed
     * @param sendEvents If popstate event is fired
     */
    private parsePath(path: string, sendEvents: boolean = false): void {
        const segment: string | null = this.getLocalizedSegment(path);
        if (segment != null) {
            // Sets the default locale.
            const locale: string = segment!.replace(/\//gi, "");
            const values: string[] = this.splitLocale(locale, this.configuration.localizedRouting!);
            this.defaultLocale.build(
                values[0],
                values[1] || this.defaultLocale.countryCode,
                values[2] || this.defaultLocale.scriptCode,
                this.defaultLocale.numberingSystem,
                this.defaultLocale.calendar
            );
            this.storage.write("defaultLocale", this.defaultLocale.value);
            if (sendEvents) {
                this.sendLanguageEvents();
                this.sendDefaultLocaleEvents();
                this.sendTranslationEvents();
            }
        }
    }

    /**
     * Removes the locale from the path and navigates without pushing a new state into history.
     * @param path Localized path.
     */
    private redirectToPath(path: string): void {
        const segment: string | null = this.getLocalizedSegment(path);
        if (segment != null) {
            const url: string = path.replace(segment, "/");
            // navigateByUrl keeps the query params.
            this.router.navigateByUrl(url, { skipLocationChange: true });
        }
    }

    private splitLocale(locale: string, codes: ISOCode[]): string[] {
        const values: string[] = locale.split("-");
        const orderedValues: string[] = [];
        if (codes.length > 0) {
            for (let i: number = 0; i < codes.length; i++) {
                switch (codes[i]) {
                    case ISOCode.Script:
                        orderedValues[2] = values[i] || "";
                        break;
                    case ISOCode.Country:
                        orderedValues[1] = values[i] || "";
                        break;
                    default:
                        orderedValues[0] = values[i] || "";
                }
            }
        }
        return orderedValues;
    }

    private getLocalizedSegment(path: string): string | null {
        for (const lang of this.getAvailableLanguages()) {
            const regex: RegExp = new RegExp(`(^\/${lang}\/)|(^\/${lang}$)|(^\/${lang}-.*?\/)|(^\/${lang}-.*?$)`);
            const segments: RegExpMatchArray | null = path.match(regex);
            if (segments != null) {
                return segments[0];
            }
        }
        return null;
    }

}
