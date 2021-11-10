import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { L10nLocale, L10nNumberFormatOptions } from '../models/types';
import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nIntlService } from '../services/l10n-intl.service';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Pipe({
    name: 'l10nNumber',
    pure: true
})
export class L10nNumberPipe implements PipeTransform {

    constructor(protected intl: L10nIntlService) { }

    public transform(
        value: any,
        language: string,
        options?: L10nNumberFormatOptions,
        currency?: string,
        convert?: (value: number, locale: L10nLocale, params: any) => number,
        convertParams?: any
    ): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatNumber(value, options, language, currency, convert, convertParams);
    }

}

@Pipe({
    name: 'l10nNumberAsync',
    pure: false
})
export class L10nNumberAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    constructor(
        protected override translation: L10nTranslationService,
        protected override cdr: ChangeDetectorRef,
        protected intl: L10nIntlService
    ) {
        super(translation, cdr);
    }

    public transform(
        value: any,
        options?: L10nNumberFormatOptions,
        language?: string,
        currency?: string,
        convert?: (value: number, locale: L10nLocale, params: any) => number,
        convertParams?: any
    ): string | null {
        if (value == null || value === '') return null;

        return this.intl.formatNumber(value, options, language, currency, convert, convertParams);
    }

}
