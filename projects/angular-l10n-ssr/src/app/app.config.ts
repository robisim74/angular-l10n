import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideL10nIntl, provideL10nTranslation, provideL10nValidation } from 'angular-l10n';

import { localizedRoutes } from './app.routes';
import { TranslationLoader, LocaleValidation, LocaleResolver, l10nConfig } from './l10n-config';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(localizedRoutes),
    provideL10nTranslation(
      l10nConfig,
      {
        localeResolver: LocaleResolver,
        translationLoader: TranslationLoader
      }
    ),
    provideL10nIntl(),
    provideL10nValidation({ validation: LocaleValidation }),
    provideClientHydration()
  ]
};
