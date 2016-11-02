/**
 * Unit testing: LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe classes.
 */

// Testing.
import { inject, TestBed } from '@angular/core/testing';
import { PipeResolver } from '@angular/compiler';

// Pipes.
import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from './../../angular2localization';
// Services.
import { LocaleService } from './../../angular2localization';

describe('Locale number pipes', () => {

    beforeEach(() => {
        // Providers.
        TestBed.configureTestingModule({
            providers: [
                LocaleService
            ]
        });
    });

    // LocaleDecimalPipe.
    describe('LocaleDecimalPipe', () => {

        var pipe: LocaleDecimalPipe;

        // Pure pipe.
        it('should be marked as pure', () => {

            expect(new PipeResolver().resolve(LocaleDecimalPipe).pure).toEqual(true);

        });

        it('should localize a decimal number',
            inject([LocaleService],
                (locale: LocaleService) => {

                    pipe = new LocaleDecimalPipe();

                    locale.enableCookie = false;
                    locale.definePreferredLocale('en', 'US');

                    expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1,234.50');

                    locale.setCurrentLocale('it', 'IT');

                    expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1.234,50');

                })
        );

    });

    // LocalePercentPipe.
    describe('LocalePercentPipe', () => {

        var pipe: LocalePercentPipe;

        // Pure pipe.
        it('should be marked as pure', () => {

            expect(new PipeResolver().resolve(LocalePercentPipe).pure).toEqual(true);

        });

        it('should localize a percent number',
            inject([LocaleService],
                (locale: LocaleService) => {

                    pipe = new LocalePercentPipe();

                    locale.enableCookie = false;
                    locale.definePreferredLocale('en', 'US');

                    expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

                    locale.setCurrentLocale('it', 'IT');

                    expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

                })
        );

    });

    // LocaleCurrencyPipe.
    describe('LocaleCurrencyPipe', () => {

        var pipe: LocaleCurrencyPipe;

        // Pure pipe.
        it('should be marked as pure', () => {

            expect(new PipeResolver().resolve(LocaleDecimalPipe).pure).toEqual(true);

        });

        it('should localize a currency',
            inject([LocaleService],
                (locale: LocaleService) => {

                    pipe = new LocaleCurrencyPipe();

                    locale.enableCookie = false;
                    locale.definePreferredLocale('en', 'US');
                    locale.definePreferredCurrency('USD');

                    expect(pipe.transform(
                        1234.5,
                        locale.getDefaultLocale(),
                        locale.getCurrentCurrency(),
                        true,
                        '1.2-2')).toEqual('$1,234.50');

                    locale.setCurrentLocale('it', 'IT');
                    locale.setCurrentCurrency('EUR');

                    var value: string = pipe.transform(
                        1234.5,
                        locale.getDefaultLocale(),
                        locale.getCurrentCurrency(),
                        true,
                        '1.2-2').replace(/\u00A0/, " "); // Intl return Unicode Character 'NO-BREAK SPACE' (U+00A0).

                    expect(value).toEqual('1.234,50 €');

                })
        );

    });

});
