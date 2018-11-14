import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LocaleInterceptor } from '../models/locale-interceptor';

/**
 * Sets locale in 'Accept-Language' header on outgoing requests.
 */
@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: LocaleInterceptor, multi: true }
    ]
})
export class LocaleInterceptorModule { }
