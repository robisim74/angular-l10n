import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';
import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from '../pipes/locale-number.pipe';

@Directive({
    selector: '[l10nDecimal],[localeDecimal]'
})
export class LocaleDecimalDirective extends BaseDirective {

    @Input() set l10nDecimal(digits: string) {
        this.digits = digits;
    }
    @Input() set localeDecimal(digits: string) {
        this.digits = digits;
    }

    private digits: string;

    private localeDecimalPipe: LocaleDecimalPipe = new LocaleDecimalPipe();

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.locale.defaultLocaleChanged.subscribe(
            () => { this.replace(); }
        ));
    }

    protected replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    protected replaceText(): void {
        if (!!this.key) {
            this.setText(this.getValues(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValues(keys: string | string[]): string | any {
        return this.localeDecimalPipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.digits
        );
    }

}

@Directive({
    selector: '[l10nPercent],[localePercent]'
})
export class LocalePercentDirective extends BaseDirective {

    @Input() set l10nPercent(digits: string) {
        this.digits = digits;
    }
    @Input() set localePercent(digits: string) {
        this.digits = digits;
    }

    private digits: string;

    private localePercentPipe: LocalePercentPipe = new LocalePercentPipe();

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.locale.defaultLocaleChanged.subscribe(
            () => { this.replace(); }
        ));
    }

    protected replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    protected replaceText(): void {
        if (!!this.key) {
            this.setText(this.getValues(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValues(keys: string | string[]): string | any {
        return this.localePercentPipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.digits
        );
    }

}

@Directive({
    selector: '[l10nCurrency],[localeCurrency]'
})
export class LocaleCurrencyDirective extends BaseDirective {

    @Input() set l10nCurrency(digits: string) {
        this.digits = digits;
    }
    @Input() set localeCurrency(digits: string) {
        this.digits = digits;
    }

    @Input() public symbol: boolean;

    private digits: string;

    private localeCurrencyPipe: LocaleCurrencyPipe = new LocaleCurrencyPipe();

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.subscriptions.push(this.locale.defaultLocaleChanged.subscribe(
            () => { this.replace(); }
        ));
        this.subscriptions.push(this.locale.currencyCodeChanged.subscribe(
            () => { this.replace(); }
        ));
    }

    protected replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    protected replaceText(): void {
        if (!!this.key) {
            this.setText(this.getValues(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValues(keys: string | string[]): string | any {
        return this.localeCurrencyPipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.locale.getCurrentCurrency(),
            this.symbol,
            this.digits
        );
    }

}
