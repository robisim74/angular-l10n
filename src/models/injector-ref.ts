import { Injectable, Injector } from "@angular/core";

/**
 * Allows to get the dependencies at the module level or component.
 */
@Injectable() export class InjectorRef {

    private static Injector: Injector;

    public static Get(token: any): any {
        if (InjectorRef.Injector) {
            return InjectorRef.Injector.get(token, null);
        }
    }

    constructor(public injector: Injector) {
        InjectorRef.Injector = injector;
    }

}
