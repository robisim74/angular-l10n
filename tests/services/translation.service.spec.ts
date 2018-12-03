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
        Title: "Angular localization"
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
            ]
        }
    };

    describe('translate', () => {

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
            expect(translation.translate('Title')).toEqual("Angular localization");
        }));

        it('should translate using empty parameters', (() => {
            locale.setCurrentLanguage('en');
            expect(translation.translate('Title', null, '')).toEqual("Angular localization");
        }));

    });

});
