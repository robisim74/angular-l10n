import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Component, DebugElement, Inject } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
    L10nLoader,
    L10nTranslationService,
    L10nConfig,
    L10nTranslationModule,
    L10nIntlModule,
    L10nDateDirective,
    L10N_LOCALE,
    L10nLocale
} from '../public-api';

@Component({
    template: `
        <p [options]="{ dateStyle: 'full', timeStyle: 'short' }" l10nDate>{{ date }}</p>
        <p [language]="locale.dateLanguage" [options]="{ dateStyle: 'full', timeStyle: 'short' }" l10nDate>{{ date }}</p>
    `
})
class MockComponent {
    date = new Date('2019-09-19T16:30:00Z');
    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }
}

describe('L10nDateDirective', () => {
    let fixture: ComponentFixture<MockComponent>;
    let comp: MockComponent;
    let des: DebugElement[];
    let els: HTMLElement[];
    let loader: L10nLoader;
    let translation: L10nTranslationService;
    const config: L10nConfig = {
        format: 'language-region',
        providers: [],
        keySeparator: '.',
        defaultLocale: { language: 'en-US', dateLanguage: 'it-IT', timeZone: 'Europe/Rome' },
        schema: [
            { locale: { language: 'en-US', dateLanguage: 'it-IT', timeZone: 'Europe/Rome' } }
        ]
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [MockComponent],
            imports: [
                L10nTranslationModule.forRoot(config),
                L10nIntlModule.forRoot()
            ]
        }).createComponent(MockComponent);
        comp = fixture.componentInstance;
        des = fixture.debugElement.queryAll(By.directive(L10nDateDirective));
        els = des.map(de => de.nativeElement);
        loader = TestBed.inject(L10nLoader);
        translation = TestBed.inject(L10nTranslationService);
        await loader.init();
    });
    beforeEach(() => {
        fixture.detectChanges();
    });
    it('should render localized date using dateLanguage', () => {
        expect(els[0].textContent).toContain('giovedì 19 settembre 2019 alle ore 18:30');
        expect(els[1].textContent).toContain('giovedì 19 settembre 2019 alle ore 18:30');
    });
    it('should render localized date when dateLanguage changes', async () => {
        await translation.setLocale({ language: 'it-IT', dateLanguage: 'en-US', timeZone: 'America/Los_Angeles' });
        fixture.detectChanges();
        expect(els[0].textContent).toContain('Thursday, September 19, 2019 at 9:30 AM');
        expect(els[1].textContent).toContain('Thursday, September 19, 2019 at 9:30 AM');
    });
});
