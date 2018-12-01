import { Injectable, Injector, InjectionToken } from '@angular/core';

import { Type } from './types';

/**
 * Allows to get the dependencies at the module level or component.
 */
@Injectable() export class InjectorRef {

    private static injector: Injector;

    public static get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
        return InjectorRef.injector.get(token, notFoundValue);
    }

    constructor(private injector: Injector) {
        InjectorRef.injector = this.injector;
    }

}
