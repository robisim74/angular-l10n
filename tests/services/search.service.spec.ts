/* tslint:disable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleSeoModule,
    LocaleService,
    SearchService,
    StorageStrategy
} from '../../src/angular-l10n';

@Component({
    template: ``
})
class HomeComponent implements OnInit {

    constructor(private search: SearchService) { }

    ngOnInit(): void {
        this.search.updateHead('home');
    }

}

describe('SearchService', () => {

    const translationEN: any = {
        "home": {
            "title": "Angular localization",
            "description": "An Angular library to translate messages, dates and numbers"
        }
    };
    const translationIT: any = {
        "home": {
            "title": "Localizzazione in Angular",
            "description": "Una libreria Angular per tradurre testi, date e numeri"
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
            ],
            composedKeySeparator: '.'
        },
        search: {
            metaTags: ['description']
        }
    };

    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let title: Title;
    let meta: Meta;

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
        title = TestBed.get(Title);
        meta = TestBed.get(Meta);

        l10nLoader = TestBed.get(L10nLoader);
        locale = TestBed.get(LocaleService);

        l10nLoader.load().then(() => done());
    });

    beforeEach(() => {
        locale.setCurrentLanguage('en');

        fixture.detectChanges();
    });

    it('should translate title & meta tags', (() => {
        let description: any = meta.getTag('name=description');

        expect(title.getTitle()).toContain("Angular localization");
        expect(description.content).toContain("An Angular library to translate messages, dates and numbers");
    }));

    it('should translate title & meta tags when language changes', (() => {
        locale.setCurrentLanguage('it');

        fixture.detectChanges();

        let description: any = meta.getTag('name=description');

        expect(title.getTitle()).toContain("Localizzazione in Angular");
        expect(description.content).toContain("Una libreria Angular per tradurre testi, date e numeri");
    }));

});
