import { Subscription } from 'rxjs';

import { TranslationService } from '../services/translation.service';
import { InjectorRef } from '../models/injector-ref';
import { PropertyDecorator } from '../models/types';

/**
 * Property decorator for components to provide the parameter to the translate pipe.
 */
export function Language(): PropertyDecorator {

    function DecoratorFactory(target: any, propertyKey?: string | symbol): void {
        let subscription: Subscription;

        const targetNgOnInit: Function = target.ngOnInit;
        function ngOnInit(this: any): void {
            const translation: TranslationService = InjectorRef.get(TranslationService);

            if (typeof propertyKey !== "undefined") {
                // When the language changes, subscribes to the event & updates language property.
                subscription = translation.translationChanged().subscribe(
                    (language: string) => {
                        this[propertyKey] = language;
                        // OnPush Change Detection strategy.
                        const cdr: string | undefined = Object.keys(this)
                            .find((key: string) => this[key] && this[key]['markForCheck'] !== undefined);
                        if (cdr) { this[cdr].markForCheck(); }
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
