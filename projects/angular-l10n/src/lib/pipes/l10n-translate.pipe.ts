import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Pipe({
    name: 'translate',
    pure: true
})
export class L10nTranslatePipe implements PipeTransform {

    constructor(protected translation: L10nTranslationService) { }

    public transform(key: any, language: string, params?: any): string | null {
        if (key == null || key === '') return null;

        return this.translation.translate(key, params, language);
    }

}

@Pipe({
    name: 'translateAsync',
    pure: false
})
export class L10nTranslateAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(protected override translation: L10nTranslationService, protected override cdr: ChangeDetectorRef) {
        super(translation, cdr);
    }

    public transform(key: any, params?: any, language?: string): string | null {
        if (key == null || key === '') return null;

        return this.translation.translate(key, params, language);
    }

}
