/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';

// Services.
import { LocaleDirective } from '../services/i18n';
import { LocaleService } from '../services/locale.service';
import { IntlSupport } from '../services/Intl-support';

@Directive({
    selector: '[localeDecimal]'
})

/**
 * LocaleDecimalDirective class.
 * Localizes decimal numbers by an attribute directive.
 * 
 * @author Roberto Simonetti
 */
export class LocaleDecimalDirective extends LocaleDirective {

    @Input('localeDecimal') digits: string;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    localize(renderNode: any, nodeValue: string, value: string): void {

        let defaultLocale: string = this.locale.getDefaultLocale();

        // Checks for support for Intl.
        if (IntlSupport.NumberFormat(defaultLocale) == true) {

            let localeDecimal: DecimalPipe = new DecimalPipe(defaultLocale);

            this.renderer.setText(renderNode, nodeValue.replace(value, localeDecimal.transform(value, this.digits || this.defaultDigits)));

        }

    }

}

@Directive({
    selector: '[localePercent]'
})

/**
 * LocalePercentDirective class.
 * Localizes percent numbers by an attribute directive.
 * 
 * @author Roberto Simonetti
 */
export class LocalePercentDirective extends LocaleDirective {

    @Input('localePercent') digits: string;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    localize(renderNode: any, nodeValue: string, value: string): void {

        let defaultLocale: string = this.locale.getDefaultLocale();

        // Checks for support for Intl.
        if (IntlSupport.NumberFormat(defaultLocale) == true) {

            let localePercent: PercentPipe = new PercentPipe(defaultLocale);

            this.renderer.setText(renderNode, nodeValue.replace(value, localePercent.transform(value, this.digits || this.defaultDigits)));

        }

    }

}

@Directive({
    selector: '[localeCurrency]'
})

/**
 * LocaleCurrencyDirective class.
 * Localizes currencies by an attribute directive.
 * 
 * @author Roberto Simonetti
 */
export class LocaleCurrencyDirective extends LocaleDirective {

    @Input('localeCurrency') digits: string;

    @Input() set symbol(symbolDisplay: boolean) {
        this.symbolDisplay = symbolDisplay || this.symbolDisplay;
    }

    private symbolDisplay: boolean = false;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    localize(renderNode: any, nodeValue: string, value: string): void {

        let defaultLocale: string = this.locale.getDefaultLocale();
        let currency: string = this.locale.getCurrentCurrency();

        // Checks for support for Intl.
        if (IntlSupport.NumberFormat(defaultLocale) == true) {

            let localeCurrency: CurrencyPipe = new CurrencyPipe(defaultLocale);

            this.renderer.setText(renderNode, nodeValue.replace(value, localeCurrency.transform(value, currency, this.symbolDisplay, this.digits || this.defaultDigits)));

        }

    }

}
