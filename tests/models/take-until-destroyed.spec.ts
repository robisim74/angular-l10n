/* tslint:disable */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, OnInit, OnDestroy } from "@angular/core";

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleService,
    StorageStrategy,
    Language,
    Translation,
} from '../../src/angular-l10n';

@Component({
    template: ``,
})
class MockComponent implements OnInit, OnDestroy {

    @Language() lang: string;

    ngOnInit(): void { }

    ngOnDestroy(): void { }

}

@Component({
    template: ``,
})
class MockExtensionComponent extends Translation { }

describe('takeUntilDestroyed', () => {

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

    describe('Decorators', () => {

        let comp: MockComponent;
        let fixture: ComponentFixture<MockComponent>;

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

        it('should unsubscribe when component is destroyed', fakeAsync(() => {
            locale.setCurrentLanguage('it');

            tick();
            fixture.detectChanges();

            expect(comp.lang).toEqual('it');

            comp.ngOnDestroy();
            locale.setCurrentLanguage('en');

            tick();
            fixture.detectChanges();

            expect(comp.lang).toEqual('it');
        }));

    });

    describe('Extensions', () => {

        let comp: MockExtensionComponent;
        let fixture: ComponentFixture<MockExtensionComponent>;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockExtensionComponent],
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            }).createComponent(MockExtensionComponent);

            comp = fixture.componentInstance;
        });

        beforeEach((done) => {
            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        it('should unsubscribe when component is destroyed', fakeAsync(() => {
            locale.setCurrentLanguage('it');

            tick();
            fixture.detectChanges();

            expect(comp.lang).toEqual('it');

            comp.ngOnDestroy();
            locale.setCurrentLanguage('en');

            tick();
            fixture.detectChanges();

            expect(comp.lang).toEqual('it');
        }));

    });

});
