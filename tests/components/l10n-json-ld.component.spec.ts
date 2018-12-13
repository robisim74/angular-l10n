/* tslint:disable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import {
    L10nJsonLdComponent,
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleSeoModule,
    LocaleService,
    StorageStrategy
} from '../../src/angular-l10n';

@Component({
    template: `<l10n-json-ld path="corporationSchema"></l10n-json-ld>`
})
class HomeComponent { }

describe('L10nJsonLdComponent', () => {

    const translationEN: any = {
        "corporationSchema": {
            "@context": "http://schema.org",
            "@type": "Corporation",
            "name": "New Artisan",
            "description": "Design and development of web applications"
        }
    };
    const translationIT: any = {
        "corporationSchema": {
            "@context": "http://schema.org",
            "@type": "Corporation",
            "name": "New Artisan",
            "description": "Progettazione e sviluppo di applicazioni web"
        }
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

    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let des: DebugElement;
    let els: HTMLElement;

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [
                HttpClientTestingModule,
                TranslationModule.forRoot(l10nConfig),
                LocaleSeoModule.forRoot()
            ]
        }).createComponent(HomeComponent);

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
        des = fixture.debugElement.query(By.directive(L10nJsonLdComponent));
        els = des.nativeElement;
    });

    it('should render translated structured data', (() => {
        expect(els.childNodes[0].textContent).toContain(`"description": "Design and development of web applications"`);
    }));

    it('should render translated structured data when language changes', (() => {
        locale.setCurrentLanguage('it');

        fixture.detectChanges();
        els = des.nativeElement;

        expect(els.childNodes[0].textContent).toContain(`"description": "Progettazione e sviluppo di applicazioni web"`);
    }));

});
