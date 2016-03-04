///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap}    from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http'; // Http module.
import {ROUTER_PROVIDERS} from 'angular2/router'; // Router module.
import {AppComponent} from './app.component'

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS]);