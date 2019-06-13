import { Pipe, PipeTransform } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { RelativeTimeOptions, Unit } from '../models/types';
import { Logger } from '../models/logger';

@Pipe({
    name: 'l10nTimeAgo',
    pure: true
})
export class L10nTimeAgoPipe implements PipeTransform {

    constructor(protected locale: LocaleService) { }

    public transform(
        value: any,
        defaultLocale: string,
        unit: Unit,
        format?: RelativeTimeOptions
    ): string | null {
        if (value == null || value === "" || value !== value) return null;
        if (typeof defaultLocale === "undefined") Logger.log('L10nTimeAgoPipe', 'missingDefaultLocale');

        return this.locale.formatRelativeTime(value, unit, format, defaultLocale);
    }

}
