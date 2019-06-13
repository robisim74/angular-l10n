/* tslint:disable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import {
    L10nTimeAgoDirective,
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocalizationExtraModule,
    LocaleService,
    StorageStrategy
} from '../../src/angular-l10n';

@Component({
    template: `
        <p><em>should render localized relative time</em></p>
        <p unit="day" l10nTimeAgo>-1</p>
        <p [format]="{ numeric: 'auto', style: 'long' }" unit="day" l10nTimeAgo>-1</p>
    `
})
class L10nTimeAgoComponent { }

describe('L10nTimeAgoDirective', () => {

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            storage: StorageStrategy.Disabled
        }
    };

    describe('Basic behavior', () => {

        let comp: L10nTimeAgoComponent;
        let fixture: ComponentFixture<L10nTimeAgoComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [L10nTimeAgoComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig),
                    LocalizationExtraModule
                ]
            }).createComponent(L10nTimeAgoComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        beforeEach(() => {
            fixture.detectChanges();
            des = fixture.debugElement.queryAll(By.directive(L10nTimeAgoDirective));
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }
        });

        it('should render localized relative time', () => {
            expect(els[0].textContent).toContain("1 day ago");
            expect(els[1].textContent).toContain("yesterday");
        });

    });

    describe('Changing default locale', () => {

        let comp: L10nTimeAgoComponent;
        let fixture: ComponentFixture<L10nTimeAgoComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [L10nTimeAgoComponent],
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig),
                    LocalizationExtraModule
                ]
            }).createComponent(L10nTimeAgoComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        beforeEach(() => {
            fixture.detectChanges();
            des = fixture.debugElement.queryAll(By.directive(L10nTimeAgoDirective));
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }
        });

        it('should render localized relative time when default locale changes', () => {
            locale.setDefaultLocale('it', 'IT');

            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("1 giorno fa");
            expect(els[1].textContent).toContain("ieri");
        });

    });

});
