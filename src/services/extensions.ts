import { Injectable, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { InjectorRef } from '../models/injector-ref';

/**
 * Provides 'lang' to translate pipe.
 */
@Injectable() export class Translation implements OnDestroy {

    public lang: string;

    protected get locale(): LocaleService {
        return InjectorRef.get(LocaleService);
    }

    protected get translation(): TranslationService {
        return InjectorRef.get(TranslationService);
    }

    constructor(protected changeDetectorRef?: ChangeDetectorRef) {
        this.translation.translationChanged().pipe(takeUntilDestroyed(this)).subscribe(
            (language: string) => {
                this.lang = language;
                // OnPush Change Detection strategy.
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );
    }

    public ngOnDestroy(): void { }

}

/**
 * Provides 'lang' to translate pipe,
 * 'defaultLocale', 'currency', 'timezone' to l10nDate, l10nDecimal, l10nPercent & l10nCurrency pipes.
 */
@Injectable() export class Localization extends Translation {

    public defaultLocale: string;
    public currency: string;
    public timezone: string;

    constructor(protected changeDetectorRef?: ChangeDetectorRef) {
        super();

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
