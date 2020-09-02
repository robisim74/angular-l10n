import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CookieBackendModule } from 'ngx-cookie-backend';

import { UniversalInterceptor } from './universal-interceptor';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    CookieBackendModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UniversalInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
