import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { TranslationService } from '../services/translation.service';
import { BaseDirective } from '../models/utils/base-directive';

@Directive({
    selector: '[translate]'
})
export class TranslateDirective extends BaseDirective {

    @Input('translate') public params: string;

    constructor(public translation: TranslationService, protected el: ElementRef, protected renderer: Renderer) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.translation.translationChanged.subscribe(
            () => {
                this.replace();
            }
        ));
    }

    protected replace(): void {
        this.subscriptions.push(this.translation.translateAsync(this.key, this.params).subscribe(
            (value: string) => {
                this.setText(value);
            }
        ));
    }

}
