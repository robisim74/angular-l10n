/* tslint:disable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, OnInit } from '@angular/core';

import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy,
    DefaultLocale,
    Currency
} from '../../src/angular-l10n';

@Component({
    template: `
        <p>{{ value | l10nCurrency:defaultLocale:currency:'symbol':'1.2-2' }}</p>
    `
})
class CurrencyComponent implements OnInit {

    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;

    value: number = 1234.5;

    ngOnInit(): void { }

}

describe('Currency decorator', () => {

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            currency: 'USD',
            storage: StorageStrategy.Disabled
        }
    };

    describe('Basic behavior', () => {

        let comp: CurrencyComponent;
        let fixture: ComponentFixture<CurrencyComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [CurrencyComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(CurrencyComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
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

    });

    describe('Changing currency', () => {

        let comp: CurrencyComponent;
        let fixture: ComponentFixture<CurrencyComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [CurrencyComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(CurrencyComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        beforeEach(() => {
            fixture.detectChanges();
            des = fixture.debugElement.queryAll(By.css("p"));
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }
        });

        it('should render localized number when currency changes', (() => {
            locale.setDefaultLocale('it', 'IT');
            locale.setCurrentCurrency('EUR');

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

});
