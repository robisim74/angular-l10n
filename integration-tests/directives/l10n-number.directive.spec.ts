import { TestBed, ComponentFixture, fakeAsync, async, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import {
    L10nDecimalDirective,
    L10nPercentDirective,
    L10nCurrencyDirective
} from './../../index';
import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy
} from './../../index';

describe('L10n number directives', () => {

    let comp: L10nNumberComponent;
    let fixture: ComponentFixture<L10nNumberComponent>;
    let decimalDes: DebugElement[];
    let percentDes: DebugElement[];
    let currencyDes: DebugElement[];
    let decimalEls: HTMLElement[] = [];
    let percentEls: HTMLElement[] = [];
    let currencyEls: HTMLElement[] = [];

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            currency: 'USD',
            storage: StorageStrategy.Disabled
        }
    };

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [L10nNumberComponent],
            imports: [
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig)
            ]
        }).createComponent(L10nNumberComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        l10nLoader = TestBed.get(L10nLoader);
        locale = TestBed.get(LocaleService);
        
        l10nLoader.load().then(() => done());
    });

    beforeEach(() => {
        fixture.detectChanges();
        decimalDes = fixture.debugElement.queryAll(By.directive(L10nDecimalDirective));
        for (let i: number = 0; i < decimalDes.length; i++) {
            decimalEls.push(decimalDes[i].nativeElement);
        }
        percentDes = fixture.debugElement.queryAll(By.directive(L10nPercentDirective));
        for (let i: number = 0; i < percentDes.length; i++) {
            percentEls.push(percentDes[i].nativeElement);
        }
        currencyDes = fixture.debugElement.queryAll(By.directive(L10nCurrencyDirective));
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
        expect(currencyEls[0].textContent).not.toContain("USD1,234.50");
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
        percentEls = [];
        for (let i: number = 0; i < percentDes.length; i++) {
            percentEls.push(percentDes[i].nativeElement);
        }
        currencyEls = [];
        for (let i: number = 0; i < currencyDes.length; i++) {
            currencyEls.push(currencyDes[i].nativeElement);
        }

        expect(decimalEls[0].textContent).toContain("3,142");
        expect(decimalEls[1].textContent).toContain("3,14159");
        expect(percentEls[0].textContent).toContain("10%");
        expect(percentEls[1].textContent).toContain("10,0%");
        let value: string | null = currencyEls[0].textContent;
        if (!!value) {
            value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
        }
        expect(value).not.toContain("1.234,50 EUR");
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
        currencyEls = [];
        for (let i: number = 0; i < currencyDes.length; i++) {
            currencyEls.push(currencyDes[i].nativeElement);
        }
        fixture.whenStable().then(() => {
            // By using process.nextTick() we guarantee that it runs after MutationObserver event is fired.
            process.nextTick(() => {
                expect(currencyEls[0].textContent).toContain("$1,234.56");
                expect(currencyEls[1].textContent).toContain("$1,234.560");
            });
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
        <p l10nCurrency>{{ asyncValue }}</p>
        <p [l10nCurrency]="digits" [currencyDisplay]="'symbol'">{{ value }}</p>

        <p><em>should render localized attributes</em></p>
        <p l10n-title title="{{ pi }}" l10nDecimal="1.5-5"></p>
        <p l10n-title title="0.1" l10nPercent="1.1-1"></p>
        <p l10n-title title="{{ value }}" [l10nCurrency]="digits" [currencyDisplay]="'symbol'"></p>
    `
})
class L10nNumberComponent {

    pi: number = 3.14159;
    asyncValue: number;
    value: number = 1234.5;
    digits: string = "1.2-2";

    change() {
        this.asyncValue = 1234.56;
        this.value = 1234.56;
        this.digits = "1.3-3";
    }

}
