import { Injectable, Injector } from "@angular/core";

/**
 * Allows to get the dependencies at the module level or component.
 */
@Injectable() export class InjectorRef {

    private static injector: Injector;

    public static get(token: any): any {
        if (this.injector) {
            return this.injector.get(token, null);
        }
    }

    constructor(public injector: Injector) {
        InjectorRef.injector = injector;
    }

}
