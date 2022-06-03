import { Directive, Input } from '@angular/core';

import { L10nLocale, L10nNumberFormatOptions } from '../models/types';
import { L10nDirective } from '../models/l10n-directive';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nNumber]'
})
export class L10nNumberDirective extends L10nDirective {

    @Input() set l10nNumber(options: L10nNumberFormatOptions | '') {
        if (options) this.options = options;
    }

    @Input() public options?: L10nNumberFormatOptions;

    @Input() public currency?: string;

    @Input() public convert?: (value: number, locale: L10nLocale, params: any) => number;
    @Input() public convertParams?: any;

    constructor(protected intl: L10nIntlService) {
        super();
    }

    protected getValue(text: string): string {
        return this.intl.formatNumber(text, this.options, this.language, this.currency, this.convert, this.convertParams);
    }

}
