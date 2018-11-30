import { TranslationService } from '../services/translation.service';
import { PropertyDecorator } from '../models/types';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { InjectorRef } from '../models/injector-ref';

/**
 * Property decorator for components to provide the parameter to the translate pipe.
 */
export function Language(): PropertyDecorator {
    function DecoratorFactory(target: any, propertyKey?: string | symbol): void {
        const targetNgOnInit: Function = target.ngOnInit;

        function ngOnInit(this: any): void {
            const translation: TranslationService = InjectorRef.get(TranslationService);

            if (typeof propertyKey !== "undefined") {
                translation.translationChanged().pipe(takeUntilDestroyed(this)).subscribe(
                    (language: string) => {
                        if (language) {
                            this[propertyKey] = language;
                            // OnPush Change Detection strategy.
                            const cdr: string | undefined = Object.keys(this)
                                .find((key: string) => this[key] && this[key]['markForCheck'] !== undefined);
                            if (cdr) { this[cdr].markForCheck(); }
                        }
                    });
            }

            if (targetNgOnInit) {
                targetNgOnInit.apply(this);
            }
        }
        target.ngOnInit = ngOnInit;

        if (typeof propertyKey !== "undefined") {
            Object.defineProperty(target, propertyKey, {
                writable: true,
                value: undefined
            });
        }
    }

    return DecoratorFactory;
}
