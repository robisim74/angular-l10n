/* tslint:disable */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocaleService,
    TranslationService,
    StorageStrategy
} from '../../src/angular-l10n';

describe('L10nLoader', () => {

    const l10nConfig: L10nConfig = {
        locale: {
            language: 'en',
            storage: StorageStrategy.Disabled
        },
        translation: {
            providers: []
        }
    };

    describe('Root', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            spyOn(locale, 'init').and.returnValue(Promise.resolve());
            spyOn(translation, 'init').and.returnValue(Promise.resolve());
        });

        it('should call locale & translation services', fakeAsync(() => {
            l10nLoader.load();
            tick();

            expect(locale.init).toHaveBeenCalled();
            expect(translation.init).toHaveBeenCalled();
        }));

    });

    describe('Child', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forChild(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            spyOn(locale, 'init').and.returnValue(Promise.resolve());
            spyOn(translation, 'init').and.returnValue(Promise.resolve());
        });

        it('should call only translation service', fakeAsync(() => {
            l10nLoader.load();
            tick();

            expect(locale.init).not.toHaveBeenCalled();
            expect(translation.init).toHaveBeenCalled();
        }));

    });

});
