import { TestBed, ComponentFixture, fakeAsync, async, tick } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { Language } from './../../index';
import {
    TranslationModule,
    LocaleService,
    TranslationService
} from './../../index';

describe('Language decorator', () => {

    let comp: LanguageComponent;
    let fixture: ComponentFixture<LanguageComponent>;
    let des: DebugElement[];
    let els: HTMLElement[] = [];

    let locale: LocaleService;
    let translation: TranslationService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [LanguageComponent],
            imports: [
                HttpModule,
                TranslationModule.forRoot()
            ]
        }).createComponent(LanguageComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        locale = TestBed.get(LocaleService);
        translation = TestBed.get(TranslationService);

        locale.addConfiguration()
            .disableStorage()
            .addLanguages(['en', 'it'])
            .defineLanguage('en');

        const translationEN: any = {
            "Title": "Angular localization"
        };
        const translationIT: any = {
            "Title": "Localizzazione in Angular"
        };

        translation.addConfiguration()
            .addTranslation('en', translationEN)
            .addTranslation('it', translationIT);

        translation.init().then(() => done());
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
