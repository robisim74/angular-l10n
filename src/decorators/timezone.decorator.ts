import { Subscription } from 'rxjs';

import { LocaleService } from '../services/locale.service';
import { InjectorRef } from '../models/injector-ref';
import { PropertyDecorator } from '../models/types';

/**
 * Property decorator for components to provide the parameter to the l10nDate pipe.
 */
export function Timezone(): PropertyDecorator {

    function DecoratorFactory(target: any, propertyKey?: string | symbol): void {
        let subscription: Subscription;

        const targetNgOnInit: Function = target.ngOnInit;
        function ngOnInit(this: any): void {
            const locale: LocaleService = InjectorRef.get(LocaleService);

            if (typeof propertyKey !== "undefined") {
                this[propertyKey] = locale.getCurrentTimezone();
                // When the timezone changes, subscribes to the event & updates timezone property.
                subscription = locale.timezoneChanged.subscribe(
                    (zoneName: string) => {
                        this[propertyKey] = zoneName;
                    });
            }

            if (targetNgOnInit) {
                targetNgOnInit.apply(this);
            }
        }
        target.ngOnInit = ngOnInit;

        const targetNgOnDestroy: Function = target.ngOnDestroy;
        function ngOnDestroy(this: any): void {
            if (typeof subscription !== "undefined") {
                subscription.unsubscribe();
            }

            if (targetNgOnDestroy) {
                targetNgOnDestroy.apply(this);
            }
        }
        target.ngOnDestroy = ngOnDestroy;

        if (typeof propertyKey !== "undefined") {
            Object.defineProperty(target, propertyKey, {
                writable: true,
                value: undefined
            });
        }
    }

    return DecoratorFactory;

}
