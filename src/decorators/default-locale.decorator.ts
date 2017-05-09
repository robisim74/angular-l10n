import { ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { LocaleService } from '../services/locale.service';
import { InjectorRef } from '../models/injector-ref';
import { PropertyDecorator } from '../models/types';

/**
 * Property decorator for components to provide the parameter
 * to localeDecimal, localePercent & localeCurrency pipes.
 */
export function DefaultLocale(): PropertyDecorator {

    return (target: any, propertyKey?: string): void => {
        const targetNgOnInit: Function = target.ngOnInit;
        const targetNgOnDestroy: Function = target.ngOnDestroy;

        let subscription: ISubscription;

        target.ngOnInit = function (): void {
            const locale: LocaleService = InjectorRef.get(LocaleService);
            const changeDetectorRef: ChangeDetectorRef = InjectorRef.get(ChangeDetectorRef);

            if (typeof propertyKey !== "undefined") {
                this[propertyKey] = locale.getDefaultLocale();
                // When the default locale changes, subscribes to the event & updates defaultLocale property.
                subscription = locale.defaultLocaleChanged.subscribe(
                    (value: string) => {
                        this[propertyKey] = value;
                        // OnPush Change Detection strategy.
                        if (changeDetectorRef) { changeDetectorRef.markForCheck(); }
                    });
            }

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
                writable: true,
                value: undefined
            });
        }
    };

}
