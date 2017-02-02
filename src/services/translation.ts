import { ChangeDetectorRef } from '@angular/core';

import { TranslationService } from './translation.service';

/**
 * Extend this class in components to provide 'lang' to the 'translate' pipe.
 */
export class Translation {

    public lang: string;

    constructor(
        public translation: TranslationService,
        public changeDetectorRef?: ChangeDetectorRef
    ) {
        this.lang = this.translation.getLanguage();
        // When the language changes, subscribes to the event & updates lang property.
        this.translation.translationChanged.subscribe(
            (language: string) => {
                this.lang = language;
                // OnPush Change Detection strategy.
                if (this.changeDetectorRef) { this.changeDetectorRef.markForCheck(); };
            }
        );
    }

}
