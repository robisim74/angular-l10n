import { LocaleService } from '../services/locale.service';
import { InjectorRef } from '../models/injector-ref';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { Logger } from '../models/logger';

/**
 * Property decorator for components to provide the parameter
 * to l10nDate, l10nDecimal, l10nPercent & l10nCurrency pipes.
 */
export function DefaultLocale(): PropertyDecorator {
    function DecoratorFactory(target: any, propertyKey?: string | symbol): void {
        const targetNgOnInit: Function = target.ngOnInit;
        if (typeof targetNgOnInit === "undefined") {
            Logger.log(target.constructor ? target.constructor.name : 'DefaultLocale decorator', 'missingOnInit');
        }

        function ngOnInit(this: any): void {
            const locale: LocaleService = InjectorRef.get(LocaleService);

            if (typeof propertyKey !== "undefined") {
                this[propertyKey] = locale.getDefaultLocale();
                locale.defaultLocaleChanged.pipe(takeUntilDestroyed(this)).subscribe(
                    (defaultLocale: string) => {
                        this[propertyKey] = defaultLocale;
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
