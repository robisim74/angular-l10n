import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { TranslationService } from './translation.service';

/**
 * Extend this class in components to provide 'lang' to the 'translate' pipe.
 */
export class Translation implements OnDestroy {

    public lang: string;

    protected translationSubscription: ISubscription;

    constructor(
        public translation: TranslationService,
        public changeDetectorRef?: ChangeDetectorRef
    ) {
        this.lang = this.translation.getLanguage();
        // When the language changes, subscribes to the event & updates lang property.
        this.translationSubscription = this.translation.translationChanged.subscribe(
            (language: string) => {
                this.lang = language;
                // OnPush Change Detection strategy.
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); };
            }
        );
    }

    public ngOnDestroy(): void {
        this.translationSubscription.unsubscribe();
    }

}
