/* tslint:disable */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleService,
    StorageStrategy,
    Language
} from '../../src/angular-l10n';

@Component({
    template: `
        <p>{{ 'Title' | translate:lang }}</p>
    `
})
class LanguageComponent implements OnInit {

    @Language() lang: string;

    ngOnInit(): void { }

}

@Component({
    template: `
        <p>{{ 'Title' | translate:lang }}</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
class LanguageOnPushComponent implements OnInit {

    @Language() lang: string;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void { }

}

describe('Language decorator', () => {

    const translationEN: any = {
        "Title": "Angular localization"
    };
    const translationIT: any = {
        "Title": "Localizzazione in Angular"
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

    describe('Methods', () => {

        let comp: LanguageComponent;
        let fixture: ComponentFixture<LanguageComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [LanguageComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(LanguageComponent);

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

        let comp: LanguageComponent;
        let fixture: ComponentFixture<LanguageComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [LanguageComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(LanguageComponent);

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

        it('should render translated text when language changes', fakeAsync(() => {
            locale.setCurrentLanguage('it');

            tick();
            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("Localizzazione in Angular");
        }));

    });

    describe('OnPush change detection strategy', () => {

        let comp: LanguageOnPushComponent;
        let fixture: ComponentFixture<LanguageOnPushComponent>;
        let des: DebugElement[];
        let els: HTMLElement[] = [];

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [LanguageOnPushComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(LanguageOnPushComponent);

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

        it('should render translated text when language changes', fakeAsync(() => {
            locale.setCurrentLanguage('it');

            tick();
            fixture.detectChanges();
            els = [];
            for (let i: number = 0; i < des.length; i++) {
                els.push(des[i].nativeElement);
            }

            expect(els[0].textContent).toContain("Localizzazione in Angular");
        }));

    });

});
