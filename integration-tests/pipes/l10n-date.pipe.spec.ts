import { Pipe } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { L10nDatePipe } from './../../index';
import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy
} from './../../index';

describe('L10nDatePipe', () => {

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            storage: StorageStrategy.Disabled
        }
    };

    let pipe: L10nDatePipe;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig)
            ]
        });

        l10nLoader = TestBed.get(L10nLoader);
        locale = TestBed.get(LocaleService);
        pipe = new L10nDatePipe();
        
        l10nLoader.load().then(() => done());
    });

    it('should localize a date', () => {
        const date: Date = new Date('7/19/2016');

        expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('7/19/2016');

        locale.setDefaultLocale('it', 'IT');
        expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('19/7/2016');
    });

});
