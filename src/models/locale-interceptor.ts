import { Injectable, Inject } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

import { LocaleService } from "../services/locale.service";
import { L10N_CONFIG, L10nConfigRef } from "./l10n-config";

@Injectable() export class LocaleInterceptor implements HttpInterceptor {

    constructor(@Inject(L10N_CONFIG) private configuration: L10nConfigRef, private locale: LocaleService) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.configuration.localeInterceptor.format) {
            const locale: string = this.locale.composeLocale(this.configuration.localeInterceptor.format);
            if (!!locale) {
                request = request.clone({ setHeaders: { 'Accept-Language': locale } });
            }
        }
        return next.handle(request);
    }

}
