import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { LocaleService } from '../services/locale.service';
import { BaseDirective } from '../models/base-directive';
import { DigitsOptions } from '../models/types';

@Directive({
    selector: '[l10nDecimal]'
})
export class L10nDecimalDirective extends BaseDirective {

    @Input() set l10nDecimal(digits: string | DigitsOptions) {
        this.digits = digits;
    }

    @Input() public digits: string | DigitsOptions;

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
            this.setText(this.getValue(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValue(key: string): string {
        return this.locale.formatDecimal(key, this.digits);
    }

}

@Directive({
    selector: '[l10nPercent]'
})
export class L10nPercentDirective extends BaseDirective {

    @Input() set l10nPercent(digits: string | DigitsOptions) {
        this.digits = digits;
    }

    @Input() public digits: string | DigitsOptions;

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
            this.setText(this.getValue(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValue(key: string): string {
        return this.locale.formatPercent(key, this.digits);
    }

}

@Directive({
    selector: '[l10nCurrency]'
})
export class L10nCurrencyDirective extends BaseDirective {

    @Input() set l10nCurrency(digits: string | DigitsOptions) {
        this.digits = digits;
    }

    @Input() public currencyDisplay: 'code' | 'symbol' | 'name';

    @Input() public digits: string | DigitsOptions;

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
            this.setText(this.getValue(this.key));
        }
    }

    protected replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
        }
    }

    protected getValue(key: string): string {
        return this.locale.formatCurrency(key, this.digits, this.currencyDisplay);
    }

}
