import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';
import { L10nDecimalPipe, L10nPercentPipe, L10nCurrencyPipe } from '../pipes/l10n-number.pipe';

@Directive({
    selector: '[l10nDecimal]'
})
export class L10nDecimalDirective extends BaseDirective {

    @Input() set l10nDecimal(digits: string) {
        this.digits = digits;
    }

    @Input() digits: string;

    private l10nDecimalPipe: L10nDecimalPipe = new L10nDecimalPipe();

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
        return this.l10nDecimalPipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.digits
        );
    }

}

@Directive({
    selector: '[l10nPercent]'
})
export class L10nPercentDirective extends BaseDirective {

    @Input() set l10nPercent(digits: string) {
        this.digits = digits;
    }

    @Input() digits: string;

    private l10nPercentPipe: L10nPercentPipe = new L10nPercentPipe();

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
        return this.l10nPercentPipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.digits
        );
    }

}

@Directive({
    selector: '[l10nCurrency]'
})
export class L10nCurrencyDirective extends BaseDirective {

    @Input() set l10nCurrency(digits: string) {
        this.digits = digits;
    }

    @Input() public currencyDisplay: 'code' | 'symbol' | 'name';

    @Input() digits: string;

    private l10nCurrencyPipe: L10nCurrencyPipe = new L10nCurrencyPipe();

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
        return this.l10nCurrencyPipe.transform(
            keys,
            this.locale.getDefaultLocale(),
            this.locale.getCurrentCurrency(),
            this.currencyDisplay,
            this.digits
        );
    }

}
