import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { L10nTranslationModule, L10nIntlModule, L10nValidationModule } from 'angular-l10n';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PipeComponent } from './home/pipe/pipe.component';
import { DirectiveComponent } from './home/directive/directive.component';
import { ValidationComponent } from './validation/validation.component';
import { OnPushComponent } from './on-push/on-push.component';

import { l10nConfig, TranslationLoader, LocaleValidation, LocaleResolver } from './l10n-config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PipeComponent,
    DirectiveComponent,
    ValidationComponent,
    OnPushComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    L10nTranslationModule.forRoot(
      l10nConfig,
      {
        localeResolver: LocaleResolver,
        translationLoader: TranslationLoader
      }
    ),
    L10nIntlModule,
    L10nValidationModule.forRoot({ validation: LocaleValidation })
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
