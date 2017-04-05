import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { TranslationService } from '../services/translation.service';
import { BaseDirective } from '../models/base-directive';

@Directive({
    selector: '[translate]'
})
export class TranslateDirective extends BaseDirective {

    @Input('translate') public params: string;

    constructor(public translation: TranslationService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.translationSubscription = this.translation.translationChanged.subscribe(
            () => {
                this.replace();
            }
        );
    }

    protected replace(): void {
        this.translateSubscription = this.translation.translateAsync(this.key, this.params).subscribe(
            (value: string) => {
                this.setText(value);
            }
        );
    }

}
