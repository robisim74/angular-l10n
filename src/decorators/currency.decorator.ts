import { LocaleService } from '../services/locale.service';
import { InjectorRef } from '../models/injector-ref';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { Logger } from '../models/logger';

/**
 * Property decorator for components to provide the parameter to the l10nCurrency pipe.
 */
export function Currency(): PropertyDecorator {
    function DecoratorFactory(target: any, propertyKey?: string | symbol): void {
        const targetNgOnInit: Function = target.ngOnInit;
        if (typeof targetNgOnInit === "undefined") {
            Logger.log(target.constructor ? target.constructor.name : 'Currency decorator', 'missingOnInit');
        }

        function ngOnInit(this: any): void {
            const locale: LocaleService = InjectorRef.get(LocaleService);

            if (typeof propertyKey !== "undefined") {
                this[propertyKey] = locale.getCurrentCurrency();
                locale.currencyCodeChanged.pipe(takeUntilDestroyed(this)).subscribe(
                    (currency: string) => {
                        this[propertyKey] = currency;
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
