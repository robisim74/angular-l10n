import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';

@Directive({
    selector: '[l10nDecimal]'
})
export class L10nDecimalDirective extends BaseDirective {

    @Input() set l10nDecimal(digits: string) {
        this.digits = digits;
    }

    @Input() public digits: string;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.locale.defaultLocaleChanged.pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
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
        return this.locale.formatDecimal(keys, this.locale.getDefaultLocale(), this.digits);
    }

}

@Directive({
    selector: '[l10nPercent]'
})
export class L10nPercentDirective extends BaseDirective {

    @Input() set l10nPercent(digits: string) {
        this.digits = digits;
    }

    @Input() public digits: string;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.locale.defaultLocaleChanged.pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
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
        return this.locale.formatPercent(keys, this.locale.getDefaultLocale(), this.digits);
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

    @Input() public digits: string;

    constructor(protected locale: LocaleService, protected el: ElementRef, protected renderer: Renderer2) {
        super(el, renderer);
    }

    protected setup(): void {
        this.replace();
        this.locale.defaultLocaleChanged.pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
        this.locale.currencyCodeChanged.pipe(takeUntil(this.destroy)).subscribe(
            () => { this.replace(); }
        );
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
        return this.locale.formatCurrency(
            keys,
            this.locale.getDefaultLocale(),
            this.locale.getCurrentCurrency(),
            this.currencyDisplay,
            this.digits
        );
    }

}
