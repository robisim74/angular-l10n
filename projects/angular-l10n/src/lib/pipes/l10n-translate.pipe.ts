import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { L10nTranslationService } from '../services/l10n-translation.service';

@Pipe({
    name: 'translate',
    pure: true
})
export class L10nTranslatePipe implements PipeTransform {

    constructor(protected translation: L10nTranslationService) { }

    /**
     * Translates a key.
     * @param key The key to be translated
     * @param language The current language
     * @param params Optional parameters contained in the key
     */
    public transform(key: string, language?: string, params?: any): string | null {
        if (key == null || key === '') return null;

        return this.translation.translate(key, params, language);
    }

}

/**
 * Use with OnPush change detection strategy.
 */
@Pipe({
    name: 'translateAsync',
    pure: false
})
export class L10nTranslateAsyncPipe extends L10nTranslatePipe implements PipeTransform, OnDestroy {

    protected onChanges: Subscription;

    constructor(protected translation: L10nTranslationService, protected cdr: ChangeDetectorRef) {
        super(translation);

        this.onChanges = this.translation.onChange().subscribe({
            next: () => this.cdr.markForCheck()
        });
    }

    ngOnDestroy() {
        if (this.onChanges) this.onChanges.unsubscribe();
    }

}
