import { Injectable, Inject } from "@angular/core";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";

import { LocaleService } from "../services/locale.service";
import { InjectorRef } from "./injector-ref";
import { L10N_CONFIG, L10nConfigRef } from "./l10n-config";
import { Locale, ISOCode, ExtraCode, Schema } from "./types";

@Injectable() export class LocalizedRouting {

    private get router(): Router {
        return InjectorRef.get(Router);
    }

    private get location(): Location {
        return InjectorRef.get(Location);
    }

    constructor(@Inject(L10N_CONFIG) private configuration: L10nConfigRef, private locale: LocaleService) { }

    public init(): void {
        if (this.configuration.localizedRouting.format) {
            // Parses the url to find the locale when the app starts.
            const path: string = this.location.path(true);
            this.parsePath(path);

            // Parses the url to find the locale when a navigation starts.
            this.router.events.pipe(
                filter((event: any) => event instanceof NavigationStart)
            ).subscribe((data: NavigationStart) => {
                this.redirectToPath(data.url);
            });
            // Replaces url when a navigation ends.
            this.router.events.pipe(
                filter((event: any) => event instanceof NavigationEnd)
            ).subscribe((data: NavigationEnd) => {
                const url: string = (!!data.url && data.url != "/" && data.url == data.urlAfterRedirects) ?
                    data.url :
                    data.urlAfterRedirects;
                this.replacePath(this.locale.composeLocale(this.configuration.localizedRouting.format!), url);
            });

            // Replaces url when locale changes.
            this.locale.languageCodeChanged.subscribe(() => {
                this.replacePath(this.locale.composeLocale(this.configuration.localizedRouting.format!));
            });
            this.locale.defaultLocaleChanged.subscribe(() => {
                this.replacePath(this.locale.composeLocale(this.configuration.localizedRouting.format!));
            });
        }
    }

    /**
     * Parses path to find the locale.
     * @param path The path to be parsed
     */
    private parsePath(path?: string): void {
        if (!path) return;
        const segment: string | null = this.getLocalizedSegment(path);
        if (segment != null) {
            const locale: string = segment!.replace(/\//gi, "");
            const localeCodes: Locale = this.splitLocale(locale, this.configuration.localizedRouting.format!);

            // Unrecognized segment.
            if (this.configuration.localizedRouting.schema) {
                if (!this.compareLocale(localeCodes,
                    {
                        languageCode: localeCodes.languageCode,
                        scriptCode: this.getSchema(ISOCode.Script, localeCodes),
                        countryCode: this.getSchema(ISOCode.Country, localeCodes)
                    })
                ) return;
            }

            if (this.configuration.locale.language) {
                this.locale.setCurrentLanguage(localeCodes.languageCode);
            }
            if (this.configuration.locale.defaultLocale) {
                this.locale.setDefaultLocale(
                    localeCodes.languageCode,
                    localeCodes.countryCode || this.getSchema(ISOCode.Country, localeCodes),
                    localeCodes.scriptCode || this.getSchema(ISOCode.Script, localeCodes),
                    this.getSchema(ExtraCode.NumberingSystem, localeCodes),
                    this.getSchema(ExtraCode.Calendar, localeCodes)
                );
            }
            if (this.configuration.locale.currency) {
                const currency: string | undefined = this.getSchema(ExtraCode.Currency, localeCodes);
                if (currency) {
                    this.locale.setCurrentCurrency(currency);
                }
            }
            if (this.configuration.locale.timezone) {
                const timezone: string | undefined = this.getSchema(ExtraCode.Timezone, localeCodes);
                if (timezone) {
                    this.locale.setCurrentTimezone(timezone);
                }
            }
        }
    }

    /**
     * Removes the locale from the path and navigates without pushing a new state into history.
     * @param path Localized path
     */
    private redirectToPath(path: string): void {
        const segment: string | null = this.getLocalizedSegment(path);
        if (segment != null) {
            const url: string = path.replace(segment, "/");
            // navigateByUrl keeps the query params.
            this.router.navigateByUrl(url, { skipLocationChange: true });
        }
    }

    /**
     * Replaces the path with the locale without pushing a new state into history.
     * @param locale The current locale
     * @param path The path to be replaced
     */
    private replacePath(locale: string, path?: string): void {
        if (path) {
            if (!this.isDefaultRouting()) {
                this.location.replaceState(this.getLocalizedPath(locale, path));
            }
        } else {
            path = this.location.path(true);
            // Parses the path to find the locale.
            const segment: string | null = this.getLocalizedSegment(path);
            if (segment != null) {
                // Removes the locale from the path.
                path = path.replace(segment, "/");

                if (this.isDefaultRouting()) {
                    this.location.replaceState(path);
                }
            }
            if (!this.isDefaultRouting()) {
                this.location.replaceState(this.getLocalizedPath(locale, path));
            }
        }
    }

    private getLocalizedSegment(path: string): string | null {
        for (const lang of this.locale.getAvailableLanguages()) {
            const regex: RegExp = new RegExp(`(\/${lang}\/)|(\/${lang}$)|(\/${lang}-.*?\/)|(\/${lang}-.*?$)`);
            const segments: RegExpMatchArray | null = path.match(regex);
            if (segments != null) {
                return segments[0];
            }
        }
        return null;
    }

    private splitLocale(locale: string, codes: ISOCode[]): Locale {
        const values: string[] = locale.split("-");
        const localeCodes: Locale = { languageCode: "" };
        if (codes.length > 0) {
            for (let i: number = 0; i < codes.length; i++) {
                if (values[i]) localeCodes[codes[i]] = values[i];
            }
        }
        return localeCodes;
    }

    private compareLocale(locale1: Locale, locale2: Locale): boolean {
        return locale1.languageCode == locale2.languageCode &&
            (!!locale1.scriptCode ?
                locale1.scriptCode == locale2.scriptCode : true) &&
            (!!locale1.countryCode ?
                locale1.countryCode == locale2.countryCode : true);
    }

    private getSchema(code: string, locale: Locale): string | undefined {
        if (!this.configuration.localizedRouting.schema) return undefined;
        const schema: any = this.configuration.localizedRouting.schema
            .find(((s: Schema) => this.compareLocale(locale, s)));
        return schema ? schema[code] : undefined;
    }

    private isDefaultRouting(): boolean {
        if (!this.configuration.localizedRouting.defaultRouting) return false;
        if (this.configuration.locale.language) {
            return this.locale.getCurrentLanguage() == this.configuration.locale.language;
        }
        if (this.configuration.locale.defaultLocale) {
            return this.compareLocale(
                {
                    languageCode: this.locale.getCurrentLanguage(),
                    scriptCode: this.locale.getCurrentScript(),
                    countryCode: this.locale.getCurrentCountry()
                },
                this.configuration.locale.defaultLocale
            );
        }
        return false;
    }

    private getLocalizedPath(locale: string, path: string): string {
        return Location.stripTrailingSlash("/" + locale + path);
    }

}
