import { Pipe } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { PipeResolver } from '@angular/compiler';

import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from './../../index';
import {
    LocalizationModule,
    LocaleService
} from './../../index';

describe('Locale number pipes', () => {

    let locale: LocaleService;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            imports: [
                LocalizationModule.forRoot()
            ]
        });

        locale = TestBed.get(LocaleService);

        locale.addConfiguration()
            .disableStorage()
            .defineDefaultLocale('en', 'US')
            .defineCurrency('USD');
        locale.init().then(() => done());
    });

    describe('LocaleDecimalPipe', () => {

        const pipe: LocaleDecimalPipe = new LocaleDecimalPipe();

        it('should be marked as pure', () => {
            const pipeResolver: Pipe | null = new PipeResolver().resolve(LocaleDecimalPipe);
            if (pipeResolver) {
                expect(pipeResolver.pure).toEqual(true);
            }
        });

        it('should localize a decimal number', () => {
            expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1,234.50');

            locale.setDefaultLocale('it', 'IT');
            expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1.234,50');
        });

    });

    describe('LocalePercentPipe', () => {

        const pipe: LocalePercentPipe = new LocalePercentPipe();

        it('should be marked as pure', () => {
            const pipeResolver: Pipe | null = new PipeResolver().resolve(LocalePercentPipe);
            if (pipeResolver) {
                expect(pipeResolver.pure).toEqual(true);
            }
        });

        it('should localize a percent number', () => {
            expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

            locale.setDefaultLocale('it', 'IT');
            expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');
        });

    });

    describe('LocaleCurrencyPipe', () => {

        const pipe: LocaleCurrencyPipe = new LocaleCurrencyPipe();

        it('should be marked as pure', () => {
            const pipeResolver: Pipe | null = new PipeResolver().resolve(LocaleCurrencyPipe);
            if (pipeResolver) {
                expect(pipeResolver.pure).toEqual(true);
            }
        });

        it('should localize a currency', () => {
            expect(pipe.transform(
                1234.5,
                locale.getDefaultLocale(),
                locale.getCurrentCurrency(),
                true,
                '1.2-2')
            ).toEqual('$1,234.50');

            locale.setDefaultLocale('it', 'IT');
            locale.setCurrentCurrency('EUR');

            let value: string | null = pipe.transform(
                1234.5,
                locale.getDefaultLocale(),
                locale.getCurrentCurrency(),
                true,
                '1.2-2'
            );
            if (!!value) {
                value = value.replace(/\u00A0/, " "); // Intl returns Unicode Character 'NO-BREAK SPACE' (U+00A0).
            }
            expect(value).toEqual('1.234,50 €');
        });

    });

});
