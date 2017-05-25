import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';
import { LocaleDatePipe } from '../pipes/locale-date.pipe';

@Directive({
    selector: '[l10nDate],[localeDate]'
})
export class LocaleDateDirective extends BaseDirective {

    @Input() set l10nDate(pattern: string) {
        this.pattern = pattern;
    }
    @Input() set localeDate(pattern: string) {
        this.pattern = pattern;
    }

    private pattern: string;
    private defaultPattern: string = 'mediumDate';

    private localeDatePipe: LocaleDatePipe = new LocaleDatePipe();

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.locale.defaultLocaleChanged.subscribe(
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
        this.setAttributes(this.getAttributesData());
    }

    protected getValues(keys: string | string[]): string | any {
        return this.localeDatePipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.pattern || this.defaultPattern
        );
    }

}
