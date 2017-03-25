import { inject, TestBed } from '@angular/core/testing';
import { PipeResolver } from '@angular/compiler';

import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from './../../index';
import { LocaleService } from './../../index';

describe('Locale number pipes', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LocaleService
            ]
        });
    });

    describe('LocaleDecimalPipe', () => {

        let pipe: LocaleDecimalPipe;

        it('should be marked as pure', () => {
            expect(new PipeResolver().resolve(LocaleDecimalPipe).pure).toEqual(true);
        });

        it('should localize a decimal number',
            inject([LocaleService],
                (locale: LocaleService) => {
                    locale.addConfiguration()
                        .disableStorage()
                        .defineDefaultLocale('en', 'US');
                    locale.init();

                    pipe = new LocaleDecimalPipe();

                    expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1,234.50');

                    locale.setDefaultLocale('it', 'IT');

                    expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1.234,50');
                })
        );

    });

    describe('LocalePercentPipe', () => {

        let pipe: LocalePercentPipe;

        it('should be marked as pure', () => {
            expect(new PipeResolver().resolve(LocalePercentPipe).pure).toEqual(true);
        });

        it('should localize a percent number',
            inject([LocaleService],
                (locale: LocaleService) => {
                    locale.addConfiguration()
                        .disableStorage()
                        .defineDefaultLocale('en', 'US');
                    locale.init();

                    pipe = new LocalePercentPipe();

                    expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

                    locale.setDefaultLocale('it', 'IT');

                    expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');
                })
        );

    });

    describe('LocaleCurrencyPipe', () => {

        let pipe: LocaleCurrencyPipe;

        it('should be marked as pure', () => {
            expect(new PipeResolver().resolve(LocaleDecimalPipe).pure).toEqual(true);
        });

        it('should localize a currency',
            inject([LocaleService],
                (locale: LocaleService) => {
                    locale.addConfiguration()
                        .disableStorage()
                        .defineDefaultLocale('en', 'US')
                        .defineCurrency('USD');
                    locale.init();

                    pipe = new LocaleCurrencyPipe();
                    expect(pipe.transform(
                        1234.5,
                        locale.getDefaultLocale(),
                        locale.getCurrentCurrency(),
                        true,
                        '1.2-2')
                    ).toEqual('$1,234.50');

                    locale.setDefaultLocale('it', 'IT');
                    locale.setCurrentCurrency('EUR');

                    let value: string = pipe.transform(
                        1234.5,
                        locale.getDefaultLocale(),
                        locale.getCurrentCurrency(),
                        true,
                        '1.2-2'
                    ).replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).

                    expect(value).toEqual('1.234,50 €');
                })
        );

    });

});
