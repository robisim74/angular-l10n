import { ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { TranslationService } from '../services/translation.service';
import { InjectorRef } from '../models/injector-ref';
import { PropertyDecorator } from '../models/types';

/**
 * Property decorator for components to provide the parameter to the translate pipe.
 */
export function Language(): PropertyDecorator {

    function DecoratorFactory(target: any, propertyKey?: string): void {
        let subscription: ISubscription;

        const targetNgOnInit: Function = target.ngOnInit;
        function ngOnInit(this: any): void {
            const translation: TranslationService = InjectorRef.Get(TranslationService);
            const changeDetectorRef: ChangeDetectorRef = InjectorRef.Get(ChangeDetectorRef);

            if (typeof propertyKey !== "undefined") {
                this[propertyKey] = translation.getLanguage();
                // When the language changes, subscribes to the event & updates language property.
                subscription = translation.translationChanged.subscribe(
                    (value: string) => {
                        this[propertyKey] = value;
                        // OnPush Change Detection strategy.
                        if (changeDetectorRef) { changeDetectorRef.markForCheck(); }
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
