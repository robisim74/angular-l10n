import { LocaleService } from '../services/locale.service';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { InjectorRef } from '../models/injector-ref';
import { Logger } from '../models/logger';

/**
 * Property decorator for components to provide the parameter to the l10nDate pipe.
 */
export function Timezone(): PropertyDecorator {
    function DecoratorFactory(target: any, propertyKey?: string | symbol): void {
        const targetNgOnInit: Function = target.ngOnInit;
        if (typeof targetNgOnInit === "undefined") {
            Logger.log(target.constructor ? target.constructor.name : 'Timezone decorator', 'missingOnInit');
        }

        function ngOnInit(this: any): void {
            const locale: LocaleService = InjectorRef.get(LocaleService);

            if (typeof propertyKey !== "undefined") {
                this[propertyKey] = locale.getCurrentTimezone();
                locale.timezoneChanged.pipe(takeUntilDestroyed(this)).subscribe(
                    (zoneName: string) => {
                        this[propertyKey] = zoneName;
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

        if (typeof propertyKey !== "undefined") {
            Object.defineProperty(target, propertyKey, {
                writable: true,
                value: ''
            });
        }
    }

    return DecoratorFactory;
}
