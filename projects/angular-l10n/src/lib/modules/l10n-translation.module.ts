import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';

import { L10nTranslatePipe, L10nTranslateAsyncPipe } from '../pipes/l10n-translate.pipe';
import { L10nTranslateDirective } from '../directives/l10n-translate.directive';
import { L10nConfig, L10nTranslationToken, L10N_CONFIG, L10N_LOCALE } from '../models/l10n-config';
import { L10nTranslationService } from '../services/l10n-translation.service';
import { L10nCache } from '../services/l10n-cache';
import { L10nStorage, L10nDefaultStorage } from '../services/l10n-storage';
import { L10nResolveLocale, L10nDefaultResolveLocale } from '../services/l10n-resolve-locale';
import { L10nTranslationFallback, L10nDefaultTranslationFallback } from '../services/l10n-translation-fallback';
import { L10nTranslationLoader, L10nDefaultTranslationLoader } from '../services/l10n-translation-loader';
import { L10nTranslationHandler, L10nDefaultTranslationHandler } from '../services/l10n-translation-handler';
import { L10nMissingTranslationHandler, L10nDefaultMissingTranslationHandler } from '../services/l10n-missing-translation-handler';
import { L10nLoader, L10nDefaultLoader } from '../services/l10n-loader';
import { initL10n } from '../functions/initL10n';

@NgModule({
    imports: [
        L10nTranslatePipe,
        L10nTranslateAsyncPipe,
        L10nTranslateDirective
    ],
    exports: [
        L10nTranslatePipe,
        L10nTranslateAsyncPipe,
        L10nTranslateDirective
    ]
})
export class L10nTranslationModule {

    public static forRoot(config: L10nConfig, token: L10nTranslationToken = {}): ModuleWithProviders<L10nTranslationModule> {
        return {
            ngModule: L10nTranslationModule,
            providers: [
                L10nTranslationService,
                L10nCache,
                { provide: L10N_CONFIG, useValue: config },
                { provide: L10N_LOCALE, useValue: { language: '', units: {} } },
                { provide: L10nStorage, useClass: token.storage || L10nDefaultStorage },
                { provide: L10nResolveLocale, useClass: token.resolveLocale || L10nDefaultResolveLocale },
                { provide: L10nTranslationFallback, useClass: token.translationFallback || L10nDefaultTranslationFallback },
                { provide: L10nTranslationLoader, useClass: token.translationLoader || L10nDefaultTranslationLoader },
                { provide: L10nTranslationHandler, useClass: token.translationHandler || L10nDefaultTranslationHandler },
                {
                    provide: L10nMissingTranslationHandler,
                    useClass: token.missingTranslationHandler || L10nDefaultMissingTranslationHandler
                },
                { provide: L10nLoader, useClass: token.loader || L10nDefaultLoader },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initL10n,
                    deps: [L10nLoader],
                    multi: true
                }
            ]
        };
    }

}
