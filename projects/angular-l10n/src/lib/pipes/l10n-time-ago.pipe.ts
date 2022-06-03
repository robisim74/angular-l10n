import { Pipe, PipeTransform } from '@angular/core';

import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nIntlService } from '../services/l10n-intl.service';

@Pipe({
    name: 'l10nTimeAgo',
    pure: true
})
export class L10nTimeAgoPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) { }

    public transform(
        value: any,
        language: string,
        unit: Intl.RelativeTimeFormatUnit,
        options?: Intl.RelativeTimeFormatOptions
    ): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatRelativeTime(value, unit, options, language);
    }

}

@Pipe({
    name: 'l10nTimeAgoAsync',
    pure: false
})
export class L10nTimeAgoAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) {
        super();
    }

    public transform(
        value: any,
        unit: Intl.RelativeTimeFormatUnit,
        options?: Intl.RelativeTimeFormatOptions,
        language?: string
    ): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatRelativeTime(value, unit, options, language);
    }

}
