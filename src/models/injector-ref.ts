import { Injectable, Injector } from "@angular/core";

import { Type } from './types';

/**
 * Allows to get the dependencies at the module level or component.
 */
@Injectable() export class InjectorRef {

    private static injector: any = null;

    public static get<T>(token: Type<T>): T {
        return InjectorRef.injector.get(token);
    }

    constructor(private injector: Injector) {
        InjectorRef.injector = this.injector;
    }

}
