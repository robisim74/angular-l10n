import { inject, async, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    Http,
    ConnectionBackend,
    BaseRequestOptions,
    Response,
    ResponseOptions
} from '@angular/http';
import { PipeResolver } from '@angular/compiler';

import { TranslatePipe } from './../../index';
import { LocaleService, TranslationService } from './../../index';

describe('TranslatePipe', () => {

    let pipe: TranslatePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                LocaleService,
                TranslationService,
                {
                    provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }, deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
    });

    function expectURL(backend: MockBackend, responses: any) {
        backend.connections.subscribe((c: MockConnection) => {
            let response: any = responses[c.request.url];
            c.mockRespond(response);
        });
    }

    it('should be marked as pure', () => {
        expect(new PipeResolver().resolve(TranslatePipe).pure).toEqual(true);
    });

    describe('Direct loading', () => {
        it('should translate through direct loading', async(
            inject([LocaleService, TranslationService],
                (locale: LocaleService, translation: TranslationService) => {
                    locale.AddConfiguration()
                        .DisableStorage()
                        .AddLanguages(['en', 'it'])
                        .DefineLanguage('en');
                    locale.init();

                    const translationEN = {
                        Title: 'Angular localization'
                    }
                    const translationIT = {
                        Title: 'Localizzazione in Angular'
                    }
                    const translationGlobalEN = {
                        Save: 'Save'
                    }
                    const translationGlobalIT = {
                        Save: 'Salva'
                    }

                    translation.AddConfiguration()
                        .AddTranslation('en', translationEN)
                        .AddTranslation('it', translationIT)
                        .AddTranslation('en', translationGlobalEN)
                        .AddTranslation('it', translationGlobalIT);

                    pipe = new TranslatePipe(translation);

                    translation.translationChanged.subscribe(
                        (lang: string) => {
                            if (lang == 'en') {
                                expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localization");
                                expect(pipe.transform('Save', translation.getLanguage())).toEqual("Save");
                            } else {
                                expect(pipe.transform('Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
                                expect(pipe.transform('Save', translation.getLanguage())).toEqual("Salva");
                            }
                        }
                    );

                    translation.init();
                })
        ));

    });

    describe('Async loading', () => {

        // Multiple requests with different URL.
        let responses: any = {};
        responses['./assets/locale-it.json'] = new Response(new ResponseOptions({ body: '{"Home": {"Title": "Localizzazione in Angular"}, "Subtitle": "Il mondo è piccolo", "User notifications": "{{ user }}, tu hai {{ NoMessages }} nuovi messaggi", "Missing": "Nessuna chiave"}' }));
        responses['./assets/locale-en.json'] = new Response(new ResponseOptions({ body: '{"Home": {"Title": "Angular localization"}, "Subtitle": "It\'s a small word", "User notifications": "{{ user }}, you have {{ NoMessages }} new messages", "Missing": "No key"}' }));

        it('should translate through async loading', async(
            inject([LocaleService, TranslationService, MockBackend],
                (locale: LocaleService, translation: TranslationService, backend: MockBackend) => {
                    // Mock backend for testing the Http service.
                    expectURL(backend, responses);

                    locale.AddConfiguration()
                        .DisableStorage()
                        .AddLanguages(['en', 'it'])
                        .DefineLanguage('en');
                    locale.init();

                    translation.AddConfiguration()
                        .AddProvider('./assets/locale-')
                        .SetMissingKey("Missing");

                    pipe = new TranslatePipe(translation);
                    let username: string = "robisim74";
                    let messages: string[] = [];
                    messages.push("Test1");
                    messages.push("Test2");
                    const params = {
                        user: username,
                        NoMessages: messages.length
                    };

                    translation.translationChanged.subscribe(
                        (lang: string) => {
                            if (lang == 'en') {
                                expect(pipe.transform('Home.Title', translation.getLanguage())).toEqual("Angular localization");
                                expect(pipe.transform('Subtitle', translation.getLanguage())).toEqual("It's a small word");
                                expect(pipe.transform('User notifications', translation.getLanguage(), params)).toEqual("robisim74, you have 2 new messages");
                                expect(pipe.transform('Test', translation.getLanguage())).toEqual("No key");
                            } else {
                                expect(pipe.transform('Home.Title', translation.getLanguage())).toEqual("Localizzazione in Angular");
                                expect(pipe.transform('Subtitle', translation.getLanguage())).toEqual("Il mondo è piccolo");
                                expect(pipe.transform('User notifications', translation.getLanguage(), params)).toEqual("robisim74, tu hai 2 nuovi messaggi");
                                expect(pipe.transform('Test', translation.getLanguage())).toEqual("Nessuna chiave");
                            }
                        }
                    );

                    translation.init();
                })
        ));

    });

    describe('I18n', () => {

        let responses: any = {};
        responses['./assets/locale-ar.json'] = new Response(new ResponseOptions({ body: '{"messages": "رسائل"}' }));

        it('should translate i18n plural', async(
            inject([LocaleService, TranslationService, MockBackend],
                (locale: LocaleService, translation: TranslationService, backend: MockBackend) => {
                    expectURL(backend, responses);

                    locale.AddConfiguration()
                        .DisableStorage()
                        .AddLanguage('ar')
                        .DefineLanguage('ar');
                    locale.init();

                    translation.AddConfiguration()
                        .AddProvider('./assets/locale-');

                    pipe = new TranslatePipe(translation);

                    translation.translationChanged.subscribe(
                        () => { expect(pipe.transform('10 messages', translation.getLanguage())).toEqual("١٠ رسائل"); }
                    );

                    translation.init();
                })
        ));

    });

    describe('Providers', () => {

        let responses: any = {};
        responses['./assets/locale-it.json'] = new Response(new ResponseOptions({ body: '{"Subtitle": "Il mondo è piccolo"}' }));
        responses['./assets/locale-en.json'] = new Response(new ResponseOptions({ body: '{"Subtitle": "It\'s a small word"}' }));
        responses['./assets/global-it.json'] = new Response(new ResponseOptions({ body: '{"Save": "Salva"}' }));
        responses['./assets/global-en.json'] = new Response(new ResponseOptions({ body: '{"Save": "Save"}' }));

        it('should translate more than one provider for each translation', async(
            inject([LocaleService, TranslationService, MockBackend],
                (locale: LocaleService, translation: TranslationService, backend: MockBackend) => {
                    expectURL(backend, responses);

                    locale.AddConfiguration()
                        .DisableStorage()
                        .AddLanguages(['en', 'it'])
                        .DefineLanguage('en');
                    locale.init();

                    translation.AddConfiguration()
                        .AddProvider('./assets/locale-')
                        .AddProvider('./assets/global-');

                    pipe = new TranslatePipe(translation);

                    translation.translationChanged.subscribe(
                        (lang: string) => {
                            if (lang == 'en') {
                                expect(pipe.transform('Subtitle', translation.getLanguage())).toEqual("It's a small word");
                                expect(pipe.transform('Save', translation.getLanguage())).toEqual("Save");
                            } else {
                                expect(pipe.transform('Subtitle', translation.getLanguage())).toEqual("Il mondo è piccolo");
                                expect(pipe.transform('Save', translation.getLanguage())).toEqual("Salva");
                            }
                        }
                    );

                    translation.init();
                })
        ));

    });

    describe('Use locale as language', () => {

        let responses: any = {};
        responses['./assets/locale-en-US.json'] = new Response(new ResponseOptions({ body: '{"Title": "Angular localization"}' }));

        it('should translate using locale as language', async(
            inject([LocaleService, TranslationService, MockBackend],
                (locale: LocaleService, translation: TranslationService, backend: MockBackend) => {
                    expectURL(backend, responses);

                    locale.AddConfiguration()
                        .DisableStorage()
                        .AddLanguage('en')
                        .DefineDefaultLocale('en', 'US');
                    locale.init();

                    translation.AddConfiguration()
                        .AddProvider('./assets/locale-')
                        .UseLocaleAsLanguage();

                    pipe = new TranslatePipe(translation);

                    translation.translationChanged.subscribe(
                        () => { expect(pipe.transform('Title', translation.getLanguage())).toEqual("Angular localization"); }
                    );

                    translation.init();
                })
        ));

    });

});
