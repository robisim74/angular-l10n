import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable() export class L10nCache {

    private cache: { [key: string]: Observable<any> } = {};

    public read(key: string, request: Observable<any>): Observable<any> {
        if (this.cache[key]) return this.cache[key];

        const response = request.pipe(
            shareReplay(1)
        );

        this.cache[key] = response;
        return response;
    }

}
