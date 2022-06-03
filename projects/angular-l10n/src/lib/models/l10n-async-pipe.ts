import { Injectable, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { L10nTranslationService } from '../services/l10n-translation.service';

@Injectable()
export class L10nAsyncPipe implements OnDestroy {

    protected onChanges: Subscription;

    protected translation = inject(L10nTranslationService);
    protected cdr = inject(ChangeDetectorRef);

    constructor() {
        this.onChanges = this.translation.onChange().subscribe({
            next: () => this.cdr.markForCheck()
        });
    }

    ngOnDestroy() {
        if (this.onChanges) this.onChanges.unsubscribe();
    }

}
