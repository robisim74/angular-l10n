import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { Language } from './../../angular-l10n';
import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleService,
    StorageStrategy,
    ProviderType
} from './../../angular-l10n';

describe('Language decorator', () => {

    let comp: LanguageComponent;
    let fixture: ComponentFixture<LanguageComponent>;
    let des: DebugElement[];
    let els: HTMLElement[] = [];

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

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

@Component({
    template: `
        <p>{{ 'Title' | translate:lang }}</p>
    `
})
class LanguageComponent {

    @Language() lang: string;

}
