import { Injectable, Inject } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

import { LOCALE_INTERCEPTOR_CONFIG, LocaleInterceptorConfig } from "./l10n-config";
import { LocaleService } from "../services/locale.service";

@Injectable() export class LocaleInterceptor implements HttpInterceptor {

    constructor(@Inject(LOCALE_INTERCEPTOR_CONFIG) private configuration: LocaleInterceptorConfig, private locale: LocaleService) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.configuration.format) {
            const locale: string = this.locale.composeLocale(this.configuration.format);
            if (!!locale) {
                request = request.clone({ setHeaders: { 'Accept-Language': locale } });
            }
        }
        return next.handle(request);
    }

}
