import { Directive, Input } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nPlural]',
    standalone: true
})
export class L10nPluralDirective extends L10nDirective {

    @Input() set l10nPlural(options: Intl.PluralRulesOptions | '') {
        if (options) this.options = options;
    }

    @Input() public prefix?: string;

    @Input() public options?: Intl.PluralRulesOptions;

    constructor(protected intl: L10nIntlService) {
        super();
    }

    protected getValue(text: string): string {
        return this.intl.plural(text, this.prefix, this.options, this.language);
    }

}
