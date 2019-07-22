/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleService,
    TranslationService,
    StorageStrategy
} from '../../src/angular-l10n';

describe('TranslationService', () => {

    let l10nLoader: L10nLoader;
    let locale: LocaleService;
    let translation: TranslationService;

    const translationEN: any = {
        "title": "Angular localization",
        "home": {
            "title": "Angular localization - Home"
        }
    };

    const l10nConfig: L10nConfig = {
        locale: {
            languages: [
                { code: 'en', dir: 'ltr' }
            ],
            language: 'en',
            storage: StorageStrategy.Disabled
        },
        translation: {
            translationData: [
                { languageCode: 'en', data: translationEN }
            ],
            composedKeySeparator: '.'
        }
    };

    describe('Translate', () => {

        beforeEach((done) => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            l10nLoader.load().then(() => done());
        });

        it('should translate', (() => {
            locale.setCurrentLanguage('en');
            expect(translation.translate('title')).toEqual("Angular localization");
        }));

        it('should translate using empty parameters', (() => {
            locale.setCurrentLanguage('en');
            expect(translation.translate('title', null, '')).toEqual("Angular localization");
        }));

        it('should check that the translation exists', (() => {
            locale.setCurrentLanguage('en');
            expect(translation.has('home')).toEqual(true);
            expect(translation.has('home.title')).toEqual(true);
            expect(translation.has('subtitle')).toEqual(false);
            expect(translation.has('home.subtitle')).toEqual(false);

            expect(translation.has('home', 'it')).toEqual(false);
        }));

    });

});
