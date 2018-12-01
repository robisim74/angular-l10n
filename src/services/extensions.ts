import { Injectable, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { InjectorRef } from '../models/injector-ref';

/**
 * Provides 'lang' to the translate pipe.
 */
@Injectable() export class Translation implements OnDestroy {

    public lang: string;

    protected locale: LocaleService;
    protected translation: TranslationService;

    constructor(protected changeDetectorRef?: ChangeDetectorRef) {
        this.translation = InjectorRef.get(TranslationService);
        this.translation.translationChanged().pipe(takeUntilDestroyed(this)).subscribe(
            (language: string) => {
                if (language) {
                    this.lang = language;
                    // OnPush Change Detection strategy.
                    if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
                }
            }
        );
    }

    ngOnDestroy(): void { }

}

/**
 * Provides 'lang' to the translate pipe,
 * 'defaultLocale', 'currency', 'timezone' to l10nDate, l10nDecimal, l10nPercent & l10nCurrency pipes.
 */
@Injectable() export class Localization extends Translation {

    public defaultLocale: string;
    public currency: string;
    public timezone: string;

    constructor(protected changeDetectorRef?: ChangeDetectorRef) {
        super();

        this.locale = InjectorRef.get(LocaleService);
        this.defaultLocale = this.locale.getDefaultLocale();
        this.locale.defaultLocaleChanged.pipe(takeUntilDestroyed(this)).subscribe(
            (defaultLocale: string) => {
                this.defaultLocale = defaultLocale;
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );

        this.currency = this.locale.getCurrentCurrency();
        this.locale.currencyCodeChanged.pipe(takeUntilDestroyed(this)).subscribe(
            (currency: string) => {
                this.currency = currency;
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );

        this.timezone = this.locale.getCurrentTimezone();
        this.locale.timezoneChanged.pipe(takeUntilDestroyed(this)).subscribe(
            (zoneName: string) => {
                this.timezone = zoneName;
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );
    }

}
