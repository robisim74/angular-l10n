import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { L10nDateTimeFormatOptions } from '../models/types';
import { L10nDirective } from '../models/l10n-directive';
import { L10nTranslationService } from '../services/l10n-translation.service';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nDate]'
})
export class L10nDateDirective extends L10nDirective {

    @Input() set l10nDate(options: L10nDateTimeFormatOptions | '') {
        if (options) this.options = options;
    }

    @Input() public options?: L10nDateTimeFormatOptions;

    @Input() public timezone?: string;

    constructor(
        protected override el: ElementRef,
        protected override renderer: Renderer2,
        protected override translation: L10nTranslationService,
        protected intl: L10nIntlService
    ) {
        super(el, renderer, translation);
    }

    protected getValue(text: string): string {
        return this.intl.formatDate(text, this.options, this.language, this.timezone);
    }

}
