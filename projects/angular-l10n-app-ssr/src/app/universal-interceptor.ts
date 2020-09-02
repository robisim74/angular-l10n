import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Observable } from 'rxjs';

import { Request } from 'express';

@Injectable() export class UniversalInterceptor implements HttpInterceptor {

    constructor(@Optional() @Inject(REQUEST) protected request: any) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let serverReq: HttpRequest<any> = req;

        let newUrl;

        // Static assets
        if (serverReq.url.startsWith('./assets')) {
            if (this.request) {
                // Node server
                newUrl = `${this.request.protocol}://${this.request.get('host')}`;
            } else {
                // Prerendering
                newUrl = `http://localhost:5000`;
            }
        }

        if (newUrl) {
            if (!req.url.startsWith('/')) {
                newUrl += '/';
            }
            newUrl += req.url;
            serverReq = req.clone({ url: newUrl });
        }
        return next.handle(serverReq);
    }
}
