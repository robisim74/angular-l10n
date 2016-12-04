/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { DatePipe } from '@angular/common';

// Services.
import { LocaleDirective } from '../services/i18n';
import { LocaleService } from '../services/locale.service';
import { IntlSupport } from '../services/Intl-support';

@Directive({
    selector: '[localeDate]'
})

/**
 * LocaleDateDirective class.
 * Localizes dates by an attribute directive.
 * 
 * @author Roberto Simonetti
 */
export class LocaleDateDirective extends LocaleDirective {

    @Input('localeDate') pattern: string;

    private defaultPattern: string = 'mediumDate';

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
     }

    localize(renderNode: any, value: string): void {

        let defaultLocale: string = this.locale.getDefaultLocale();

        // Checks for support for Intl.
        if (IntlSupport.DateTimeFormat(defaultLocale) == true) {

            let localeDate: DatePipe = new DatePipe(defaultLocale);

            this.renderer.setText(renderNode, localeDate.transform(value, this.pattern || this.defaultPattern));

        }

    }

}
