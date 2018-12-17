import { Injectable, Injector, InjectionToken } from '@angular/core';

import { TranslationService } from '../services/translation.service';
import { Type } from './types';

/**
 * Allows to get the dependencies at the root level.
 */
@Injectable() export class InjectorRef {

    private static injector: Injector = Injector.NULL;

    public static get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
        return InjectorRef.injector.get(token, notFoundValue);
    }

    /**
     * TranslationService instances.
     */
    public translations: TranslationService[] = [];

    constructor(private injector: Injector) {
        InjectorRef.injector = this.injector;
    }

}
