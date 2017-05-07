import { ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { TranslationService } from '../services/translation.service';
import { ExtraInjector } from '../models/extra-injector';
import { PropertyDecorator } from '../models/types';

/**
 * Language() Property decorator for components to provide parameter to the Translate pipe.
 */
export function Language(): PropertyDecorator {

    return (target: any, propertyKey?: string): void => {
        let language: string;

        const targetNgOnInit: Function = target.ngOnInit;
        const targetNgOnDestroy: Function = target.ngOnDestroy;

        let subscription: ISubscription;

        target.ngOnInit = function (): void {
            const translation: TranslationService = ExtraInjector.get(TranslationService);
            const changeDetectorRef: ChangeDetectorRef = ExtraInjector.get(ChangeDetectorRef);

            language = translation.getLanguage();
            // When the language changes, subscribes to the event & updates language property.
            subscription = translation.translationChanged.subscribe(
                (value: string) => {
                    language = value;
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
                get: () => language
            });
        }
    };

}
