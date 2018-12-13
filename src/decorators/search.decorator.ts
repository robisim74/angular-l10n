import { Title, Meta } from '@angular/platform-browser';

import { TranslationService } from '../services/translation.service';
import { takeUntilDestroyed } from '../models/take-until-destroyed';
import { InjectorRef } from '../models/injector-ref';
import { Logger } from '../models/logger';
import { L10nConfigRef, L10N_CONFIG } from '../models/l10n-config';

/**
 * Class decorator to translate page title and meta tags.
 * @param page The path to the current page.
 */
export function Search(page: string): ClassDecorator {
    function DecoratorFactory(target: any): void {
        const targetNgOnInit: Function = target.prototype.ngOnInit;
        if (typeof targetNgOnInit === "undefined") {
            Logger.log(target.constructor ? target.constructor.name : 'Search decorator', 'missingOnInit');
        }

        function ngOnInit(this: any): void {
            const title: Title = InjectorRef.get(Title);
            const meta: Meta = InjectorRef.get(Meta);
            const configuration: L10nConfigRef = InjectorRef.get(L10N_CONFIG);
            const translation: TranslationService = InjectorRef.get(TranslationService);

            translation.translationChanged().pipe(takeUntilDestroyed(this)).subscribe(
                () => {
                    title.setTitle(translation.translate(page + (configuration.translation.composedKeySeparator || '') + 'title'));
                    if (configuration.search.metaTags) {
                        for (const name of configuration.search.metaTags) {
                            meta.updateTag(
                                {
                                    name: name,
                                    content: translation.translate(page + (configuration.translation.composedKeySeparator || '') + name)
                                }
                            );
                        }
                    }
                });

            if (targetNgOnInit) {
                targetNgOnInit.apply(this);
            }
        }
        target.prototype.ngOnInit = ngOnInit;
    }

    return DecoratorFactory;
}
