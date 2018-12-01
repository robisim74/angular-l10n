import { Pipe, PipeTransform } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { DateTimeOptions } from '../models/types';

@Pipe({
    name: 'l10nDate',
    pure: true
})
export class L10nDatePipe implements PipeTransform {

    constructor(protected locale: LocaleService) { }

    public transform(
        value: any,
        defaultLocale: string,
        format: string | DateTimeOptions = 'mediumDate',
        timezone?: string
    ): string | null {
        if (value == null || value === "" || value !== value) return null;

        return this.locale.formatDate(value, format, defaultLocale, timezone);
    }

}
