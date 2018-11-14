import { Injectable, Inject } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

import { LOCALE_CONFIG, LocaleConfig } from "./l10n-config";
import { LocaleService } from "../services/locale.service";

@Injectable() export class LocaleInterceptor implements HttpInterceptor {

    constructor(@Inject(LOCALE_CONFIG) private configuration: LocaleConfig, private locale: LocaleService) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.configuration.localeInterceptor) {
            const locale: string = this.locale.composeLocale(this.configuration.localeInterceptor);
            if (!!locale) {
                request = request.clone({ setHeaders: { 'Accept-Language': locale } });
            }
        }
        return next.handle(request);
    }

}
