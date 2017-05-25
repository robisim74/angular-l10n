import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { TranslationService } from '../services/translation.service';
import { BaseDirective } from '../models/base-directive';

@Directive({
    selector: '[l10nTranslate],[translate]'
})
export class TranslateDirective extends BaseDirective {

    @Input() set l10nTranslate(params: string) {
        this.params = params;
    }
    @Input() set translate(params: string) {
        this.params = params;
    }

    private params: string;

    constructor(protected translation: TranslationService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.translation.translationChanged.subscribe(
            () => { this.replace(); }
        ));
    }

    protected replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    protected replaceText(): void {
        this.setText(this.getValues(this.key));
    }

    protected replaceAttributes(): void {
        const keys: string[] = this.getAttributesKeys();
        this.setAttributes(this.getValues(keys));
    }

    protected getValues(keys: string | string[]): string | any {
        return this.translation.translate(keys, this.params);
    }

}
