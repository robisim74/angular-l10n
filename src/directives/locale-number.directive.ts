import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';

import { LocaleDirective } from '../models/localization/locale-directive';
import { LocaleService } from '../services/locale.service';
import { IntlAPI } from '../services/intl-api';

@Directive({
    selector: '[localeDecimal]'
})
export class LocaleDecimalDirective extends LocaleDirective {

    @Input('localeDecimal') public digits: string;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    protected replace(): void {
        if (IntlAPI.HasNumberFormat()) {
            let localeDecimal: DecimalPipe = new DecimalPipe(this.locale.getDefaultLocale());
            this.renderer.setText(
                this.renderNode,
                this.nodeValue.replace(
                    this.value,
                    localeDecimal.transform(this.value, this.digits || this.defaultDigits)
                )
            );
        }
    }

}

@Directive({
    selector: '[localePercent]'
})
export class LocalePercentDirective extends LocaleDirective {

    @Input('localePercent') public digits: string;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    protected replace(): void {
        if (IntlAPI.HasNumberFormat()) {
            let localePercent: PercentPipe = new PercentPipe(this.locale.getDefaultLocale());
            this.renderer.setText(
                this.renderNode,
                this.nodeValue.replace(
                    this.value,
                    localePercent.transform(this.value, this.digits || this.defaultDigits)
                )
            );
        }
    }

}

@Directive({
    selector: '[localeCurrency]'
})
export class LocaleCurrencyDirective extends LocaleDirective {

    @Input('localeCurrency') public digits: string;

    @Input() set symbol(symbolDisplay: boolean) {
        this.symbolDisplay = symbolDisplay || this.symbolDisplay;
    }

    private symbolDisplay: boolean = false;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, el: ElementRef, renderer: Renderer) {
        super(locale, el, renderer);
    }

    protected replace(): void {
        if (IntlAPI.HasNumberFormat()) {
            let localeCurrency: CurrencyPipe = new CurrencyPipe(this.locale.getDefaultLocale());
            this.renderer.setText(
                this.renderNode,
                this.nodeValue.replace(
                    this.value,
                    localeCurrency.transform(
                        this.value,
                        this.locale.getCurrentCurrency(),
                        this.symbolDisplay,
                        this.digits || this.defaultDigits
                    )
                )
            );
        }
    }

}
