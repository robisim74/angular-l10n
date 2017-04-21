import { TestBed, ComponentFixture, fakeAsync, async, tick } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { TranslateDirective } from './../../index';
import {
    TranslationModule,
    LocaleService,
    TranslationService
} from './../../index';

describe('TranslateDirective', () => {

    let comp: TranslateComponent;
    let fixture: ComponentFixture<TranslateComponent>;
    let des: DebugElement[];
    let els: HTMLElement[] = [];

    let locale: LocaleService;
    let translation: TranslationService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [TranslateComponent],
            imports: [
                HttpModule,
                TranslationModule.forRoot()
            ]
        }).createComponent(TranslateComponent);

        comp = fixture.componentInstance;

        locale = TestBed.get(LocaleService);
        translation = TestBed.get(TranslationService);

        locale.addConfiguration()
            .disableStorage()
            .addLanguages(['en', 'it'])
            .defineLanguage('en');
        locale.init();

        const translationEN = {
            "Title": "Angular localization",
            "Subtitle": "It's a small world",
            "User notifications": "{{ user }}, you have {{ NoMessages }} new messages",
            "Insert": "Insert",
            "Select": "Select",
            "Strong title": "<strong>Angular localization</strong>",
            "Strong subtitle": "<strong>It's a small world</strong>"
        }
        const translationIT = {
            "Title": "Localizzazione in Angular",
            "Subtitle": "Il mondo è piccolo",
            "User notifications": "{{ user }}, tu hai {{ NoMessages }} nuovi messaggi",
            "Insert": "Inserisci",
            "Select": "Seleziona",
            "Strong title": "<strong>Localizzazione in Angular</strong>",
            "Strong subtitle": "<strong>Il mondo è piccolo</strong>"
        }

        translation.addConfiguration()
            .addTranslation('en', translationEN)
            .addTranslation('it', translationIT);
        translation.init();

        locale.setCurrentLanguage('en');

        fixture.detectChanges();

        des = fixture.debugElement.queryAll(By.directive(TranslateDirective));
        for (let i = 0; i < des.length; i++) {
            els.push(des[i].nativeElement);
        }
    });

    it('should render translated text & trim spaces', (() => {
        expect(els[0].textContent).toContain("Angular localization");
    }));

    it('should render translated text using parameters', (() => {
        expect(els[1].textContent).toContain("robisim74, you have 2 new messages");
    }));

    it('should search the key', (() => {
        expect(els[2].textContent).toContain("It's a small world");
        expect(els[3].textContent).toContain("Angular localization");
        expect(els[4].textContent).toContain("It's a small world");
        expect(els[5].textContent).toContain("Angular localization");
        expect(els[6].textContent).toContain("Angular localization");
    }));

    it('should use value attribute', (() => {
        expect(els[7].getAttribute('value')).toContain("Insert");
    }));

    it('should not use value attribute', (() => {
        expect(els[8].textContent).toContain("Select");
    }));

    it('should use innerHTML attribute', (() => {
        expect(els[9].textContent).toContain("Angular localization");
        expect(els[9].childNodes[0].nodeName.toLowerCase()).toBe("strong");
    }));

    it('should render translated texts when language changes', fakeAsync(() => {
        locale.setCurrentLanguage('it');

        tick();
        fixture.detectChanges();

        els = [];
        for (let i = 0; i < des.length; i++) {
            els.push(des[i].nativeElement);
        }
        expect(els[0].textContent).toContain("Localizzazione in Angular");
        expect(els[1].textContent).toContain("robisim74, tu hai 2 nuovi messaggi");
        expect(els[2].textContent).toContain("Il mondo è piccolo");
        expect(els[3].textContent).toContain("Localizzazione in Angular");
        expect(els[4].textContent).toContain("Il mondo è piccolo");
        expect(els[5].textContent).toContain("Localizzazione in Angular");
        expect(els[6].textContent).toContain("Localizzazione in Angular");
        expect(els[7].getAttribute('value')).toContain("Inserisci");
        expect(els[8].textContent).toContain("Seleziona");

        expect(els[9].textContent).toContain("Localizzazione in Angular");
        expect(els[9].childNodes[0].nodeName.toLowerCase()).toBe("strong");
    }));

    it('should change keys, params & attributes dynamically', async(() => {
        comp.change();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            // Waits for Mutation Observer in the directive is fired.
            setTimeout(() => {
                fixture.detectChanges();

                els = [];
                for (let i = 0; i < des.length; i++) {
                    els.push(des[i].nativeElement);
                }
                expect(els[0].textContent).toContain("It's a small world");
                expect(els[1].textContent).toContain("robisim74, you have 3 new messages");
                expect(els[7].getAttribute('value')).toContain("Select");
                expect(els[9].textContent).toContain("It's a small world");
                expect(els[9].childNodes[0].nodeName.toLowerCase()).toBe('strong');
            }, 1000);
        });
    }));

});

@Component({
    template: `
        <p><em>should render translated text & trim spaces</em></p>
        <p id="key" translate>
            {{ key }}
        </p>

        <p><em>should render translated text using parameters</em></p>
        <p [translate]="{ user: username, NoMessages: messages.length }">User notifications</p>

        <p><em>should search the key</em></p>
        <p translate>
            <em translate>Title</em>
            <span>&nbsp;</span>
            Subtitle
        </p>
        <p translate>
            Subtitle
            <span>&nbsp;</span>
            <em translate>Title</em>
        </p>
        <a translate>
            <div>
                <div></div>
                Title
            </div>
        </a>

        <p><em>should use value attribute</em></p>
        <input type="button" [value]="value" translate>

        <p><em>should not use value attribute</em></p>
        <select>
            <option [value]="value" translate>Select</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>

        <p><em>should use innerHTML attribute</em></p>
        <p [innerHTML]="innerHTML" translate></p>
    `
})
class TranslateComponent {

    key: string = "Title";
    username: string = "robisim74";
    messages: string[] = ["Test1", "Test2"];
    value: string = "Insert";
    innerHTML: string = "Strong title"

    change() {
        this.key = "Subtitle";
        this.messages.push("Test3");
        this.value = "Select";
        this.innerHTML = "Strong subtitle";
    }

}
