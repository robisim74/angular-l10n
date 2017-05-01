import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IntlAPI } from '../services/intl-api';

@Pipe({
    name: 'localeDate',
    pure: true
})
export class LocaleDatePipe implements PipeTransform {

    public transform(value: any, defaultLocale: string, pattern: string = 'mediumDate'): string | null {
        if (IntlAPI.HasDateTimeFormat()) {
            const localeDate: DatePipe = new DatePipe(defaultLocale);
            return localeDate.transform(value, pattern);
        }
        // Returns the date without localization.
        return value;
    }

}
