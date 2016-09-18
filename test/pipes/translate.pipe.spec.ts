/**
 * Unit testing: TranslatePipe class.
 */

// Testing.
import { inject, TestBed } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    Http,
    ConnectionBackend,
    BaseRequestOptions,
    Response,
    ResponseOptions
} from '@angular/http';
import { PipeResolver } from '@angular/compiler';

// Pipes.
import { TranslatePipe } from './../../angular2localization';
// Services.
import { LocalizationService, LocaleService } from './../../angular2localization';

describe('TranslatePipe', () => {

    // Providers.
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                LocaleService,
                LocalizationService,
                {
                    provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }, deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
    });

    // Multiple Requests with different URL.
    var responses: any = {};
    responses['./resources/locale-it.json'] = new Response(new ResponseOptions({ body: '{"SUBTITLE": "Il mondo è piccolo"}' }));
    responses['./resources/locale-en.json'] = new Response(new ResponseOptions({ body: '{"SUBTITLE": "It\'s a small word"}' }));

    function expectURL(backend: MockBackend) {
        backend.connections.subscribe((c: MockConnection) => {
            var response: any = responses[c.request.url];
            c.mockRespond(response);
        });
    }

    // Translate pipe object.
    var pipe: TranslatePipe;

    // Pure pipe.
    it('should be marked as pure', () => {

        expect(new PipeResolver().resolve(TranslatePipe).pure).toEqual(true);

    });

    // Direct loading.
    it('should translate through direct loading', fakeAsync(
        inject([LocaleService, LocalizationService],
            (locale: LocaleService, localization: LocalizationService) => {

                locale.enableCookie = false;

                locale.addLanguage('en');
                locale.addLanguage('it');

                // Selects the current language of the browser if it has been added, else the preferred language.
                locale.definePreferredLanguage('en');

                var translationEN = {
                    TITLE: 'Angular 2 Localization'
                }
                var translationIT = {
                    TITLE: 'Localizzazione in Angular 2'
                }

                localization.addTranslation('en', translationEN);
                localization.addTranslation('it', translationIT);
                localization.updateTranslation();

                pipe = new TranslatePipe(localization, locale);

                if (locale.getCurrentLanguage() == 'en') {

                    expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Angular 2 Localization");

                    locale.setCurrentLanguage('it');
                    expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Localizzazione in Angular 2");

                } else {

                    expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Localizzazione in Angular 2");

                    locale.setCurrentLanguage('en');
                    expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Angular 2 Localization");

                }

            }))
    );

    // i18n plural.
    it('should translate 18n plural', fakeAsync(
        inject([LocaleService, LocalizationService],
            (locale: LocaleService, localization: LocalizationService) => {

                locale.enableCookie = false;

                locale.addLanguage('ar');

                locale.definePreferredLanguage('ar');

                var translationAR = {
                    messages: 'رسائل'
                }

                localization.addTranslation('ar', translationAR);
                localization.updateTranslation();

                pipe = new TranslatePipe(localization, locale);

                expect(pipe.transform('10 messages', localization.languageCode)).toEqual("١٠ رسائل");

            }))
    );

    // Async loading.
    it('should translate through async loading',
        inject([LocaleService, LocalizationService, MockBackend],
            fakeAsync((locale: LocaleService, localization: LocalizationService, backend: MockBackend) => {

                // Mock backend for testing the Http service.
                expectURL(backend);

                locale.enableCookie = false;

                locale.addLanguage('it');
                locale.addLanguage('en');

                // Selects the current language of the browser if it has been added, else the preferred language.
                locale.definePreferredLanguage('en');

                localization.addProvider('./resources/locale-');
                localization.updateTranslation();

                pipe = new TranslatePipe(localization, locale);

                if (locale.getCurrentLanguage() == 'en') {

                    expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("It's a small word");

                    locale.setCurrentLanguage('it');
                    expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("Il mondo è piccolo");

                } else {

                    expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("Il mondo è piccolo");

                    locale.setCurrentLanguage('en');
                    expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("It's a small word");

                }

            }))
    );

});
