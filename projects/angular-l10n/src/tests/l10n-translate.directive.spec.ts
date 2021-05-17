import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { L10nLoader, L10nTranslationService, L10nConfig, L10nTranslationModule, L10nTranslateDirective } from '../public-api';

@Component({
    template: `
        <p><em>should render translated text & trim spaces</em></p>
        <p l10nTranslate>
            {{ key }}
        </p>
        <p><em>should render translated text using parameters</em></p>
        <p [params]="{ user: username, NoMessages: messages.length }" l10nTranslate>userNotifications</p>
        <p><em>should search the key</em></p>
        <p l10nTranslate>
            <em l10nTranslate>title</em>
            <span>&nbsp;</span>
            subtitle
        </p>
        <p l10nTranslate>
            subtitle
            <span>&nbsp;</span>
            <em l10nTranslate>title</em>
        </p>
        <a l10nTranslate>
            <div>
                <div></div>
                title
            </div>
        </a>
        <p><em>should use value attribute</em></p>
        <input type="button" [value]="value" l10nTranslate>
        <p><em>should not use value attribute</em></p>
        <select>
            <option [value]="value" l10nTranslate>select</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
        <p><em>should use innerHTML attribute</em></p>
        <p [innerHTML]="innerHTML" l10nTranslate></p>
        <p><em>should render translated attributes</em></p>
        <p l10n-title title="title" l10nTranslate></p>
        <p l10n-title title="userNotifications" [params]="{ user: username, NoMessages: messages.length }" l10nTranslate></p>
        <p l10n-title title="title" l10nTranslate>
            <span [params]="{ user: username, NoMessages: messages.length }" l10nTranslate>userNotifications</span>
        </p>
    `
})
class MockComponent {
    key = 'title';
    username = 'robisim74';
    messages = ['Test1', 'Test2'];
    value = 'insert';
    innerHTML = 'strongTitle';
    change() {
        this.key = 'subtitle';
        this.messages.push('Test3');
        this.value = 'select';
        this.innerHTML = 'strongSubtitle';
    }
}

describe('L10nTranslateDirective', () => {
    let fixture: ComponentFixture<MockComponent>;
    let comp: MockComponent;
    let des: DebugElement[];
    let els: HTMLElement[];
    let loader: L10nLoader;
    let translation: L10nTranslationService;
    const mockAsset = {
        en: {
            title: 'Angular localization',
            subtitle: "It's a small world",
            userNotifications: '{{ user }}, you have {{ NoMessages }} new messages',
            insert: 'Insert',
            select: 'Select',
            strongTitle: '<strong>Angular localization</strong>',
            strongSubtitle: "<strong>It's a small world</ strong >"
        },
        it: {
            title: 'Localizzazione in Angular',
            subtitle: 'Il mondo è piccolo',
            userNotifications: '{{ user }}, tu hai {{ NoMessages }} nuovi messaggi',
            insert: 'Inserisci',
            select: 'Seleziona',
            strongTitle: '<strong>Localizzazione in Angular</strong>',
            strongSubtitle: '<strong>Il mondo è piccolo</strong>'
        }
    };
    const config: L10nConfig = {
        format: 'language',
        providers: [
            { name: 'asset', asset: mockAsset }
        ],
        keySeparator: '.',
        defaultLocale: { language: 'en' },
        schema: [
            { locale: { language: 'en' } }
        ]
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [MockComponent],
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        }).createComponent(MockComponent);
        comp = fixture.componentInstance;
        des = fixture.debugElement.queryAll(By.directive(L10nTranslateDirective));
        els = des.map(de => de.nativeElement);
        loader = TestBed.inject(L10nLoader);
        translation = TestBed.inject(L10nTranslationService);
        await loader.init();
    });
    beforeEach(() => {
        fixture.detectChanges();
    });
    it('should render translated text & trim spaces', () => {
        expect(els[0].textContent).toContain('Angular localization');
    });
    it('should render translated text using parameters', () => {
        expect(els[1].textContent).toContain('robisim74, you have 2 new messages');
    });
    it('should search the key', () => {
        expect(els[2].textContent).toContain("It's a small world");
        expect(els[3].textContent).toContain('Angular localization');
        expect(els[4].textContent).toContain("It's a small world");
        expect(els[5].textContent).toContain('Angular localization');
        expect(els[6].textContent).toContain('Angular localization');
    });
    it('should use value attribute', () => {
        expect(els[7].getAttribute('value')).toContain('Insert');
    });
    it('should not use value attribute', () => {
        expect(els[8].textContent).toContain('Select');
    });
    it('should use innerHTML attribute', () => {
        expect(els[9].textContent).toContain('Angular localization');
        expect(els[9].childNodes[0].nodeName.toLowerCase()).toBe('strong');
    });
    it('should render translated attributes', () => {
        expect(els[10].getAttribute('title')).toContain('Angular localization');
        expect(els[11].getAttribute('title')).toContain('robisim74, you have 2 new messages');
        expect(els[12].getAttribute('title')).toContain('Angular localization');
        expect(els[13].textContent).toContain('robisim74, you have 2 new messages');
    });
    it('should render translated texts when language changes', async () => {
        await translation.setLocale({ language: 'it' });
        fixture.detectChanges();
        expect(els[0].textContent).toContain('Localizzazione in Angular');
        expect(els[1].textContent).toContain('robisim74, tu hai 2 nuovi messaggi');
        expect(els[2].textContent).toContain('Il mondo è piccolo');
        expect(els[3].textContent).toContain('Localizzazione in Angular');
        expect(els[4].textContent).toContain('Il mondo è piccolo');
        expect(els[5].textContent).toContain('Localizzazione in Angular');
        expect(els[6].textContent).toContain('Localizzazione in Angular');
        expect(els[7].getAttribute('value')).toContain('Inserisci');
        expect(els[8].textContent).toContain('Seleziona');
        expect(els[9].textContent).toContain('Localizzazione in Angular');
        expect(els[9].childNodes[0].nodeName.toLowerCase()).toBe('strong');
        expect(els[10].getAttribute('title')).toContain('Localizzazione in Angular');
        expect(els[11].getAttribute('title')).toContain('robisim74, tu hai 2 nuovi messaggi');
        expect(els[12].getAttribute('title')).toContain('Localizzazione in Angular');
        expect(els[13].textContent).toContain('robisim74, tu hai 2 nuovi messaggi');
    });
    it('should change keys & params dynamically', waitForAsync(() => {
        comp.change();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            setTimeout(() => {
                expect(els[0].textContent).toContain("It's a small world");
                expect(els[1].textContent).toContain('robisim74, you have 3 new messages');
                expect(els[7].getAttribute('value')).toContain('Select');
                expect(els[9].textContent).toContain("It's a small world");
                expect(els[9].childNodes[0].nodeName.toLowerCase()).toBe('strong');
                expect(els[11].getAttribute('title')).toContain('robisim74, you have 3 new messages');
                expect(els[13].textContent).toContain('robisim74, you have 3 new messages');
            }, 0);
        });
    }));
});
