import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { Translation } from './translation';
import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';

/**
 * Extend this class in components to provide 'lang', 'defaultLocale' & 'currency' to the translate and locale pipes.
 */
export class Localization extends Translation implements OnDestroy {

    public defaultLocale: string;
    public currency: string;

    protected defaultLocaleSubscription: ISubscription;
    protected currencySubscription: ISubscription;

    constructor(
        public locale: LocaleService,
        public translation: TranslationService,
        public changeDetectorRef?: ChangeDetectorRef
    ) {
        super(translation, changeDetectorRef);

        this.defaultLocale = this.locale.getDefaultLocale();
        // When the default locale changes, subscribes to the event & updates defaultLocale property.
        this.defaultLocaleSubscription = this.locale.defaultLocaleChanged.subscribe(
            (defaultLocale: string) => {
                this.defaultLocale = defaultLocale;
                // OnPush Change Detection strategy.
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); };
            }
        );

        this.currency = this.locale.getCurrentCurrency();
        // When the currency changes, subscribes to the event & updates currency property.
        this.currencySubscription = this.locale.currencyCodeChanged.subscribe(
            (currency: string) => {
                this.currency = currency;
                // OnPush Change Detection strategy.
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); };
            }
        );
    }

    public ngOnDestroy(): void {
        this.defaultLocaleSubscription.unsubscribe();
        this.currencySubscription.unsubscribe();
    }

}
