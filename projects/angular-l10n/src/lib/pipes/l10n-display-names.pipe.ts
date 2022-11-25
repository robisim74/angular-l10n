import { Pipe, PipeTransform } from '@angular/core';

import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nIntlService } from '../services/l10n-intl.service';

@Pipe({
    name: 'l10nDisplayNames',
    pure: true,
    standalone: true
})
export class L10nDisplayNamesPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) { }

    public transform(value: any, language: string, options: Intl.DisplayNamesOptions): string | null {
        if (value == null || value === '') return null;

        return this.intl.displayNames(value, options, language);
    }

}

@Pipe({
    name: 'l10nDisplayNamesAsync',
    pure: false,
    standalone: true
})
export class L10nDisplayNamesAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) {
        super();
    }

    public transform(value: any, options: Intl.DisplayNamesOptions, language?: string): string | null {
        if (value == null || value === '') return null;

        return this.intl.displayNames(value, options, language);
    }

}
