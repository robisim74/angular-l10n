import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { L10nDirective } from '../models/l10n-directive';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Directive({
    selector: '[l10nTranslate],[translate]'
})
export class L10nTranslateDirective extends L10nDirective {

    @Input() set l10nTranslate(params: any) {
        this.params = params;
    }
    @Input() set translate(params: any) {
        this.params = params;
    }

    @Input() public params: any;

    constructor(protected el: ElementRef, protected renderer: Renderer2, protected translation: L10nTranslationService) {
        super(el, renderer, translation);
    }

    protected getValue(text: string): string {
        return this.translation.translate(text, this.params);
    }

}
