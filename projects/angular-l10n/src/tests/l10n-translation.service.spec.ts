import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { L10nTranslationService, L10nConfig, L10nTranslationModule, L10nTranslationLoader, L10nProvider } from '../public-api';


@Injectable() class L10nHttpTranslationLoader implements L10nTranslationLoader {
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    constructor(@Optional() private http: HttpClient) { }
    public getTranslation(language: string, provider: L10nProvider): Observable<any> {
        const url = `${provider.asset}-${language}.json`;
        const options = {
            headers: this.headers,
            params: new HttpParams().set('v', provider.options.version)
        };
        return this.http.get(url, options);
    }
}

describe('L10nTranslationService', () => {
    let translation: L10nTranslationService;
    const i18nHome = {
        'en-US': {
            home: {
                title: 'Angular localization',
                subtitle: 'The world is small'
            }
        },
        'it-IT': {
            home: {
                title: 'Localizzazione in Angular',
                subtitle: 'Il mondo è piccolo'
            }
        }
    };
    const config: L10nConfig = {
        format: 'language-region',
        providers: [
            { name: 'i18nHome', asset: i18nHome }
        ],
        keySeparator: '.',
        defaultLocale: { language: 'en-US' }
    };
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        });
        translation = TestBed.inject(L10nTranslationService);
        await translation.init();
    });
    it('should get the locale', () => {
        expect(translation.getLocale()).toEqual(jasmine.objectContaining({ language: 'en-US' }));
    });
    it('should set the locale', async () => {
        await translation.setLocale({ language: 'it-IT' });
        expect(translation.getLocale()).toEqual(jasmine.objectContaining({ language: 'it-IT' }));
    });
    it('should throw an error if the language is not valid', async () => {
        await expectAsync(translation.setLocale({ language: 'it-it' })).toBeRejectedWith('angular-l10n (formatLanguage): Invalid language');
    });
    it('should fire onChanges', async () => {
        translation.onChange().subscribe({
            next: (value) => expect(value).toEqual(jasmine.objectContaining({ language: 'en-US' }))
        });
        await translation.setLocale({ language: 'en-US' });
    });
    it('should fire onError', async () => {
        translation.onError().subscribe({
            next: (value) => expect(value).toEqual('angular-l10n (L10nDefaultTranslationLoader): Asset not found')
        });
        await translation.setLocale({ language: 'fr-FR' });
        expect(translation.getLocale()).toEqual(jasmine.objectContaining({ language: 'fr-FR' }));
    });
    it('should load the translation', async () => {
        await translation.setLocale({ language: 'it-IT' });
        expect(translation.has('home.title')).toBe(true);
    });
    it('should translate', async () => {
        await translation.setLocale({ language: 'it-IT' });
        expect(translation.translate('home.title')).toEqual('Localizzazione in Angular');
    });
    it('should translate an array', async () => {
        await translation.setLocale({ language: 'it-IT' });
        expect(translation.translate(['home.title', 'home.subtitle'])).toEqual(jasmine.objectContaining({
            'home.title': 'Localizzazione in Angular',
            'home.subtitle': 'Il mondo è piccolo'
        }));
    });
    it('should check if a traslation exist', async () => {
        await translation.setLocale({ language: 'it-IT' });
        expect(translation.has('home.title')).toBe(true);
        expect(translation.has('home.text')).toBe(false);
    });
});

describe('Features', () => {
    describe('Http loader', () => {
        let httpMock: HttpTestingController;
        let translation: L10nTranslationService;
        const config: L10nConfig = {
            format: 'language',
            providers: [
                { name: 'home', asset: './assets/i18n/home', options: { version: '1.0.0' } }
            ],
            keySeparator: '.',
            defaultLocale: { language: 'en' }
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    L10nTranslationModule.forRoot(
                        config,
                        { translationLoader: L10nHttpTranslationLoader }
                    )
                ]
            });
            httpMock = TestBed.inject(HttpTestingController);
            translation = TestBed.inject(L10nTranslationService);
        });
        it('should use json files', fakeAsync(() => {
            translation.init();
            tick();
            const i18nHomeEn = httpMock.expectOne('./assets/i18n/home-en.json?v=1.0.0');
            i18nHomeEn.flush({
                home: {
                    title: 'Angular localization',
                    subtitle: 'The world is small'
                }
            });
            expect(translation.has('home.title')).toBe(true);
        }));
        afterEach(() => {
            httpMock.verify();
        });
    });
    describe('Multiple providers', () => {
        let httpMock: HttpTestingController;
        let translation: L10nTranslationService;
        const config: L10nConfig = {
            format: 'language',
            providers: [
                { name: 'home', asset: './assets/i18n/home', options: { version: '1.0.0' } },
                { name: 'about', asset: './assets/i18n/about', options: { version: '1.0.0' } },
            ],
            keySeparator: '.',
            defaultLocale: { language: 'en' }
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    L10nTranslationModule.forRoot(
                        config,
                        { translationLoader: L10nHttpTranslationLoader }
                    )
                ]
            });
            httpMock = TestBed.inject(HttpTestingController);
            translation = TestBed.inject(L10nTranslationService);
        });
        it('should use multiple providers', fakeAsync(() => {
            translation.init();
            tick();
            const i18nHomeEn = httpMock.expectOne('./assets/i18n/home-en.json?v=1.0.0');
            i18nHomeEn.flush({
                home: {
                    title: 'Angular localization',
                    subtitle: 'The world is small'
                }
            });
            const i18nAboutEn = httpMock.expectOne('./assets/i18n/about-en.json?v=1.0.0');
            i18nAboutEn.flush({
                about: {
                    title: 'About'
                }
            });
            expect(translation.has('home.title')).toBe(true);
            expect(translation.has('about.title')).toBe(true);
        }));
        afterEach(() => {
            httpMock.verify();
        });
    });
    describe('Fallback', () => {
        let httpMock: HttpTestingController;
        let translation: L10nTranslationService;
        const config: L10nConfig = {
            format: 'language-region',
            providers: [
                { name: 'home', asset: './assets/i18n/home', options: { version: '1.0.0' } }
            ],
            fallback: true,
            keySeparator: '.',
            defaultLocale: { language: 'en-US' }
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    L10nTranslationModule.forRoot(
                        config,
                        { translationLoader: L10nHttpTranslationLoader }
                    )
                ]
            });
            httpMock = TestBed.inject(HttpTestingController);
            translation = TestBed.inject(L10nTranslationService);
        });
        it('should fallback', fakeAsync(() => {
            translation.init();
            tick();
            const i18nHomeEn = httpMock.expectOne('./assets/i18n/home-en.json?v=1.0.0');
            i18nHomeEn.flush({
                home: {
                    title: 'Angular localization',
                    subtitle: 'The world is small'
                }
            });
            const i18nHomeEnUs = httpMock.expectOne('./assets/i18n/home-en-US.json?v=1.0.0');
            i18nHomeEnUs.flush({
                home: {
                    subtitle: 'The world is small'
                }
            });
            expect(translation.has('home.title')).toBe(true);
            expect(translation.has('home.subtitle')).toBe(true);
        }));
        afterEach(() => {
            httpMock.verify();
        });
    });
    describe('Cache', () => {
        let httpMock: HttpTestingController;
        let translation: L10nTranslationService;
        const config: L10nConfig = {
            format: 'language-region',
            providers: [
                { name: 'home', asset: './assets/i18n/home', options: { version: '1.0.0' } }
            ],
            fallback: true,
            cache: true,
            keySeparator: '.',
            defaultLocale: { language: 'en-US' }
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    L10nTranslationModule.forRoot(
                        config,
                        { translationLoader: L10nHttpTranslationLoader }
                    )
                ]
            });
            httpMock = TestBed.inject(HttpTestingController);
            translation = TestBed.inject(L10nTranslationService);
        });
        it('should use cache', fakeAsync(() => {
            translation.init();
            tick();
            const i18nHomeEn = httpMock.expectOne('./assets/i18n/home-en.json?v=1.0.0');
            i18nHomeEn.flush({
                home: {
                    title: 'Angular localization',
                    subtitle: 'The world is small'
                }
            });
            const i18nHomeEnUs = httpMock.expectOne('./assets/i18n/home-en-US.json?v=1.0.0');
            i18nHomeEnUs.flush({
                home: {
                    subtitle: 'The world is small'
                }
            });
            translation.setLocale({ language: 'en-US' });
            tick();
            httpMock.expectNone('./assets/i18n/home-en.json?v=1.0.0');
            httpMock.expectNone('./assets/i18n/home-en-US.json?v=1.0.0');
            expect(translation.has('home.title')).toBe(true);
            expect(translation.has('home.subtitle')).toBe(true);
        }));
        afterEach(() => {
            httpMock.verify();
        });
    });
    describe('Dynamic providers', () => {
        let httpMock: HttpTestingController;
        let translation: L10nTranslationService;
        const config: L10nConfig = {
            format: 'language-region',
            providers: [
                { name: 'home', asset: './assets/i18n/home', options: { version: '1.0.0' } }
            ],
            fallback: true,
            cache: true,
            keySeparator: '.',
            defaultLocale: { language: 'en-US' }
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    L10nTranslationModule.forRoot(
                        config,
                        { translationLoader: L10nHttpTranslationLoader }
                    )
                ]
            });
            httpMock = TestBed.inject(HttpTestingController);
            translation = TestBed.inject(L10nTranslationService);
        });
        it('should add providers dynamically', fakeAsync(() => {
            translation.init();
            tick();
            const i18nHomeEn = httpMock.expectOne('./assets/i18n/home-en.json?v=1.0.0');
            i18nHomeEn.flush({
                home: {
                    title: 'Angular localization',
                    subtitle: 'The world is small'
                }
            });
            const i18nHomeEnUs = httpMock.expectOne('./assets/i18n/home-en-US.json?v=1.0.0');
            i18nHomeEnUs.flush({
                home: {
                    subtitle: 'The world is small'
                }
            });
            expect(translation.has('home.title')).toBe(true);
            if (config.providers) {
                config.providers = [
                    ...config.providers,
                    { name: 'about', asset: './assets/i18n/about', options: { version: '1.0.0' } }
                ];
            }
            translation.init();
            tick();
            httpMock.expectNone('./assets/i18n/home-en.json?v=1.0.0');
            httpMock.expectNone('./assets/i18n/home-en-US.json?v=1.0.0');
            const i18nAboutEn = httpMock.expectOne('./assets/i18n/about-en.json?v=1.0.0');
            i18nAboutEn.flush({
                about: {
                    title: 'About'
                }
            });
            const i18nAboutEnUs = httpMock.expectOne('./assets/i18n/about-en-US.json?v=1.0.0');
            i18nAboutEnUs.flush({
                about: {
                    title: 'About'
                }
            });
            expect(translation.has('home.title')).toBe(true);
            expect(translation.has('about.title')).toBe(true);
        }));
        afterEach(() => {
            httpMock.verify();
        });
    });
});
