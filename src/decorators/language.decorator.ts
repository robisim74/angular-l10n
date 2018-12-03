import { TranslationService } from '../services/translation.service';
import { PropertyDecorator } from '../models/types';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { InjectorRef } from '../models/injector-ref';
import { Logger } from '../models/logger';

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
                        this[propertyKey] = language;
                        // OnPush Change Detection strategy.
                        const cdr: string | undefined = Object.keys(this)
                            .find((key: string) => this[key] && this[key]['markForCheck'] !== undefined);
                        if (cdr) { this[cdr].markForCheck(); }
                    });
            }

            if (targetNgOnInit) {
                targetNgOnInit.apply(this);
            } else {
                Logger.log(this.constructor ? this.constructor.name : 'Language decorator', 'missingOnInit');
            }
        }
        target.ngOnInit = ngOnInit;

        if (typeof propertyKey !== "undefined") {
            Object.defineProperty(target, propertyKey, {
                writable: true,
                value: ''
            });
        }
    }

    return DecoratorFactory;
}
