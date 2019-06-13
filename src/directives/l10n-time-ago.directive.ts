import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';
import { RelativeTimeOptions, Unit } from '../models/types';

@Directive({
    selector: '[l10nTimeAgo]'
})
export class L10nTimeAgoDirective extends BaseDirective {

    @Input() set l10nTimeAgo(format: RelativeTimeOptions) {
        this.format = format;
    }

    @Input() public unit: Unit;

    @Input() public format: RelativeTimeOptions;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.locale.defaultLocaleChanged.pipe(takeUntil(this.destroy)).subscribe(
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
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValue(key: string): string {
        return this.locale.formatRelativeTime(key, this.unit, this.format);
    }

}
