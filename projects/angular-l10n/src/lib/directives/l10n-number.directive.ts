import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';
import { L10nTranslationService } from '../services/l10n-translation.service';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nNumber]'
})
export class L10nNumberDirective extends L10nDirective {

    @Input() set l10nNumber(options: any) {
        this.options = options;
    }

    @Input() public options: any;

    @Input() public currency: string;

    constructor(
        protected el: ElementRef,
        protected renderer: Renderer2,
        protected translation: L10nTranslationService,
        protected intl: L10nIntlService
    ) {
        super(el, renderer, translation);
    }

    protected getValue(text: string): string {
        return this.intl.formatNumber(text, this.options, this.language, this.currency);
    }

}
