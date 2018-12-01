/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nDecimalPipe,
    L10nPercentPipe,
    L10nCurrencyPipe,
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy,
    DigitsOptions
} from '../../src/angular-l10n';

describe('L10n number pipes', () => {

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    let decimalPipe: L10nDecimalPipe;
    let percentPipe: L10nPercentPipe;
    let currencyPipe: L10nCurrencyPipe;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            currency: 'USD',
            storage: StorageStrategy.Disabled
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
        decimalPipe = new L10nDecimalPipe(locale);
        percentPipe = new L10nPercentPipe(locale);
        currencyPipe = new L10nCurrencyPipe(locale);

        l10nLoader.load().then(() => done());
    });

    describe('L10nDecimalPipe', () => {

        it('should localize a decimal number', () => {
            expect(decimalPipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1,234.50');

            locale.setDefaultLocale('it', 'IT');
            expect(decimalPipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1.234,50');
        });

        it('should localize a decimal number using custom format', () => {
            const options: DigitsOptions = { minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2 };

            expect(decimalPipe.transform(1234.5, locale.getDefaultLocale(), options)).toEqual('1,234.50');

            locale.setDefaultLocale('it', 'IT');
            expect(decimalPipe.transform(1234.5, locale.getDefaultLocale(), options)).toEqual('1.234,50');
        });

    });

    describe('L10nPercentPipe', () => {

        it('should localize a percent number', () => {
            expect(percentPipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

            locale.setDefaultLocale('it', 'IT');
            expect(percentPipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');
        });

    });

    describe('L10nCurrencyPipe', () => {

        it('should localize a currency', () => {
            expect(currencyPipe.transform(
                1234.5,
                locale.getDefaultLocale(),
                locale.getCurrentCurrency(),
                'symbol',
                '1.2-2')
            ).toEqual('$1,234.50');

            locale.setDefaultLocale('it', 'IT');
            locale.setCurrentCurrency('EUR');

            let value: string | null = currencyPipe.transform(
                1234.5,
                locale.getDefaultLocale(),
                locale.getCurrentCurrency(),
                'symbol',
                '1.2-2'
            );
            if (!!value) {
                value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
            }
            expect(value).toEqual('1.234,50 €');
        });

    });

});
