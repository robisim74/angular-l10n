import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideL10nIntl, provideL10nTranslation, provideL10nValidation } from 'angular-l10n';

import { localizedRoutes } from './app.routes';
import { HttpTranslationLoader, LocaleValidation, LocaleResolver, l10nConfig } from './l10n-config';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(localizedRoutes),
    provideHttpClient(),
    provideL10nTranslation(
      l10nConfig,
      {
        localeResolver: LocaleResolver,
        translationLoader: HttpTranslationLoader
      }
    ),
    provideL10nIntl(),
    provideL10nValidation({ validation: LocaleValidation })
  ]
};
