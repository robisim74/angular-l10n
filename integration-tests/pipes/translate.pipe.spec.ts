import { Pipe } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    Http,
    HttpModule,
    ConnectionBackend,
    BaseRequestOptions,
    Response,
    ResponseOptions
} from '@angular/http';
import { PipeResolver } from '@angular/compiler';

import { TranslatePipe } from './../../index';
import {
    TranslationModule,
    LocalizationModule,
    LocaleService,
    TranslationService
} from './../../index';

describe('TranslatePipe', () => {

    it('should be marked as pure', () => {
        const pipeResolver: Pipe | null = new PipeResolver().resolve(TranslatePipe);
        if (pipeResolver) {
            expect(pipeResolver.pure).toEqual(true);
        }
    });

    describe('Direct loading', () => {

        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpModule,
                    TranslationModule.forRoot()
                ]
            });

            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            locale.addConfiguration()
                .disableStorage()
                .addLanguages(['en', 'it'])
                .defineLanguage('en');
            locale.init();

            const translationEN: any = {
                Title: "Angular localization"
            };
            const translationIT: any = {
                Title: "Localizzazione in Angular"
            };
            const translationGlobalEN: any = {
                Save: "Save"
            };
            const translationGlobalIT: any = {
                Save: "Salva"
            };

            translation.addConfiguration()
                .addTranslation('en', translationEN)
                .addTranslation('it', translationIT)
                .addTranslation('en', translationGlobalEN)
                .addTranslation('it', translationGlobalIT);
            translation.init();

            pipe = new TranslatePipe(translation);
        });

        it('should translate using more than one translation', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localization");
            expect(pipe.transform('Save', translation.getLanguage())).toEqual("Save");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('Save', translation.getLanguage())).toEqual("Salva");
        }));

    });

    describe('Async loading', () => {

        let locale: LocaleService;
        let translation: TranslationService;

        let mockBackend: MockBackend;

        let pipe: TranslatePipe;

        function expectURL(backend: MockBackend, responses: any): void {
            backend.connections.subscribe((c: MockConnection) => {
                const response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    TranslationModule.forRoot()
                ],
                providers: [
                    BaseRequestOptions,
                    MockBackend,
                    {
                        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }, deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            });

            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            mockBackend = TestBed.get(MockBackend);

            const responses: any = {};
            responses['./assets/locale-en.json'] = new Response(new ResponseOptions(
                { body: '{"Title": "Angular localization"}' }
            ));
            responses['./assets/locale-it.json'] = new Response(new ResponseOptions(
                { body: '{"Title": "Localizzazione in Angular"}' }
            ));
            responses['./assets/global-en.json'] = new Response(new ResponseOptions(
                { body: '{"Save": "Save"}' }
            ));
            responses['./assets/global-it.json'] = new Response(new ResponseOptions(
                { body: '{"Save": "Salva"}' }
            ));

            expectURL(mockBackend, responses);

            locale.addConfiguration()
                .disableStorage()
                .addLanguages(['en', 'it'])
                .defineLanguage('en');
            locale.init();

            translation.addConfiguration()
                .addProvider('./assets/locale-')
                .addProvider('./assets/global-');
            translation.init();

            pipe = new TranslatePipe(translation);
        });

        it('should translate using more than one provider for each translation', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localization");
            expect(pipe.transform('Save', translation.getLanguage())).toEqual("Save");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('Save', translation.getLanguage())).toEqual("Salva");
        }));

    });

    describe('Web API', () => {

        let locale: LocaleService;
        let translation: TranslationService;

        let mockBackend: MockBackend;

        let pipe: TranslatePipe;

        function expectURL(backend: MockBackend, responses: any): void {
            backend.connections.subscribe((c: MockConnection) => {
                const response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    TranslationModule.forRoot()
                ],
                providers: [
                    BaseRequestOptions,
                    MockBackend,
                    {
                        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }, deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            });

            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            mockBackend = TestBed.get(MockBackend);

            const responses: any = {};
            responses['http://localhost:54703/api/locales/en'] = new Response(new ResponseOptions(
                { body: '{"Title": "Angular localization"}' }
            ));
            responses['http://localhost:54703/api/locales/it'] = new Response(new ResponseOptions(
                { body: '{"Title": "Localizzazione in Angular"}' }
            ));
            responses['http://localhost:54703/api/global/en'] = new Response(new ResponseOptions(
                { body: '{"Save": "Save"}' }
            ));
            responses['http://localhost:54703/api/global/it'] = new Response(new ResponseOptions(
                { body: '{"Save": "Salva"}' }
            ));

            expectURL(mockBackend, responses);

            locale.addConfiguration()
                .disableStorage()
                .addLanguages(['en', 'it'])
                .defineLanguage('en');
            locale.init();

            translation.addConfiguration()
                .addWebAPIProvider('http://localhost:54703/api/locales/')
                .addWebAPIProvider('http://localhost:54703/api/global/');
            translation.init();

            pipe = new TranslatePipe(translation);
        });

        it('should translate using more than one Web API provider for each translation', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localization");
            expect(pipe.transform('Save', translation.getLanguage())).toEqual("Save");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('Save', translation.getLanguage())).toEqual("Salva");
        }));

    });

    describe('Default behaviours', () => {

        let locale: LocaleService;
        let translation: TranslationService;

        let mockBackend: MockBackend;

        let pipe: TranslatePipe;

        function expectURL(backend: MockBackend, responses: any): void {
            backend.connections.subscribe((c: MockConnection) => {
                const response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    TranslationModule.forRoot()
                ],
                providers: [
                    BaseRequestOptions,
                    MockBackend,
                    {
                        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }, deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            });

            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            mockBackend = TestBed.get(MockBackend);

            const responses: any = {};
            responses['./assets/locale-en.json'] = new Response(new ResponseOptions(
                {
                    body: '{"Home": {"Title": "Angular localization"}, ' +
                    '"User notifications": "{{ user }}, you have {{ NoMessages }} new messages"}'
                }
            ));
            responses['./assets/locale-it.json'] = new Response(new ResponseOptions(
                {
                    body: '{"Home": {"Title": "Localizzazione in Angular"}, ' +
                    '"User notifications": "{{ user }}, tu hai {{ NoMessages }} nuovi messaggi"}'
                }
            ));
            responses['./assets/locale-ar.json'] = new Response(new ResponseOptions(
                { body: '{"messages": "رسائل"}' }
            ));

            expectURL(mockBackend, responses);

            locale.addConfiguration()
                .disableStorage()
                .addLanguages(['en', 'it', 'ar'])
                .defineLanguage('en');
            locale.init();

            translation.addConfiguration()
                .addProvider('./assets/locale-');
            translation.init();

            pipe = new TranslatePipe(translation);
        });

        it('should translate using composed keys', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Home.Title', translation.getLanguage())).toEqual("Angular localization");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Home.Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
        }));

        it('should translate using parameters', (() => {
            const username: string = "robisim74";
            const messages: string[] = ["Test1", "Test2"];
            const params: any = {
                user: username,
                NoMessages: messages.length
            };

            locale.setCurrentLanguage('en');
            expect(pipe.transform('User notifications', translation.getLanguage(), params))
                .toEqual("robisim74, you have 2 new messages");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('User notifications', translation.getLanguage(), params))
                .toEqual("robisim74, tu hai 2 nuovi messaggi");
        }));

        it('should return the key path if value is missing', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Home.Subtitle', translation.getLanguage())).toEqual("Home.Subtitle");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Home.Subtitle', translation.getLanguage())).toEqual("Home.Subtitle");
        }));

        it('should translate i18n plural', (() => {
            locale.setCurrentLanguage('ar');
            expect(pipe.transform('10 messages', translation.getLanguage())).toEqual("١٠ رسائل");
        }));

    });

    describe('Methods', () => {

        let locale: LocaleService;
        let translation: TranslationService;

        let mockBackend: MockBackend;

        let pipe: TranslatePipe;

        function expectURL(backend: MockBackend, responses: any): void {
            backend.connections.subscribe((c: MockConnection) => {
                const response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    TranslationModule.forRoot()
                ],
                providers: [
                    BaseRequestOptions,
                    MockBackend,
                    {
                        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }, deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            });

            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            mockBackend = TestBed.get(MockBackend);

            const responses: any = {};
            responses['./assets/locale-en.json'] = new Response(new ResponseOptions(
                { body: '{"Home": {"Title": "Angular localization"}, "Missing": "No key"}' }
            ));
            responses['./assets/locale-it.json'] = new Response(new ResponseOptions(
                { body: '{"Home": {"Title": "Localizzazione in Angular"}, "Missing": "Nessuna chiave"}' }
            ));
            responses['./assets/locale-ar.json'] = new Response(new ResponseOptions(
                { body: '{"messages": "رسائل", "Missing": "لا مفتاح"}' }
            ));

            expectURL(mockBackend, responses);

            locale.addConfiguration()
                .disableStorage()
                .addLanguages(['en', 'it', 'ar'])
                .defineLanguage('en');
            locale.init();

            translation.addConfiguration()
                .addProvider('./assets/locale-')
                .setComposedKeySeparator('@')
                .setMissingKey("Missing")
                .disableI18nPlural();
            translation.init();

            pipe = new TranslatePipe(translation);
        });

        it('should translate using a different separator for composed keys', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Home@Title', translation.getLanguage())).toEqual("Angular localization");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Home@Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
        }));

        it('should return the missing key', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('Subtitle', translation.getLanguage())).toEqual("No key");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('Subtitle', translation.getLanguage())).toEqual("Nessuna chiave");
        }));

        it('should disable i18n plural', (() => {
            locale.setCurrentLanguage('ar');
            expect(pipe.transform('10 messages', translation.getLanguage())).not.toEqual("١٠ رسائل");
        }));

    });

    describe('Using locale', () => {

        let locale: LocaleService;
        let translation: TranslationService;

        let mockBackend: MockBackend;

        let pipe: TranslatePipe;

        function expectURL(backend: MockBackend, responses: any): void {
            backend.connections.subscribe((c: MockConnection) => {
                const response: any = responses[c.request.url];
                c.mockRespond(response);
            });
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    LocalizationModule.forRoot()
                ],
                providers: [
                    BaseRequestOptions,
                    MockBackend,
                    {
                        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }, deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            });
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);

            mockBackend = TestBed.get(MockBackend);

            const responses: any = {};
            responses['./assets/locale-en-US.json'] = new Response(new ResponseOptions(
                { body: '{"Title": "Angular localization"}' }
            ));
            responses['./assets/locale-en-GB.json'] = new Response(new ResponseOptions(
                { body: '{"Title": "Angular localisation"}' }
            ));

            expectURL(mockBackend, responses);

            locale.addConfiguration()
                .disableStorage()
                .addLanguage('en')
                .defineDefaultLocale('en', 'US');
            locale.init();

            translation.addConfiguration()
                .addProvider('./assets/locale-')
                .useLocaleAsLanguage();
            translation.init();

            pipe = new TranslatePipe(translation);
        });

        it('should translate using locale as language', (() => {
            locale.setDefaultLocale('en', 'US');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localization");

            locale.setDefaultLocale('en', 'GB');
            expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localisation");
        }));

    });

});
