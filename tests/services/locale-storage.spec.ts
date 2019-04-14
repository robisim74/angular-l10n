/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    LocaleStorage,
    StorageStrategy
} from '../../src/angular-l10n';

import { getCookie } from '../../src/models/utils';

describe('LocaleStorage', () => {

    describe('L10nStorage', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let localeStorage: LocaleStorage;

        const l10nConfig: L10nConfig = {
            locale: {
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Cookie
            }
        };

        beforeEach((done) => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            localeStorage = TestBed.get(LocaleStorage);

            l10nLoader.load().then(() => done());
        });

        it('should use cookie', (() => {
            localeStorage.read('defaultLocale').then(value => {
                expect(value).toEqual('en-US');
            });
        }));

    });

    describe('Custom storage names', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let localeStorage: LocaleStorage;

        const l10nConfig: L10nConfig = {
            locale: {
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Cookie,
                storageNames: {
                    defaultLocale: "myDefaultLocale"
                }
            }
        };

        beforeEach((done) => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            localeStorage = TestBed.get(LocaleStorage);

            l10nLoader.load().then(() => done());
        });

        it('should use custom cookie name', (() => {
            const cookie = getCookie('myDefaultLocale');
            expect(cookie).toEqual('en-US');
        }));

    });

});
