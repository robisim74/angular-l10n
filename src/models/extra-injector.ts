import { Injectable, Injector } from "@angular/core";

/**
 * Allows to get extra dependencies.
 */
@Injectable() export class ExtraInjector {

    private static injector: Injector;

    public static get(token: any): any {
        if (ExtraInjector.injector) {
            return ExtraInjector.injector.get(token, null);
        }
    }

    constructor(public injector: Injector) {
        ExtraInjector.injector = injector;
    }

}
