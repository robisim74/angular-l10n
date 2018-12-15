import { Injectable, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';
import { InjectorRef } from '../models/injector-ref';
import { takeUntilDestroyed } from '../models/take-until-destroyed';

/**
 * Provides 'lang' to translate pipe.
 */
@Injectable() export class Translation implements OnDestroy {

    public lang: string = '';

    constructor(protected changeDetectorRef?: ChangeDetectorRef) {
        const translation: TranslationService = InjectorRef.get(TranslationService);

        translation.allTranslationsChanged().pipe(takeUntilDestroyed(this)).subscribe(
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
        const locale: LocaleService = InjectorRef.get(LocaleService);

        this.defaultLocale = locale.getDefaultLocale();
        locale.defaultLocaleChanged.pipe(takeUntilDestroyed(this)).subscribe(
            (defaultLocale: string) => {
                this.defaultLocale = defaultLocale;
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );

        this.currency = locale.getCurrentCurrency();
        locale.currencyCodeChanged.pipe(takeUntilDestroyed(this)).subscribe(
            (currency: string) => {
                this.currency = currency;
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );

        this.timezone = locale.getCurrentTimezone();
        locale.timezoneChanged.pipe(takeUntilDestroyed(this)).subscribe(
            (zoneName: string) => {
                this.timezone = zoneName;
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        );
    }

}
