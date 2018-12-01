import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';
import { DateTimeOptions } from '../models/types';

@Directive({
    selector: '[l10nDate]'
})
export class L10nDateDirective extends BaseDirective {

    @Input() set l10nDate(format: string | DateTimeOptions) {
        this.format = format;
    }

    @Input() public format: string | DateTimeOptions;

    private defaultFormat: string = 'mediumDate';

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.locale.defaultLocaleChanged.pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
        this.locale.timezoneChanged.pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
    }

    protected replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    protected replaceText(): void {
        if (!!this.key) {
            this.setText(this.getValues(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValues(keys: string | string[]): string | any {
        return this.locale.formatDate(keys, this.format || this.defaultFormat);
    }

}
