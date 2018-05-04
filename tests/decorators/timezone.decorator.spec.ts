import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { DefaultLocale, Timezone } from './../../angular-l10n';
import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy
} from './../../angular-l10n';

describe('Timezone decorator', () => {

    describe('Methods', () => {

        let comp: TimezoneComponent;
        let fixture: ComponentFixture<TimezoneComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        const l10nConfig: L10nConfig = {
            locale: {
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                timezone: 'America/Los_Angeles',
                storage: StorageStrategy.Disabled
            }
        };

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [TimezoneComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(TimezoneComponent);

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
            expect(els[0].textContent).toContain("Aug 29, 2017, 2:41:00 PM");
        }));

    });

    describe('Changing timezone', () => {

        let comp: TimezoneComponent;
        let fixture: ComponentFixture<TimezoneComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        const l10nConfig: L10nConfig = {
            locale: {
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                timezone: 'America/Los_Angeles',
                storage: StorageStrategy.Disabled
            }
        };

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [TimezoneComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(TimezoneComponent);

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

        it('should render localized date when timezone changes', fakeAsync(() => {
            locale.setDefaultLocale('it', 'IT');
            locale.setCurrentTimezone('Europe/Rome');

            tick();
            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("29 ago 2017, 23:41:00");
        }));

    });

});

@Component({
    template: `
        <p>{{ day | l10nDate:defaultLocale:'medium':timezone }}</p>
    `
})
class TimezoneComponent {

    @DefaultLocale() defaultLocale: string;
    @Timezone() timezone: string;

    day: Date = new Date(Date.UTC(2017, 7, 29, 21, 41, 0));

}