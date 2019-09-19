import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';

import { L10nLoader, L10nTranslationService, L10nConfig, L10nTranslationModule, L10N_LOCALE, L10nLocale } from '../public-api';

@Component({
    template: `
        <p>{{ 'home.title' | translate:locale.language }}</p>
    `
})
class HomeComponent {
    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }
}

@Component({
    template: `
        <p>{{ 'home.title' | translateAsync }}</p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
class HomeOnPushComponent { }

describe('L10nTranslatePipe', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let el: HTMLElement;
    let loader: L10nLoader;
    let translation: L10nTranslationService;
    const i18nHome = {
        en: {
            home: {
                title: 'Angular localization'
            }
        },
        it: {
            home: {
                title: 'Localizzazione in Angular'
            }
        }
    };
    const config: L10nConfig = {
        format: 'language',
        providers: [
            { name: 'home', asset: i18nHome }
        ],
        cache: true,
        keySeparator: '.',
        defaultLocale: { language: 'en' }
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        }).createComponent(HomeComponent);
        el = fixture.nativeElement.querySelector('p');
        loader = TestBed.inject(L10nLoader);
        translation = TestBed.inject(L10nTranslationService);
        await loader.init();
    });
    it('should render translated text', () => {
        fixture.detectChanges();
        expect(el.textContent).toContain('Angular localization');
    });
    it('should render translated text when locale changes', async () => {
        await translation.setLocale({ language: 'it' });
        fixture.detectChanges();
        expect(el.textContent).toContain('Localizzazione in Angular');
    });
});
describe('L10nTranslateAsyncPipe', () => {
    let fixture: ComponentFixture<HomeOnPushComponent>;
    let el: HTMLElement;
    let loader: L10nLoader;
    let translation: L10nTranslationService;
    const i18nHome = {
        en: {
            home: {
                title: 'Angular localization'
            }
        },
        it: {
            home: {
                title: 'Localizzazione in Angular'
            }
        }
    };
    const config: L10nConfig = {
        format: 'language',
        providers: [
            { name: 'home', asset: i18nHome }
        ],
        keySeparator: '.',
        defaultLocale: { language: 'en' }
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [HomeOnPushComponent],
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        }).createComponent(HomeOnPushComponent);
        el = fixture.nativeElement.querySelector('p');
        loader = TestBed.inject(L10nLoader);
        translation = TestBed.inject(L10nTranslationService);
        await loader.init();
    });
    it('should render translated text', () => {
        fixture.detectChanges();
        expect(el.textContent).toContain('Angular localization');
    });
    it('should render translated text when locale changes', async () => {
        await translation.setLocale({ language: 'it' });
        fixture.detectChanges();
        expect(el.textContent).toContain('Localizzazione in Angular');
    });
});
