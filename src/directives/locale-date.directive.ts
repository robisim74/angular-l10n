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
        this.subscriptions.push(this.locale.defaultLocaleChanged.subscribe(
            () => {
                this.replace();
            }
        ));
    }

    protected replace(): void {
        if (IntlAPI.hasDateTimeFormat()) {
            const localeDate: DatePipe = new DatePipe(this.locale.getDefaultLocale());
            const value: string | null = localeDate.transform(this.key, this.pattern || this.defaultPattern);
            this.setText(value);
        }
    }

}
