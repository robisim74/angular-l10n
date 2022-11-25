import { Directive, Input } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nDisplayNames]',
    standalone: true
})
export class L10nDisplayNamesDirective extends L10nDirective {

    @Input() set l10nDisplayNames(options: Intl.DisplayNamesOptions | '') {
        if (options) this.options = options;
    }

    @Input() public options!: Intl.DisplayNamesOptions;

    constructor(protected intl: L10nIntlService) {
        super();
    }

    protected getValue(text: string): string {
        return this.intl.displayNames(text, this.options, this.language);
    }

}
