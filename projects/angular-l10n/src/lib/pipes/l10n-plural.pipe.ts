import { Pipe, PipeTransform } from '@angular/core';

import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nIntlService } from '../services/l10n-intl.service';

@Pipe({
    name: 'l10nPlural',
    pure: true
})
export class L10nPluralPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) { }

    public transform(value: any, language: string, prefix?: string, options?: Intl.PluralRulesOptions): string | null {
        if (value == null || value === '') return null;

        return this.intl.plural(value, prefix, options, language);
    }

}

@Pipe({
    name: 'l10nPluralAsync',
    pure: false
})
export class L10nPluralAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) {
        super();
    }

    public transform(value: any, prefix?: string, options?: Intl.PluralRulesOptions, language?: string): string | null {
        if (value == null || value === '') return null;

        return this.intl.plural(value, prefix, options, language);
    }

}
