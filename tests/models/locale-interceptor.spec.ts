/* tslint:disable */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleInterceptorModule,
    StorageStrategy,
    ProviderType,
    ISOCode
} from '../../src/angular-l10n';

describe('LocaleInterceptor', () => {

    let httpMock: HttpTestingController;

    let l10nLoader: L10nLoader;

    const l10nConfig: L10nConfig = {
        locale: {
            languages: [
                { code: 'en', dir: 'ltr' },
                { code: 'it', dir: 'ltr' }
            ],
            defaultLocale: { languageCode: 'it', countryCode: 'IT' },
            storage: StorageStrategy.Disabled
        },
        translation: {
            providers: [
                { type: ProviderType.Static, prefix: './assets/locale-' }
            ]
        },
        localeInterceptor: {
            format: [ISOCode.Language, ISOCode.Country]
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig),
                LocaleInterceptorModule
            ]
        });

        httpMock = TestBed.get(HttpTestingController);

        l10nLoader = TestBed.get(L10nLoader);
    });

    it('should set locale in Accept-Language header on outgoing requests', fakeAsync(() => {
        l10nLoader.load();
        tick();

        const req: TestRequest = httpMock.expectOne(
            req => req.headers.has('Accept-Language')
        );

        req.flush({});

        expect(req.request.headers.get('Accept-Language')).toEqual("it-IT");
    }));

    afterEach(() => {
        httpMock.verify();
    });

});
