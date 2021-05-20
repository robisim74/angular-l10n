import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { Unit } from '../models/types';
import { L10nDirective } from '../models/l10n-directive';
import { L10nTranslationService } from '../services/l10n-translation.service';
import { L10nIntlService } from '../services/l10n-intl.service';

@Directive({
    selector: '[l10nTimeAgo]'
})
export class L10nTimeAgoDirective extends L10nDirective {

    @Input() set l10nTimeAgo(options: any) {
        this.options = options;
    }

    @Input() public unit: any;

    @Input() public options: any;

    constructor(
        protected el: ElementRef,
        protected renderer: Renderer2,
        protected translation: L10nTranslationService,
        protected intl: L10nIntlService
    ) {
        super(el, renderer, translation);
    }

    protected getValue(text: string): string {
        return this.intl.formatRelativeTime(text, this.unit, this.options, this.language);
    }

}
