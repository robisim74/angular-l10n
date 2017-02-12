import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { DatePipe } from '@angular/common';

import { LocaleService } from '../services/locale.service';
import { IntlAPI } from '../services/intl-api';
import { BaseDirective } from '../models/utils/base-directive';

@Directive({
    selector: '[localeDate]'
})
export class LocaleDateDirective extends BaseDirective {

    @Input('localeDate') public pattern: string;

    private defaultPattern: string = 'mediumDate';

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.locale.defaultLocaleChanged.subscribe(
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
