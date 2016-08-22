/**
 * Unit testing: LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe classes.
 */

// Testing.
import { inject, TestBed } from '@angular/core/testing/test_bed';
import { fakeAsync } from '@angular/core/testing/fake_async';
import { browserDetection } from '@angular/platform-browser/testing/browser_util';
import { PipeResolver } from '@angular/compiler/src/pipe_resolver';

// Pipes.
import { LocaleDecimalPipe, LocalePercentPipe, LocaleCurrencyPipe } from './../../angular2localization';
// Services.
import { LocaleService } from './../../angular2localization';

describe('Locale number pipes', () => {

    if (browserDetection.supportsIntlApi && (browserDetection.isFirefox || browserDetection.isChromeDesktop)) {

        // LocaleDecimalPipe.
        describe('LocaleDecimalPipe', () => {

            var pipe: LocaleDecimalPipe;

            beforeEach(() => {
                // Providers.
                TestBed.configureTestingModule({
                    providers: [
                        LocaleService
                    ]
                });

                pipe = new LocaleDecimalPipe();
            });

            // Pure pipe.
            it('should be marked as pure', () => {

                expect(new PipeResolver().resolve(LocaleDecimalPipe).pure).toEqual(true);

            });

            it('should localize a decimal number', fakeAsync(
                inject([LocaleService],
                    (locale: LocaleService) => {

                        locale.definePreferredLocale('en', 'US');

                        expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1,234.50');

                        locale.setCurrentLocale('it', 'IT');

                        expect(pipe.transform(1234.5, locale.getDefaultLocale(), '1.2-2')).toEqual('1.234,50');

                    }))
            );
        });

        // LocalePercentPipe.
        describe('LocalePercentPipe', () => {

            var pipe: LocalePercentPipe;

            beforeEach(() => {
                // Providers.
                TestBed.configureTestingModule({
                    providers: [
                        LocaleService
                    ]
                });

                pipe = new LocalePercentPipe();
            });

            // Pure pipe.
            it('should be marked as pure', () => {

                expect(new PipeResolver().resolve(LocalePercentPipe).pure).toEqual(true);

            });

            it('should localize a percent number', fakeAsync(
                inject([LocaleService],
                    (locale: LocaleService) => {

                        locale.definePreferredLocale('en', 'US');

                        expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

                        locale.setCurrentLocale('it', 'IT');

                        expect(pipe.transform(1.23, locale.getDefaultLocale(), '1.0-0')).toEqual('123%');

                    }))
            );
        });

        // LocaleCurrencyPipe.
        describe('LocaleCurrencyPipe', () => {

            var pipe: LocaleCurrencyPipe;

            beforeEach(() => {
                // Providers.
                TestBed.configureTestingModule({
                    providers: [
                        LocaleService
                    ]
                });

                pipe = new LocaleCurrencyPipe();
            });

            // Pure pipe.
            it('should be marked as pure', () => {

                expect(new PipeResolver().resolve(LocaleDecimalPipe).pure).toEqual(true);

            });

            it('should localize a currency', fakeAsync(
                inject([LocaleService],
                    (locale: LocaleService) => {

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

                    }))
            );

        });

    }

});
