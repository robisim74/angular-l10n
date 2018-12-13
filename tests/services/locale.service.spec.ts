/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy
} from '../../src/angular-l10n';

describe('LocaleService', () => {

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            storage: StorageStrategy.Disabled
        }
    };

    describe('formatDate', () => {

        beforeEach((done) => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        it('should format a date', (() => {
            const date: Date = new Date('2016-07-19');

            expect(locale.formatDate(date, 'shortDate')).toEqual('7/19/2016');
        }));

        it('should format a date using empty parameters', (() => {
            const date: Date = new Date('2016-07-19');

            expect(locale.formatDate(date, '', '')).toEqual('Jul 19, 2016');
        }));

    });

    describe('formatDecimal', () => {

        beforeEach((done) => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            l10nLoader.load().then(() => done());
        });

        it('should format a number', (() => {
            expect(locale.formatDecimal(1234.5, '1.2-2')).toEqual('1,234.50');
        }));

        it('should format a number using empty parameters', (() => {
            expect(locale.formatDecimal(1234.5, '', '')).toEqual('1,234.5');
        }));

    });

});
