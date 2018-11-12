/* tslint:disable */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Route } from '@angular/router';
import { Location } from '@angular/common';

import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleService,
    StorageStrategy,
    ISOCode
} from '../../src/angular-l10n';

import { MockComponent } from '../utils';

describe('LocaleService', () => {

    describe('Localized routing', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        let router: Router;
        let location: Location;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Disabled,
                localizedRouting: [ISOCode.Language, ISOCode.Country]
            },
            translation: {
                providers: []
            }
        };

        const routes: Route[] = [
            { path: '', redirectTo: 'mock', pathMatch: 'full' },
            { path: 'mock', component: MockComponent },
            { path: 'otherMock', component: MockComponent },
            { path: '**', redirectTo: 'mock' }
        ];

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    HttpClientTestingModule,
                    RouterTestingModule.withRoutes(routes),
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(MockComponent);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            router = TestBed.get(Router);
            location = TestBed.get(Location);
        });

        it('should replace url when the app starts', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.initialNavigation();
            tick();

            expect(location.path()).toBe('/en-US/mock');
        }));

        it('should replace url when navigation ends', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/otherMock']);
            tick();

            expect(location.path()).toBe('/en-US/otherMock');
        }));

        it('should replace url when default locale changes', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/mock']);
            tick();
            locale.setDefaultLocale('it', 'IT');
            tick();

            expect(location.path()).toBe('/it-IT/mock');
        }));

        it('should keep localized url when goes back', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/mock']);
            tick();
            router.navigate(['/otherMock']);
            tick();
            location.back();

            expect(location.path()).toBe('/en-US/mock');
        }));

        it('should keep localized url when goes back after the locale has changed', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/mock']);
            tick();
            locale.setDefaultLocale('it', 'IT');
            tick();
            location.back();

            expect(location.path()).toBe('/en-US/mock');
        }));

        it('should keep url query params', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigateByUrl('/mock?id=1');
            tick();

            expect(location.path()).toBe('/en-US/mock?id=1');
        }));

        it('should redirect wildcard route', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/wildcard']);
            tick();

            expect(location.path()).toBe('/en-US/mock');
        }));

    });

    describe('Localized routing with default routing', () => {

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        let router: Router;
        let location: Location;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                storage: StorageStrategy.Disabled,
                localizedRouting: [ISOCode.Language, ISOCode.Country],
                localizedRoutingOptions: {
                    defaultRouting: true
                }
            },
            translation: {
                providers: []
            }
        };

        const routes: Route[] = [
            { path: '', redirectTo: 'mock', pathMatch: 'full' },
            { path: 'mock', component: MockComponent },
            { path: 'otherMock', component: MockComponent },
            { path: '**', redirectTo: 'mock' }
        ];

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    HttpClientTestingModule,
                    RouterTestingModule.withRoutes(routes),
                    LocalizationModule.forRoot(l10nConfig)
                ]
            }).createComponent(MockComponent);

            l10nLoader = TestBed.get(L10nLoader);
            locale = TestBed.get(LocaleService);

            router = TestBed.get(Router);
            location = TestBed.get(Location);
        });

        it('should not replace url when the app starts', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.initialNavigation();
            tick();

            expect(location.path()).toBe('/mock');
        }));

        it('should not replace url when navigation ends', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/otherMock']);
            tick();

            expect(location.path()).toBe('/otherMock');
        }));

        it('should replace url when default locale changes', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/mock']);
            tick();
            locale.setDefaultLocale('it', 'IT');
            tick();

            expect(location.path()).toBe('/it-IT/mock');
        }));

        it('should remove locale from url when default locale changes', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/mock']);
            tick();
            locale.setDefaultLocale('it', 'IT');
            tick();
            locale.setDefaultLocale('en', 'US');
            tick();

            expect(location.path()).toBe('/mock');
        }));

        it('should not keep localized url when goes back after the locale has changed', fakeAsync(() => {
            l10nLoader.load();
            tick();
            router.navigate(['/mock']);
            tick();
            locale.setDefaultLocale('it', 'IT');
            tick();
            location.back();

            expect(location.path()).toBe('/mock');
        }));

    });

});
