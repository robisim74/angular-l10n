import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { L10nTranslationModule, L10nLoader } from 'angular-l10n';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { l10nConfig, L10nHttpTranslationLoader, initL10n } from './l10n-config';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        L10nTranslationModule.forRoot(
            l10nConfig,
            { translationLoader: L10nHttpTranslationLoader }
        )
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
