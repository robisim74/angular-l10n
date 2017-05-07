import { ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { LocaleService } from '../services/locale.service';
import { ExtraInjector } from '../models/extra-injector';
import { PropertyDecorator } from '../models/types';

/**
 * Currency() Property decorator for components to provide parameter to the LocaleCurrency pipe.
 */
export function Currency(): PropertyDecorator {

    return (target: any, propertyKey?: string): void => {
        let currency: string;

        const targetNgOnInit: Function = target.ngOnInit;
        const targetNgOnDestroy: Function = target.ngOnDestroy;

        let subscription: ISubscription;

        target.ngOnInit = function (): void {
            const locale: LocaleService = ExtraInjector.get(LocaleService);
            const changeDetectorRef: ChangeDetectorRef = ExtraInjector.get(ChangeDetectorRef);

            currency = locale.getCurrentCurrency();
            // When the currency changes, subscribes to the event & updates currency property.
            subscription = locale.currencyCodeChanged.subscribe(
                (value: string) => {
                    currency = value;
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
                get: () => currency
            });
        }
    };

}
