/**
 * Unit testing: LocaleDatePipe class.
 */

// Testing.
import { inject, TestBed } from '@angular/core/testing/test_bed';
import { fakeAsync } from '@angular/core/testing/fake_async';
import { browserDetection } from '@angular/platform-browser/testing/browser_util';
import { PipeResolver } from '@angular/compiler/src/pipe_resolver';

// Pipes.
import { LocaleDatePipe } from './../../angular2localization';
// Services.
import { LocaleService } from './../../angular2localization';

describe('LocaleDatePipe', () => {

    if (browserDetection.supportsIntlApi && (browserDetection.isFirefox || browserDetection.isChromeDesktop)) {

        var date: Date;
        // Translate pipe object.
        var pipe: LocaleDatePipe;

        beforeEach(() => {
            // Providers.
            TestBed.configureTestingModule({
                providers: [
                    LocaleService
                ]
            });

            date = new Date('7/19/2016');
            pipe = new LocaleDatePipe();
        });

        // Pure pipe.
        it('should be marked as pure', () => {

            expect(new PipeResolver().resolve(LocaleDatePipe).pure).toEqual(true);

        });

        it('should localize a date', fakeAsync(
            inject([LocaleService],
                (locale: LocaleService) => {

                    locale.definePreferredLocale('en', 'US');

                    expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('7/19/2016');

                    locale.setCurrentLocale('it', 'IT');

                    expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('19/7/2016');

                }))
        );

    }

});
