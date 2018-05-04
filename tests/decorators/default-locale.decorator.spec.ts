import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { DefaultLocale } from './../../angular-l10n';
import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy
} from './../../angular-l10n';

describe('DefaultLocale decorator', () => {

    describe('Methods', () => {

        let comp: DefaultLocaleComponent;
        let fixture: ComponentFixture<DefaultLocaleComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        const l10nConfig: L10nConfig = {
            locale: {
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Disabled
            }
        };

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

        const l10nConfig: L10nConfig = {
            locale: {
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Disabled
            }
        };

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

        it('should render localized date when default locale changes', fakeAsync(() => {
            locale.setDefaultLocale('it', 'IT');

            tick();
            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("8 mag 2017");
        }));

    });

});

@Component({
    template: `
        <p>{{ day | l10nDate:defaultLocale }}</p>
    `
})
class DefaultLocaleComponent {

    @DefaultLocale() defaultLocale: string;

    day: Date = new Date('5/8/2017');

}
