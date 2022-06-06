import { Directive, Input } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nDisplayNames]'
})
export class L10nDisplayNamesDirective extends L10nDirective {

    @Input() set l10nDisplayNames(options: any | '') {
        if (options) this.options = options;
    }

    @Input() public options?: any;

    constructor(protected intl: L10nIntlService) {
        super();
    }

    protected getValue(text: string): string {
        return this.intl.displayNames(text, this.options, this.language);
    }

}
