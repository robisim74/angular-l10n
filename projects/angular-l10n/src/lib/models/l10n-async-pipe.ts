import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { L10nTranslationService } from '../services/l10n-translation.service';

export class L10nAsyncPipe implements OnDestroy {

    protected onChanges: Subscription;

    constructor(protected translation: L10nTranslationService, protected cdr: ChangeDetectorRef) {

        this.onChanges = this.translation.onChange().subscribe({
            next: () => this.cdr.markForCheck()
        });
    }

    ngOnDestroy() {
        if (this.onChanges) this.onChanges.unsubscribe();
    }

}
