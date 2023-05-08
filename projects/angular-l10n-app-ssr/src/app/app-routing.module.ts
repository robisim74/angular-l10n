import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { OnPushComponent } from './on-push/on-push.component';
import { ValidationComponent } from './validation/validation.component';
import { l10nResolver } from 'angular-l10n';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'on-push', component: OnPushComponent },
    { path: 'validation', component: ValidationComponent },
    {
        path: 'lazy',
        loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
        resolve: { l10n: l10nResolver },
        data: {
            l10nProviders: [{ name: 'lazy', asset: './assets/i18n/lazy', options: { version: '16.0.0' } }]
        }
    }
];

const localizedRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    ...routes,
    {
        path: ':lang',
        children: routes
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(localizedRoutes, {
    initialNavigation: 'enabledBlocking'
})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
