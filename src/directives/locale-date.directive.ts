import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DatePipe } from '@angular/common';

import { LocaleService } from '../services/locale.service';
import { IntlAPI } from '../services/intl-api';
import { BaseDirective } from '../models/base-directive';

@Directive({
    selector: '[localeDate]'
})
export class LocaleDateDirective extends BaseDirective {

    @Input('localeDate') public pattern: string;

    private defaultPattern: string = 'mediumDate';

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.defaultLocaleSubscription = this.locale.defaultLocaleChanged.subscribe(
            () => {
                this.replace();
            }
        );
    }

    protected replace(): void {
        if (IntlAPI.HasDateTimeFormat()) {
            let localeDate: DatePipe = new DatePipe(this.locale.getDefaultLocale());
            let value: string = localeDate.transform(this.key, this.pattern || this.defaultPattern);
            this.setText(value);
        }
    }

}
