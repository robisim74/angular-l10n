///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap}    from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http'; // Http module.

import {AppComponent} from './app.component'

bootstrap(AppComponent, [HTTP_PROVIDERS]);