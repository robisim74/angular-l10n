import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { DatePipe } from '@angular/common';

import { LocaleDirective } from '../models/localization/locale-directive';
import { LocaleService } from '../services/locale.service';
import { IntlAPI } from '../services/intl-api';

@Directive({
    selector: '[localeDate]'
})
export class LocaleDateDirective extends LocaleDirective {

    @Input('localeDate') public pattern: string;

    private defaultPattern: string = 'mediumDate';

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    protected replace(): void {
        if (IntlAPI.HasDateTimeFormat()) {
            let localeDate: DatePipe = new DatePipe(this.locale.getDefaultLocale());
            this.renderer.setText(
                this.renderNode,
                this.nodeValue.replace(
                    this.value,
                    localeDate.transform(this.value, this.pattern || this.defaultPattern)
                )
            );
        }
    }

}
