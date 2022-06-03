import { Directive, Input } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nTimeAgo]'
})
export class L10nTimeAgoDirective extends L10nDirective {

    @Input() set l10nTimeAgo(options: Intl.RelativeTimeFormatOptions | '') {
        if (options) this.options = options;
    }

    @Input() public unit!: Intl.RelativeTimeFormatUnit;

    @Input() public options?: Intl.RelativeTimeFormatOptions;

    constructor(protected intl: L10nIntlService) {
        super();
    }

    protected getValue(text: string): string {
        return this.intl.formatRelativeTime(text, this.unit, this.options, this.language);
    }

}
