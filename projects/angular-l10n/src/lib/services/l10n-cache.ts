import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';

@Injectable() export class L10nCache {

    private cache: { [key: string]: boolean } = {};

    public read(key: string, request: Observable<any>): Observable<any> {
        if (this.cache[key]) return EMPTY;

        this.cache[key] = true;
        return request;
    }

}
