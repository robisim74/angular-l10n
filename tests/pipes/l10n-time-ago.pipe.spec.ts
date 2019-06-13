/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nTimeAgoPipe,
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocalizationExtraModule,
    LocaleService,
    StorageStrategy,
    RelativeTimeOptions
} from '../../src/angular-l10n';

describe('L10nTimeAgoPipe', () => {

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    let pipe: L10nTimeAgoPipe;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            storage: StorageStrategy.Disabled
        }
    };

    beforeEach((done) => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig),
                LocalizationExtraModule
            ]
        });

        l10nLoader = TestBed.get(L10nLoader);
        locale = TestBed.get(LocaleService);
        pipe = new L10nTimeAgoPipe(locale);

        l10nLoader.load().then(() => done());
    });

    it('should localize a relative time', () => {
        expect(pipe.transform(-1, locale.getDefaultLocale(), 'day')).toEqual('1 day ago');
        expect(pipe.transform(-2, locale.getDefaultLocale(), 'day')).toEqual('2 days ago');

        locale.setDefaultLocale('it', 'IT');
        expect(pipe.transform(-1, locale.getDefaultLocale(), 'day')).toEqual('1 giorno fa');
        expect(pipe.transform(-2, locale.getDefaultLocale(), 'day')).toEqual('2 giorni fa');
    });

    it('should localize a relative time using custom format', () => {
        const options: RelativeTimeOptions = { numeric: 'auto', style: 'long' };

        locale.setDefaultLocale('en', 'US');
        expect(pipe.transform(-1, locale.getDefaultLocale(), 'day', options)).toEqual('yesterday');

        locale.setDefaultLocale('it', 'IT');
        expect(pipe.transform(-1, locale.getDefaultLocale(), 'day', options)).toEqual('ieri');
    });

});
