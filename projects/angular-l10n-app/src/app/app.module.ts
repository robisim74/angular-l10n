import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { L10nTranslationModule, L10nIntlModule, L10nValidationModule, L10nRoutingModule, L10nLoader } from 'angular-l10n';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OnPushComponent } from './on-push/on-push.component';

import { l10nConfig, initL10n, AppStorage, HttpTranslationLoader, LocaleValidation } from './l10n-config';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        OnPushComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        L10nTranslationModule.forRoot(
            l10nConfig,
            {
                storage: AppStorage,
                translationLoader: HttpTranslationLoader
            }
        ),
        L10nIntlModule,
        L10nValidationModule.forRoot({ validation: LocaleValidation }),
        L10nRoutingModule.forRoot()
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initL10n,
            deps: [L10nLoader],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
