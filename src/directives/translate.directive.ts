import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { TranslationService } from '../services/translation.service';
import { BaseDirective } from '../models/base-directive';

@Directive({
    selector: '[l10nTranslate],[translate]'
})
export class TranslateDirective extends BaseDirective {

    @Input() set l10nTranslate(params: any) {
        this.params = params;
    }
    @Input() set translate(params: any) {
        this.params = params;
    }

    @Input() public params: any;

    constructor(protected translation: TranslationService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.translation.translationChanged().pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
    }

    protected replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    protected replaceText(): void {
        if (!!this.key) {
            this.setText(this.getValue(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            const keys: string[] = this.getAttributesKeys();
            const data: any = this.translation.translate(keys, this.params);
            this.setAttributes(data);
        }
    }

    protected getValue(key: string): string {
        return this.translation.translate(key, this.params);
    }

}
