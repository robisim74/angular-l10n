import { TestBed, ComponentFixture, fakeAsync, async, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import {
    LocaleDecimalDirective,
    LocalePercentDirective,
    LocaleCurrencyDirective
} from './../../index';
import {
    LocalizationModule,
    LocaleService
} from './../../index';

describe('Locale number directives', () => {

    let comp: LocaleNumberComponent;
    let fixture: ComponentFixture<LocaleNumberComponent>;
    let decimalDes: DebugElement[];
    let percentDes: DebugElement[];
    let currencyDes: DebugElement[];
    let decimalEls: HTMLElement[] = [];
    let percentEls: HTMLElement[] = [];
    let currencyEls: HTMLElement[] = [];

    let locale: LocaleService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [LocaleNumberComponent],
            imports: [
                LocalizationModule.forRoot()
            ]
        }).createComponent(LocaleNumberComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        locale = TestBed.get(LocaleService);

        locale.addConfiguration()
            .disableStorage()
            .defineDefaultLocale('en', 'US')
            .defineCurrency('USD');
        locale.init().then(() => done());
    });

    beforeEach(() => {
        fixture.detectChanges();

        decimalDes = fixture.debugElement.queryAll(By.directive(LocaleDecimalDirective));
        for (let i: number = 0; i < decimalDes.length; i++) {
            decimalEls.push(decimalDes[i].nativeElement);
        }
        percentDes = fixture.debugElement.queryAll(By.directive(LocalePercentDirective));
        for (let i: number = 0; i < percentDes.length; i++) {
            percentEls.push(percentDes[i].nativeElement);
        }
        currencyDes = fixture.debugElement.queryAll(By.directive(LocaleCurrencyDirective));
        for (let i: number = 0; i < currencyDes.length; i++) {
            currencyEls.push(currencyDes[i].nativeElement);
        }
    });

    it('should render localized decimal number', (() => {
        expect(decimalEls[0].textContent).toContain("3.142");
        expect(decimalEls[1].textContent).toContain("3.14159");
    }));

    it('should render localized percent number', (() => {
        expect(percentEls[0].textContent).toContain("10%");
        expect(percentEls[1].textContent).toContain("10.0%");
    }));

    it('should render localized currency', (() => {
        expect(currencyEls[0].textContent).toContain("USD1,234.50");
        expect(currencyEls[1].textContent).toContain("$1,234.50");
    }));

    it('should render localized attributes', (() => {
        expect(decimalEls[2].getAttribute('title')).toContain("3.14159");
        expect(percentEls[2].getAttribute('title')).toContain("10.0%");
        expect(currencyEls[2].getAttribute('title')).toContain("$1,234.50");
    }));

    it('should render localized numbers when default locale changes', fakeAsync(() => {
        locale.setDefaultLocale('it', 'IT');
        locale.setCurrentCurrency('EUR');

        tick();
        fixture.detectChanges();

        decimalEls = [];
        for (let i: number = 0; i < decimalDes.length; i++) {
            decimalEls.push(decimalDes[i].nativeElement);
        }
        expect(decimalEls[0].textContent).toContain("3,142");
        expect(decimalEls[1].textContent).toContain("3,14159");

        percentEls = [];
        for (let i: number = 0; i < percentDes.length; i++) {
            percentEls.push(percentDes[i].nativeElement);
        }
        expect(percentEls[0].textContent).toContain("10%");
        expect(percentEls[1].textContent).toContain("10,0%");

        currencyEls = [];
        for (let i: number = 0; i < currencyDes.length; i++) {
            currencyEls.push(currencyDes[i].nativeElement);
        }
        let value: string | null = currencyEls[0].textContent;
        if (!!value) {
            value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
        }
        expect(value).toContain("1.234,50 EUR");
        value = currencyEls[1].textContent;
        if (!!value) {
            value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
        }
        expect(value).toContain("1.234,50 €");

        expect(decimalEls[2].getAttribute('title')).toContain("3,14159");
        expect(percentEls[2].getAttribute('title')).toContain("10,0%");
        value = currencyEls[2].getAttribute('title');
        if (!!value) {
            value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
        }
        expect(value).toContain("1.234,50 €");
    }));

    it('should change values & params dynamically', async(() => {
        comp.change();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // Waits for Mutation Observer in the directive is fired.
            setTimeout(() => {
                fixture.detectChanges();

                currencyEls = [];
                for (let i: number = 0; i < currencyDes.length; i++) {
                    currencyEls.push(currencyDes[i].nativeElement);
                }
                expect(currencyEls[0].textContent).toContain("USD1,234.56");
                expect(currencyEls[1].textContent).toContain("$1,234.560");
            }, 1000);
        });
    }));

});

@Component({
    template: `
        <p><em>should render localized decimal number</em></p>
        <p l10nDecimal>{{ pi }}</p>
        <p l10nDecimal="1.5-5">{{ pi }}</p>

        <p><em>should render localized percent number</em></p>
        <p l10nPercent>0.1</p>
        <p l10nPercent="1.1-1">0.1</p>

        <p><em>should render localized currency</em></p>
        <p l10nCurrency>{{ value }}</p>
        <p [l10nCurrency]="digits" [symbol]="true">{{ value }}</p>

        <p><em>should render localized attributes/p>
        <p l10n-title title="{{ pi }}" l10nDecimal="1.5-5"></p>
        <p l10n-title title="0.1" l10nPercent="1.1-1"></p>
        <p l10n-title title="{{ value }}" [l10nCurrency]="digits" [symbol]="true"></p>
    `
})
class LocaleNumberComponent {

    pi: number = 3.14159;
    value: number = 1234.5;
    digits: string = "1.2-2";

    change() {
        this.value = 1234.56;
        this.digits = "1.3-3";
    }

}
