import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { Unit } from '../models/types';
import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nIntlService } from '../services/l10n-intl.service';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Pipe({
    name: 'l10nTimeAgo',
    pure: true
})
export class L10nTimeAgoPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) { }

    public transform(value: any, language: string, unit: Unit, options?: any): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatRelativeTime(value, unit, options, language);
    }

}

@Pipe({
    name: 'l10nTimeAgoAsync',
    pure: false
})
export class L10nTimeAgoAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(
        protected override translation: L10nTranslationService,
        protected override cdr: ChangeDetectorRef,
        protected intl: L10nIntlService
    ) {
        super(translation, cdr);
    }

    public transform(value: any, unit: Unit, options?: any, language?: string): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatRelativeTime(value, unit, options, language);
    }

}
