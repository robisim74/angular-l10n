import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';

import { L10nLoader, L10nTranslationService, L10nConfig, L10nTranslationModule, L10N_LOCALE, L10nLocale } from '../public-api';

@Component({
    template: `
        <p>{{ 'title' | translate:locale.language }}</p>
    `
})
class MockComponent {
    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }
}

@Component({
    template: `
        <p>{{ 'title' | translateAsync }}</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
class MockOnPushComponent { }

describe('L10nTranslatePipe', () => {
    let fixture: ComponentFixture<MockComponent>;
    let el: HTMLElement;
    let loader: L10nLoader;
    let translation: L10nTranslationService;
    const mockAsset = {
        en: {
            title: 'Angular localization'
        },
        it: {
            title: 'Localizzazione in Angular'
        }
    };
    const config: L10nConfig = {
        format: 'language',
        providers: [
            { name: 'asset', asset: mockAsset }
        ],
        defaultLocale: { language: 'en' }
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [MockComponent],
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        }).createComponent(MockComponent);
        el = fixture.nativeElement.querySelector('p');
        loader = TestBed.inject(L10nLoader);
        translation = TestBed.inject(L10nTranslationService);
        await loader.init();
    });
    it('should render translated text', () => {
        fixture.detectChanges();
        expect(el.textContent).toContain('Angular localization');
    });
    it('should render translated text when language changes', async () => {
        await translation.setLocale({ language: 'it' });
        fixture.detectChanges();
        expect(el.textContent).toContain('Localizzazione in Angular');
    });
});

describe('L10nTranslateAsyncPipe', () => {
    let fixture: ComponentFixture<MockOnPushComponent>;
    let el: HTMLElement;
    let loader: L10nLoader;
    let translation: L10nTranslationService;
    const mockAsset = {
        en: {
            title: 'Angular localization'
        },
        it: {
            title: 'Localizzazione in Angular'
        }
    };
    const config: L10nConfig = {
        format: 'language',
        providers: [
            { name: 'asset', asset: mockAsset }
        ],
        keySeparator: '.',
        defaultLocale: { language: 'en' }
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [MockOnPushComponent],
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        }).createComponent(MockOnPushComponent);
        el = fixture.nativeElement.querySelector('p');
        loader = TestBed.inject(L10nLoader);
        translation = TestBed.inject(L10nTranslationService);
        await loader.init();
    });
    it('should render translated text', () => {
        fixture.detectChanges();
        expect(el.textContent).toContain('Angular localization');
    });
    it('should render translated text when language changes', async () => {
        await translation.setLocale({ language: 'it' });
        fixture.detectChanges();
        expect(el.textContent).toContain('Localizzazione in Angular');
    });
});
