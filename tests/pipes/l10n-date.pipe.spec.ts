/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nDatePipe,
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy,
    DateTimeOptions
} from '../../src/angular-l10n';

describe('L10nDatePipe', () => {

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            timezone: 'America/Los_Angeles',
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

    it('should localize a date using format aliases', () => {
        const date: Date = new Date('7/19/2016');

        expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('7/19/2016');

        locale.setDefaultLocale('it', 'IT');
        expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('19/7/2016');
    });

    it('should localize a date using custom format', () => {
        const date: Date = new Date('8/29/2017');
        const options: DateTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        locale.setDefaultLocale('en', 'US');
        expect(pipe.transform(date, locale.getDefaultLocale(), options)).toEqual('Tuesday, August 29, 2017');

        locale.setDefaultLocale('it', 'IT');
        expect(pipe.transform(date, locale.getDefaultLocale(), options)).toEqual('martedì 29 agosto 2017');
    });

    it('should localize a date using timezone', () => {
        const date: Date = new Date(Date.UTC(2017, 7, 29, 21, 41, 0));
        const options: DateTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

        locale.setDefaultLocale('en', 'US');
        expect(pipe.transform(date, locale.getDefaultLocale(), options, locale.getCurrentTimezone())).toEqual('Tuesday, August 29, 2017, 2:41 PM');

        locale.setDefaultLocale('it', 'IT');
        locale.setCurrentTimezone('Europe/Rome');
        expect(pipe.transform(date, locale.getDefaultLocale(), options, locale.getCurrentTimezone())).toEqual('martedì 29 agosto 2017, 23:41');
    });

});
