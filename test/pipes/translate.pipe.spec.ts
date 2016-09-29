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

    // Pure pipe.
    it('should be marked as pure', () => {

        expect(new PipeResolver().resolve(TranslatePipe).pure).toEqual(true);

    });

    describe('Direct loading', () => {

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

        // Translate pipe object.
        var pipe: TranslatePipe;

        // Direct loading.
        it('should translate through direct loading',
            inject([LocaleService, LocalizationService],
                (locale: LocaleService, localization: LocalizationService) => {

                    locale.enableCookie = false;

                    locale.addLanguages(['en', 'it']);

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
                        localization.translationChanged.subscribe(
                            () => expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Localizzazione in Angular 2")
                        );


                    } else {

                        expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Localizzazione in Angular 2");

                        locale.setCurrentLanguage('en');
                        localization.translationChanged.subscribe(
                            () => expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Angular 2 Localization")
                        );

                    }

                })
        );

    });

    describe('Async loading', () => {

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
        responses['./resources/locale-it.json'] = new Response(new ResponseOptions({ body: '{"HOME": {"TITLE": "Localizzazione in Angular 2"}, "SUBTITLE": "Il mondo è piccolo", "USER_NOTIFICATIONS": "{{ user }}, tu hai {{ NoMessages }} nuovi messaggi"}' }));
        responses['./resources/locale-en.json'] = new Response(new ResponseOptions({ body: '{"HOME": {"TITLE": "Angular 2 Localization"}, "SUBTITLE": "It\'s a small word", "USER_NOTIFICATIONS": "{{ user }}, you have {{ NoMessages }} new messages"}' }));

        function expectURL(backend: MockBackend) {
            backend.connections.subscribe((c: MockConnection) => {
                var response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        // Translate pipe object.
        var pipe: TranslatePipe;

        // Async loading.
        it('should translate through async loading',
            inject([LocaleService, LocalizationService, MockBackend],
                (locale: LocaleService, localization: LocalizationService, backend: MockBackend) => {

                    // Mock backend for testing the Http service.
                    expectURL(backend);

                    locale.enableCookie = false;

                    locale.addLanguages(['en', 'it']);

                    // Selects the current language of the browser if it has been added, else the preferred language.
                    locale.definePreferredLanguage('en');

                    localization.translationProvider('./resources/locale-');
                    localization.updateTranslation();

                    pipe = new TranslatePipe(localization, locale);

                    var username: string = "robisim74";
                    var messages: string[] = [];
                    messages.push("Test1");
                    messages.push("Test2");

                    const params = {
                        user: username,
                        NoMessages: messages.length
                    };

                    if (locale.getCurrentLanguage() == 'en') {

                        expect(pipe.transform('HOME.TITLE', localization.languageCode)).toEqual("Angular 2 Localization");
                        expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("It's a small word");
                        expect(pipe.transform('USER_NOTIFICATIONS', localization.languageCode, params)).toEqual("robisim74, you have 2 new messages");

                        locale.setCurrentLanguage('it');
                        localization.translationChanged.subscribe(
                            () => {
                                expect(pipe.transform('HOME.TITLE', localization.languageCode)).toEqual("Localizzazione in Angular 2");
                                expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("Il mondo è piccolo");
                                expect(pipe.transform('USER_NOTIFICATIONS', localization.languageCode, params)).toEqual("robisim74, tu hai 2 nuovi messaggi");
                            }
                        );


                    } else {

                        expect(pipe.transform('HOME.TITLE', localization.languageCode)).toEqual("Localizzazione in Angular 2");
                        expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("Il mondo è piccolo");
                        expect(pipe.transform('USER_NOTIFICATIONS', localization.languageCode, params)).toEqual("robisim74, tu hai 2 nuovi messaggi");

                        locale.setCurrentLanguage('en');
                        localization.translationChanged.subscribe(
                            () => {
                                expect(pipe.transform('HOME.TITLE', localization.languageCode)).toEqual("Angular 2 Localization");
                                expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("It's a small word");
                                expect(pipe.transform('USER_NOTIFICATIONS', localization.languageCode, params)).toEqual("robisim74, you have 2 new messages");
                            }
                        );

                    }

                })
        );

    });

    describe('i18n', () => {

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
        responses['./resources/locale-ar.json'] = new Response(new ResponseOptions({ body: '{"messages": "رسائل"}' }));

        function expectURL(backend: MockBackend) {
            backend.connections.subscribe((c: MockConnection) => {
                var response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        // Translate pipe object.
        var pipe: TranslatePipe;

        // i18n plural.
        it('should translate i18n plural',
            inject([LocaleService, LocalizationService, MockBackend],
                (locale: LocaleService, localization: LocalizationService, backend: MockBackend) => {

                    // Mock backend for testing the Http service.
                    expectURL(backend);

                    locale.enableCookie = false;

                    locale.addLanguage('ar');

                    // Selects the current language of the browser if it has been added, else the preferred language.
                    locale.definePreferredLanguage('ar');

                    localization.translationProvider('./resources/locale-');
                    localization.updateTranslation();

                    pipe = new TranslatePipe(localization, locale);

                    expect(pipe.transform('10 messages', localization.languageCode)).toEqual("١٠ رسائل");

                })
        );

    });

    describe('Providers', () => {

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
        responses['./resources/global-it.json'] = new Response(new ResponseOptions({ body: '{"SAVE": "Salva"}' }));
        responses['./resources/global-en.json'] = new Response(new ResponseOptions({ body: '{"SAVE": "Save"}' }));

        function expectURL(backend: MockBackend) {
            backend.connections.subscribe((c: MockConnection) => {
                var response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        // Translate pipe object.
        var pipe: TranslatePipe;

        // More than one provider for each translation.
        it('should translate more than one provider for each translation',
            inject([LocaleService, LocalizationService, MockBackend],
                (locale: LocaleService, localization: LocalizationService, backend: MockBackend) => {

                    // Mock backend for testing the Http service.
                    expectURL(backend);

                    locale.enableCookie = false;

                    locale.addLanguages(['en', 'it']);

                    // Selects the current language of the browser if it has been added, else the preferred language.
                    locale.definePreferredLanguage('en');

                    localization.addProvider('./resources/locale-');
                    localization.addProvider('./resources/global-');
                    localization.updateTranslation();

                    pipe = new TranslatePipe(localization, locale);

                    if (locale.getCurrentLanguage() == 'en') {

                        expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("It's a small word");
                        expect(pipe.transform('SAVE', localization.languageCode)).toEqual("Save");

                        locale.setCurrentLanguage('it');
                        localization.translationChanged.subscribe(
                            () => {
                                expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("Il mondo è piccolo");
                                expect(pipe.transform('SAVE', localization.languageCode)).toEqual("Salva");
                            }
                        );


                    } else {

                        expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("Il mondo è piccolo");
                        expect(pipe.transform('SAVE', localization.languageCode)).toEqual("Salva");

                        locale.setCurrentLanguage('en');
                        localization.translationChanged.subscribe(
                            () => {
                                expect(pipe.transform('SUBTITLE', localization.languageCode)).toEqual("It's a small word");
                                expect(pipe.transform('SAVE', localization.languageCode)).toEqual("Save");
                            }
                        );

                    }

                })
        );

    });

    describe('Use locale as language', () => {

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
        responses['./resources/locale-en-US.json'] = new Response(new ResponseOptions({ body: '{"TITLE": "Angular 2 localization"}' }));
        responses['./resources/locale-en-GB.json'] = new Response(new ResponseOptions({ body: '{"TITLE": "Angular 2 localisation"}' }));

        function expectURL(backend: MockBackend) {
            backend.connections.subscribe((c: MockConnection) => {
                var response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        // Translate pipe object.
        var pipe: TranslatePipe;

        // Use locale as language.
        it('should translate using locale as language',
            inject([LocaleService, LocalizationService, MockBackend],
                (locale: LocaleService, localization: LocalizationService, backend: MockBackend) => {

                    // Mock backend for testing the Http service.
                    expectURL(backend);

                    locale.enableCookie = false;

                    locale.addLanguage('en');

                    locale.definePreferredLocale('en', 'US');

                    localization.translationProvider('./resources/locale-');

                    localization.useLocaleAsLanguage();

                    localization.updateTranslation();

                    pipe = new TranslatePipe(localization, locale);

                    expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Angular 2 localization");

                    locale.setCurrentLocale('en', 'GB');
                    localization.translationChanged.subscribe(
                        () => {
                            expect(pipe.transform('TITLE', localization.languageCode)).toEqual("Angular 2 localisation");
                        }
                    );

                })
        );

    });

});
