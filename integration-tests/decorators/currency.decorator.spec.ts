import { TestBed, ComponentFixture, fakeAsync, async, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import {
    DefaultLocale,
    Currency
} from './../../index';
import {
    LocalizationModule,
    LocaleService
} from './../../index';

describe('Currency decorator', () => {

    let comp: CurrencyComponent;
    let fixture: ComponentFixture<CurrencyComponent>;
    let des: DebugElement[];
    let els: HTMLElement[] = [];

    let locale: LocaleService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [CurrencyComponent],
            imports: [
                LocalizationModule.forRoot()
            ]
        }).createComponent(CurrencyComponent);

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

        des = fixture.debugElement.queryAll(By.css("p"));
        for (let i: number = 0; i < des.length; i++) {
            els.push(des[i].nativeElement);
        }
    });

    it('should render localized currency', (() => {
        expect(els[0].textContent).toContain("$1,234.50");
    }));

    it('should render localized number when currency changes', fakeAsync(() => {
        locale.setDefaultLocale('it', 'IT');
        locale.setCurrentCurrency('EUR');

        tick();
        fixture.detectChanges();

        els = [];
        for (let i: number = 0; i < des.length; i++) {
            els.push(des[i].nativeElement);
        }
        let value: string | null = els[0].textContent;
        if (!!value) {
            value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
        }
        expect(value).toContain("1.234,50 €");
    }));

});

@Component({
    template: `
        <p>{{ value | localeCurrency:defaultLocale:currency:true:'1.2-2' }}</p>
    `
})
class CurrencyComponent {

    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;

    value: number = 1234.5;

}
