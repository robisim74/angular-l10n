import { Injectable, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { TranslationService } from './translation.service';
import { InjectorRef } from '../models/injector-ref';

/**
 * Extend this class in components to provide 'lang' to the translate pipe.
 */
@Injectable() export class Translation implements OnDestroy {

    public lang: string;

    protected paramSubscriptions: ISubscription[] = [];

    constructor(
        public translation: TranslationService = InjectorRef.get(TranslationService),
        public changeDetectorRef: ChangeDetectorRef = InjectorRef.get(ChangeDetectorRef)
    ) {
        this.lang = this.translation.getLanguage();
        // When the language changes, subscribes to the event & updates lang property.
        this.paramSubscriptions.push(this.translation.translationChanged.subscribe(
            (language: string) => {
                this.lang = language;
                // OnPush Change Detection strategy.
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); }
            }
        ));
    }

    public ngOnDestroy(): void {
        this.cancelParamSubscriptions();
    }

    protected cancelParamSubscriptions(): void {
        this.paramSubscriptions.forEach((subscription: ISubscription) => {
            if (typeof subscription !== "undefined") {
                subscription.unsubscribe();
            }
        });
    }

}
