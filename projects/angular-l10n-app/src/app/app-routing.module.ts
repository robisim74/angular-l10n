import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
        path: 'lazy', loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
