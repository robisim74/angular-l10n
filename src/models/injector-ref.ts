import { Injectable, Injector } from "@angular/core";

import { Type } from './types';

/**
 * Allows to get the dependencies at the module level or component.
 */
@Injectable() export class InjectorRef {

    private static injector: Injector;

    public static get<T>(token: Type<T>): any {
        if (this.injector) {
            return this.injector.get(token, undefined);
        }
    }

    constructor(public injector: Injector) {
        InjectorRef.injector = injector;
    }

}
