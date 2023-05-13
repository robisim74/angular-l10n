import { Routes } from '@angular/router';

import { resolveL10n } from 'angular-l10n';

import { HomeComponent } from './home/home.component';
import { OnPushComponent } from './on-push/on-push.component';
import { ValidationComponent } from './validation/validation.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'on-push', component: OnPushComponent },
  { path: 'validation', component: ValidationComponent },
  {
    path: 'lazy',
    loadComponent: () => import('./lazy/lazy.component').then(m => m.LazyComponent),
    resolve: { l10n: resolveL10n },
    data: {
      l10nProviders: [{ name: 'lazy', asset: 'lazy' }]
    }
  }
];

export const localizedRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  ...routes,
  {
    path: ':lang',
    children: routes
  },
  { path: '**', redirectTo: 'home' }
];
