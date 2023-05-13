import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { L10N_CONFIG, L10N_LOCALE, L10nConfig, L10nTranslationToken, L10nValidationToken } from '../models/l10n-config';
import { L10nCache } from '../services/l10n-cache';
import { L10nLoader, L10nDefaultLoader } from '../services/l10n-loader';
import { L10nMissingTranslationHandler, L10nDefaultMissingTranslationHandler } from '../services/l10n-missing-translation-handler';
import { L10nLocaleResolver, L10nDefaultLocaleResolver } from '../services/l10n-locale-resolver';
import { L10nStorage, L10nDefaultStorage } from '../services/l10n-storage';
import { L10nTranslationFallback, L10nDefaultTranslationFallback } from '../services/l10n-translation-fallback';
import { L10nTranslationHandler, L10nDefaultTranslationHandler } from '../services/l10n-translation-handler';
import { L10nTranslationLoader, L10nDefaultTranslationLoader } from '../services/l10n-translation-loader';
import { L10nTranslationService } from '../services/l10n-translation.service';
import { L10nIntlService } from '../services/l10n-intl.service';
import { L10nDefaultValidation, L10nValidation } from '../services/l10n-validation';
import { initL10n } from './initL10n';

export function provideL10nTranslation(config: L10nConfig, token: L10nTranslationToken = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        L10nTranslationService,
        L10nCache,
        { provide: L10N_CONFIG, useValue: config },
        { provide: L10N_LOCALE, useValue: { language: '', units: {} } },
        { provide: L10nStorage, useClass: token.storage || L10nDefaultStorage },
        { provide: L10nLocaleResolver, useClass: token.localeResolver || L10nDefaultLocaleResolver },
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
    ]);
}

export function provideL10nIntl(): EnvironmentProviders {
    return makeEnvironmentProviders([
        L10nIntlService
    ]);
}

export function provideL10nValidation(token: L10nValidationToken = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: L10nValidation, useClass: token.validation || L10nDefaultValidation }
    ]);
}
