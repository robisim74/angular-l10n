/* tslint:disable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleService,
    StorageStrategy,
    Translation
} from '../../src/angular-l10n';

@Component({
    template: `
        <p>{{ 'title' | translate:lang }}</p>
    `
})
class MockComponent extends Translation { }

@Component({
    template: `
        <p>{{ 'title' | translate:lang }}</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
class MockOnPushComponent extends Translation {

    constructor(private cdr: ChangeDetectorRef) {
        super(cdr);
    }

}

describe('Extensions', () => {

    const translationEN: any = {
        "title": "Angular localization"
    };
    const translationIT: any = {
        "title": "Localizzazione in Angular"
    };

    const l10nConfig: L10nConfig = {
        locale: {
            languages: [
                { code: 'en', dir: 'ltr' },
                { code: 'it', dir: 'ltr' }
            ],
            language: 'en',
            storage: StorageStrategy.Disabled
        },
        translation: {
            translationData: [
                { languageCode: 'en', data: translationEN },
                { languageCode: 'it', data: translationIT }
            ]
        }
    };

    describe('Basic behavior', () => {

        let comp: MockComponent;
        let fixture: ComponentFixture<MockComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(MockComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        beforeEach(() => {
            locale.setCurrentLanguage('en');

            fixture.detectChanges();
            des = fixture.debugElement.queryAll(By.css("p"));
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }
        });

        it('should render translated text', (() => {
            expect(els[0].textContent).toContain("Angular localization");
        }));

    });

    describe('Changing language', () => {

        let comp: MockComponent;
        let fixture: ComponentFixture<MockComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(MockComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        beforeEach(() => {
            locale.setCurrentLanguage('en');

            fixture.detectChanges();
            des = fixture.debugElement.queryAll(By.css("p"));
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }
        });

        it('should render translated text when language changes', (() => {
            locale.setCurrentLanguage('it');

            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("Localizzazione in Angular");
        }));

    });

    describe('OnPush change detection strategy', () => {

        let comp: MockOnPushComponent;
        let fixture: ComponentFixture<MockOnPushComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockOnPushComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(MockOnPushComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        beforeEach(() => {
            locale.setCurrentLanguage('en');

            fixture.detectChanges();
            des = fixture.debugElement.queryAll(By.css("p"));
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }
        });

        it('should render translated text when language changes', (() => {
            locale.setCurrentLanguage('it');

            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("Localizzazione in Angular");
        }));

    });

});
