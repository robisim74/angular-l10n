import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

@Injectable() export class Caching {

    private cache: { [key: string]: Observable<any> | undefined } = {};

    public read(key: string, request: Observable<any>): Observable<any> {
        const cached: Observable<any> | undefined = this.cache[key];
        if (cached) return cached;

        const buffer: ReplaySubject<any> = new ReplaySubject<any>(1);
        request.subscribe(
            (value: any) => buffer.next(value),
            (error: any) => {
                buffer.error(error);
                this.cache[key] = undefined;
            },
            () => buffer.complete()
        );

        const response: Observable<any> = buffer.asObservable();
        this.cache[key] = response;

        return response;
    }

}
