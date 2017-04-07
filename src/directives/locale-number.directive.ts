import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';

import { LocaleService } from '../services/locale.service';
import { IntlAPI } from '../services/intl-api';
import { BaseDirective } from '../models/utils/base-directive';

@Directive({
    selector: '[localeDecimal]'
})
export class LocaleDecimalDirective extends BaseDirective {

    @Input('localeDecimal') public digits: string;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer) {
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
        if (IntlAPI.HasNumberFormat()) {
            let localeDecimal: DecimalPipe = new DecimalPipe(this.locale.getDefaultLocale());
            let value: string = localeDecimal.transform(this.key, this.digits || this.defaultDigits);
            this.setText(value);
        }
    }

}

@Directive({
    selector: '[localePercent]'
})
export class LocalePercentDirective extends BaseDirective {

    @Input('localePercent') public digits: string;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer) {
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
        if (IntlAPI.HasNumberFormat()) {
            let localePercent: PercentPipe = new PercentPipe(this.locale.getDefaultLocale());
            let value: string = localePercent.transform(this.key, this.digits || this.defaultDigits);
            this.setText(value);
        }
    }

}

@Directive({
    selector: '[localeCurrency]'
})
export class LocaleCurrencyDirective extends BaseDirective {

    @Input('localeCurrency') public digits: string;

    @Input() set symbol(symbolDisplay: boolean) {
        this.symbolDisplay = symbolDisplay || this.symbolDisplay;
    }

    private symbolDisplay: boolean = false;

    private defaultDigits: string = null;

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.locale.defaultLocaleChanged.subscribe(
            () => {
                this.replace();
            }
        ));
        this.subscriptions.push(this.locale.currencyCodeChanged.subscribe(
            () => {
                this.replace();
            }
        ));
    }

    protected replace(): void {
        if (IntlAPI.HasNumberFormat()) {
            let localeCurrency: CurrencyPipe = new CurrencyPipe(this.locale.getDefaultLocale());
            let value: string = localeCurrency.transform(
                this.key,
                this.locale.getCurrentCurrency(),
                this.symbolDisplay,
                this.digits || this.defaultDigits
            );
            this.setText(value);
        }
    }

}
