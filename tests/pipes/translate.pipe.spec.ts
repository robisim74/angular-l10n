/* tslint:disable */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    TranslatePipe,
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocalizationModule,
    LocaleSeoModule,
    LocaleService,
    TranslationService,
    StorageStrategy,
    ProviderType,
    ISOCode,
    TranslationProvider
} from '../../src/angular-l10n';

@Component({
    template: ``
})
class MockComponent { }

@Injectable() class CustomTranslationProvider implements TranslationProvider {

    constructor(private http: HttpClient) { }

    public getTranslation(language: string, args: any): Observable<any> {
        const url: string = args.path + language + ".json";

        return this.http.get(url);
    }

}

describe('TranslatePipe', () => {

    describe('Direct loading', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const translationGlobalEN: any = {
            "save": "Save"
        };
        const translationGlobalIT: any = {
            "save": "Salva"
        };
        const translationEN: any = {
            "title": "Angular localization"
        };
        const translationIT: any = {
            "title": "Localizzazione in Angular"
        };

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                language: 'en',
                storage: StorageStrategy.Disabled
            },
            translation: {
                translationData: [
                    { languageCode: 'en', data: translationGlobalEN },
                    { languageCode: 'it', data: translationGlobalIT },
                    { languageCode: 'en', data: translationEN },
                    { languageCode: 'it', data: translationIT }
                ]
            }
        };

        beforeEach((done) => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);

            l10nLoader.load().then(() => done());
        });

        it('should translate using more than one translation', (() => {
            locale.setCurrentLanguage('en');
            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Save");

            locale.setCurrentLanguage('it');
            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Salva");
        }));

    });

    describe('Async loading', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Static, prefix: './assets/global-' },
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using more than one provider for each translation', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/global-en.json');
            const req2: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "save": "Save" });
            req2.flush({ "title": "Angular localization" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Save");

            locale.setDefaultLocale('it');

            const req3: TestRequest = httpMock.expectOne('./assets/global-it.json');
            const req4: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req3.flush({ "save": "Salva" });
            req4.flush({ "title": "Localizzazione in Angular" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Salva");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Direct & Async loading', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const translationGlobalEN: any = {
            "save": "Save"
        };
        const translationGlobalIT: any = {
            "save": "Salva"
        };

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                translationData: [
                    { languageCode: 'en', data: translationGlobalEN },
                    { languageCode: 'it', data: translationGlobalIT }
                ],
                providers: [
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using direct and async loading', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "title": "Angular localization" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Save");

            locale.setDefaultLocale('it');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req2.flush({ "title": "Localizzazione in Angular" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Salva");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Fallback', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Fallback, prefix: './assets/global', fallbackLanguage: [] },
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should merge the providers in order', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/global.json');
            req1.flush({ "title": "Angular localization" });
            const req2: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req2.flush({ "save": "Save" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Save");

            locale.setDefaultLocale('it');

            const req3: TestRequest = httpMock.expectOne('./assets/global.json');
            req3.flush({ "title": "Angular localization", "save": "Save" });
            const req4: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req4.flush({ "save": "Salva" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Salva");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Web API', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.WebAPI, path: 'http://localhost:54703/api/global/' },
                    { type: ProviderType.WebAPI, path: 'http://localhost:54703/api/locales/' }
                ]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using more than one Web API provider for each translation', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('http://localhost:54703/api/global/en');
            const req2: TestRequest = httpMock.expectOne('http://localhost:54703/api/locales/en');
            req1.flush({ "title": "Angular localization" });
            req2.flush({ "save": "Save" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Save");

            locale.setDefaultLocale('it');

            const req3: TestRequest = httpMock.expectOne('http://localhost:54703/api/global/it');
            const req4: TestRequest = httpMock.expectOne('http://localhost:54703/api/locales/it');
            req3.flush({ "title": "Localizzazione in Angular" });
            req4.flush({ "save": "Salva" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
            expect(pipe.transform('save', locale.getCurrentLanguage())).toEqual("Salva");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Custom provider', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { path: './assets/locale-' }
                ]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(
                        l10nConfig,
                        { translationProvider: CustomTranslationProvider }
                    )
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using a custom provider', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "title": "Angular localization" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");

            locale.setDefaultLocale('it');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req2.flush({ "title": "Localizzazione in Angular" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Basic behavior', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using parameters', fakeAsync(() => {
            const username: string = "robisim74";
            const messages: string[] = ["Test1", "Test2"];
            const params: any = {
                user: username,
                NoMessages: messages.length
            };

            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({
                "userNotifications": "{{ user }}, you have {{ NoMessages }} new messages"
            });

            expect(pipe.transform('userNotifications', locale.getCurrentLanguage(), params))
                .toEqual("robisim74, you have 2 new messages");

            locale.setDefaultLocale('it');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req2.flush({
                "userNotifications": "{{ user }}, tu hai {{ NoMessages }} nuovi messaggi"
            });

            expect(pipe.transform('userNotifications', locale.getCurrentLanguage(), params))
                .toEqual("robisim74, tu hai 2 nuovi messaggi");
        }));

        it('should return the key path if value is missing', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({
                "home": { "title": "Angular localization" }
            });

            expect(pipe.transform('home.subtitle', locale.getCurrentLanguage())).toEqual("home.subtitle");

            locale.setDefaultLocale('it');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req2.flush({
                "home": { "title": "Localizzazione in Angular" }
            });

            expect(pipe.transform('home.subtitle', locale.getCurrentLanguage())).toEqual("home.subtitle");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Methods', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' },
                    { code: 'ar', dir: 'rtl' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ],
                composedKeySeparator: '.',
                missingKey: 'missing',
                missingValue: 'No key',
                i18nPlural: true
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using composed keys', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({
                "home": { "title": "Angular localization" }
            });

            expect(pipe.transform('home.title', locale.getCurrentLanguage())).toEqual("Angular localization");

            locale.setDefaultLocale('it');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req2.flush({
                "home": { "title": "Localizzazione in Angular" }
            });

            expect(pipe.transform('home.title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
        }));

        it('should return the missing key', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({
                "home": { "title": "Angular localization" },
                "missing": "No key"
            });

            expect(pipe.transform('subtitle', locale.getCurrentLanguage())).toEqual("No key");

            locale.setDefaultLocale('it');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
            req2.flush({
                "home": { "title": "Localizzazione in Angular" },
                "missing": "Nessuna chiave"
            });

            expect(pipe.transform('subtitle', locale.getCurrentLanguage())).toEqual("Nessuna chiave");
        }));

        it('should return the missing value', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "title": "Angular localization" });

            expect(pipe.transform('subtitle', locale.getCurrentLanguage())).toEqual("No key");
        }));

        it('should not return the missing value', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "title": "" });

            expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("");
        }));

        it('should translate i18n plural', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "messages": "messages" });

            expect(pipe.transform('10 messages', locale.getCurrentLanguage())).toEqual("10 messages");

            locale.setDefaultLocale('ar', 'SA');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-ar.json');
            req2.flush({ "messages": "رسائل" });

            expect(pipe.transform('10 messages', locale.getCurrentLanguage())).toEqual("١٠ رسائل");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Other methods', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ],
                composedKeySeparator: '.',
                missingValue: (path: string) => `${path} was not found`,
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    TranslationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should execute the user function as missing value', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
            req1.flush({ "title": "Angular localization" });

            expect(pipe.transform('subtitle', locale.getCurrentLanguage())).toEqual("subtitle was not found");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Using composed language', () => {

        let httpMock: HttpTestingController;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ],
                composedLanguage: [ISOCode.Language, ISOCode.Country]
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    LocalizationModule.forRoot(l10nConfig)
                ]
            });

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);
        });

        it('should translate using languageCode-countryCode as language', fakeAsync(() => {
            l10nLoader.load();
            tick();

            const req1: TestRequest = httpMock.expectOne('./assets/locale-en-US.json');
            req1.flush({ "title": "Angular localization" });

            expect(pipe.transform('title', locale.getCurrentLocale())).toEqual("Angular localization");

            locale.setDefaultLocale('en', 'GB');

            const req2: TestRequest = httpMock.expectOne('./assets/locale-en-GB.json');
            req2.flush({ "title": "Angular localisation" });

            expect(pipe.transform('title', locale.getCurrentLocale())).toEqual("Angular localisation");
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

    describe('Using localized routing', () => {

        let httpMock: HttpTestingController;
        let fixture: ComponentFixture<MockComponent>;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;
        let translation: TranslationService;

        let pipe: TranslatePipe;

        let router: Router;
        let location: Location;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en' },
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: [
                    { type: ProviderType.Static, prefix: './assets/locale-' }
                ]
            },
            localizedRouting: {
                format: [ISOCode.Language]
            }
        };

        const routes: Route[] = [
            { path: '', redirectTo: 'mock', pathMatch: 'full' },
            { path: 'mock', component: MockComponent }
        ];

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    HttpClientTestingModule,
                    RouterTestingModule.withRoutes(routes),
                    LocalizationModule.forRoot(l10nConfig),
                    LocaleSeoModule.forRoot()
                ]
            }).createComponent(MockComponent);

            httpMock = TestBed.get(HttpTestingController);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);
            translation = TestBed.get(TranslationService);
            pipe = new TranslatePipe(translation);

            router = TestBed.get(Router);
            location = TestBed.get(Location);
        });

        it('should translate when language changes', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.initialNavigation();
                    tick();

                    const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
                    req1.flush({ "title": "Angular localization" });

                    expect(location.path()).toBe('/en/mock');
                    expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");

                    locale.setDefaultLocale('it');
                    tick();

                    const req2: TestRequest = httpMock.expectOne('./assets/locale-it.json');
                    req2.flush({ "title": "Localizzazione in Angular" });

                    expect(location.path()).toBe('/it/mock');
                    expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Localizzazione in Angular");
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should translate when the app starts', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.initialNavigation();
                    tick();

                    expect(location.path()).toBe('/en/mock');

                    const req1: TestRequest = httpMock.expectOne('./assets/locale-en.json');
                    req1.flush({ "title": "Angular localization" });

                    expect(pipe.transform('title', locale.getCurrentLanguage())).toEqual("Angular localization");
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        afterEach(() => {
            httpMock.verify();
        });

    });

});
