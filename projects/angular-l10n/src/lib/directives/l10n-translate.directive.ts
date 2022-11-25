import { Directive, Input } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';

@Directive({
    selector: '[l10nTranslate],[translate]',
    standalone: true
})
export class L10nTranslateDirective extends L10nDirective {

    @Input() set l10nTranslate(params: any | '') {
        if (params) this.params = params;
    }
    @Input() set translate(params: any | '') {
        if (params) this.params = params;
    }

    @Input() public params?: any;

    protected getValue(text: string): string {
        return this.translation.translate(text, this.params, this.language);
    }

}
