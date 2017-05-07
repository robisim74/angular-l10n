import { ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { LocaleService } from '../services/locale.service';
import { ExtraInjector } from '../models/extra-injector';
import { PropertyDecorator } from '../models/types';

/**
 * DefaultLocale() Property decorator for components to provide parameter
 * to the LocaleDecimal, LocalePercent & LocaleCurrency pipes.
 */
export function DefaultLocale(): PropertyDecorator {

    return (target: any, propertyKey?: string): void => {
        let defaultLocale: string;

        const targetNgOnInit: Function = target.ngOnInit;
        const targetNgOnDestroy: Function = target.ngOnDestroy;

        let subscription: ISubscription;

        target.ngOnInit = function (): void {
            const locale: LocaleService = ExtraInjector.get(LocaleService);
            const changeDetectorRef: ChangeDetectorRef = ExtraInjector.get(ChangeDetectorRef);

            defaultLocale = locale.getDefaultLocale();
            // When the default locale changes, subscribes to the event & updates defaultLocale property.
            subscription = locale.defaultLocaleChanged.subscribe(
                (value: string) => {
                    defaultLocale = value;
                    // OnPush Change Detection strategy.
                    if (changeDetectorRef) { changeDetectorRef.markForCheck(); }
                });

            if (targetNgOnInit) {
                targetNgOnInit.apply(this);
            }
        };

        target.ngOnDestroy = function (): void {
            if (typeof subscription !== "undefined") {
                subscription.unsubscribe();
            }

            if (targetNgOnDestroy) {
                targetNgOnDestroy.apply(this);
            }
        };

        if (typeof propertyKey !== "undefined") {
            Object.defineProperty(target, propertyKey, {
                get: () => defaultLocale
            });
        }
    };

}
