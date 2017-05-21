import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';

import { LocaleService } from '../services/locale.service';
import { IntlAPI } from '../services/intl-api';
import { BaseDirective } from '../models/base-directive';

@Directive({
    selector: '[localeDecimal]'
})
export class LocaleDecimalDirective extends BaseDirective {

    @Input('localeDecimal') public digits: string;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
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
        if (IntlAPI.hasNumberFormat()) {
            const localeDecimal: DecimalPipe = new DecimalPipe(this.locale.getDefaultLocale());
            const value: string | null = localeDecimal.transform(this.key, this.digits);
            this.setText(value);
        }
    }

}

@Directive({
    selector: '[localePercent]'
})
export class LocalePercentDirective extends BaseDirective {

    @Input('localePercent') public digits: string;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
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
        if (IntlAPI.hasNumberFormat()) {
            const localePercent: PercentPipe = new PercentPipe(this.locale.getDefaultLocale());
            const value: string | null = localePercent.transform(this.key, this.digits);
            this.setText(value);
        }
    }

}

@Directive({
    selector: '[localeCurrency]'
})
export class LocaleCurrencyDirective extends BaseDirective {

    @Input('localeCurrency') public digits: string;

    @Input() public symbol: boolean;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
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
        if (IntlAPI.hasNumberFormat()) {
            const localeCurrency: CurrencyPipe = new CurrencyPipe(this.locale.getDefaultLocale());
            const value: string | null = localeCurrency.transform(
                this.key,
                this.locale.getCurrentCurrency(),
                this.symbol,
                this.digits
            );
            this.setText(value);
        }
    }

}
