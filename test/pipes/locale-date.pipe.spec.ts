/**
 * Unit testing: LocaleDatePipe class.
 */

// Testing.
import { inject, TestBed } from '@angular/core/testing';
import { PipeResolver } from '@angular/compiler';

// Pipes.
import { LocaleDatePipe } from './../../angular2localization';
// Services.
import { LocaleService } from './../../angular2localization';

describe('LocaleDatePipe', () => {

    var pipe: LocaleDatePipe;

    beforeEach(() => {
        // Providers.
        TestBed.configureTestingModule({
            providers: [
                LocaleService
            ]
        });
    });

    // Pure pipe.
    it('should be marked as pure', () => {

        expect(new PipeResolver().resolve(LocaleDatePipe).pure).toEqual(true);

    });

    it('should localize a date',
        inject([LocaleService],
            (locale: LocaleService) => {               

                pipe = new LocaleDatePipe();

                locale.enableCookie = false;
                locale.definePreferredLocale('en', 'US');

                var date = new Date('7/19/2016');

                expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('7/19/2016');

                locale.setCurrentLocale('it', 'IT');

                expect(pipe.transform(date, locale.getDefaultLocale(), 'shortDate')).toEqual('19/7/2016');

            })
    );

});
