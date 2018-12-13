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
    DefaultLocale
} from '../../src/angular-l10n';

@Component({
    template: `
        <p>{{ day | l10nDate:defaultLocale }}</p>
    `
})
class DefaultLocaleComponent implements OnInit {

    @DefaultLocale() defaultLocale: string;

    day: Date = new Date('2017-05-08');

    ngOnInit(): void { }

}

describe('DefaultLocale decorator', () => {

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            storage: StorageStrategy.Disabled
        }
    };

    describe('Basic behavior', () => {

        let comp: DefaultLocaleComponent;
        let fixture: ComponentFixture<DefaultLocaleComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [DefaultLocaleComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(DefaultLocaleComponent);

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

        it('should render localized date', (() => {
            expect(els[0].textContent).toContain("May 8, 2017");
        }));

    });

    describe('Changing default locale', () => {

        let comp: DefaultLocaleComponent;
        let fixture: ComponentFixture<DefaultLocaleComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [DefaultLocaleComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(DefaultLocaleComponent);

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

        it('should render localized date when default locale changes', (() => {
            locale.setDefaultLocale('it', 'IT');

            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("8 mag 2017");
        }));

    });

});
