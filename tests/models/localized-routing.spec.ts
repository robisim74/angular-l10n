/* tslint:disable */
import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
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

@Component({
    template: ``
})
class MockComponent { }

describe('LocalizedRouting', () => {

    const routes: Route[] = [
        { path: '', redirectTo: 'mock', pathMatch: 'full' },
        { path: 'mock', component: MockComponent },
        { path: 'otherMock', component: MockComponent },
        { path: '**', redirectTo: 'mock' }
    ];

    describe('Navigation', () => {

        let fixture: ComponentFixture<MockComponent>;

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
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: []
            },
            localizedRouting: {
                format: [ISOCode.Language, ISOCode.Country]
            }
        };

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
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
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.initialNavigation();
                    tick();

                    expect(location.path()).toBe('/en-US/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should replace url when navigation ends', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/otherMock']);
                    tick();

                    expect(location.path()).toBe('/en-US/otherMock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should replace url when default locale changes', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/mock']);
                    tick();
                    locale.setDefaultLocale('it', 'IT');
                    tick();

                    expect(location.path()).toBe('/it-IT/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should keep localized url when goes back', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/mock']);
                    tick();
                    router.navigate(['/otherMock']);
                    tick();
                    location.back();

                    expect(location.path()).toBe('/en-US/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should keep url query params', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigateByUrl('/mock?id=1');
                    tick();

                    expect(location.path()).toBe('/en-US/mock?id=1');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should redirect wildcard route', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/wildcard']);
                    tick();

                    expect(location.path()).toBe('/en-US/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

    });

    describe('Default routing', () => {

        let fixture: ComponentFixture<MockComponent>;

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
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: []
            },
            localizedRouting: {
                format: [ISOCode.Language, ISOCode.Country],
                defaultRouting: true
            }
        };

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
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
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.initialNavigation();
                    tick();

                    expect(location.path()).toBe('/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should not replace url when navigation ends', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/otherMock']);
                    tick();

                    expect(location.path()).toBe('/otherMock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should replace url when default locale changes', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/mock']);
                    tick();
                    locale.setDefaultLocale('it', 'IT');
                    tick();

                    expect(location.path()).toBe('/it-IT/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

        it('should remove locale from url when default locale changes', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.navigate(['/mock']);
                    tick();
                    locale.setDefaultLocale('it', 'IT');
                    tick();
                    locale.setDefaultLocale('en', 'US');
                    tick();

                    expect(location.path()).toBe('/mock');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

    });

    describe('Schema', () => {

        let fixture: ComponentFixture<MockComponent>;

        let l10nLoader: L10nLoader;
        let locale: LocaleService;

        let router: Router;
        let location: Location;

        let spyLocation: SpyLocation;

        const l10nConfig: L10nConfig = {
            locale: {
                languages: [
                    { code: 'en', dir: 'ltr' },
                    { code: 'it', dir: 'ltr' }
                ],
                defaultLocale: { languageCode: 'en', countryCode: 'US' },
                currency: 'USD',
                storage: StorageStrategy.Disabled
            },
            translation: {
                providers: []
            },
            localizedRouting: {
                format: [ISOCode.Language, ISOCode.Country],
                schema: [
                    { text: 'United States', languageCode: 'en', countryCode: 'US', currency: 'USD' },
                    { text: 'Italia', languageCode: 'it', countryCode: 'IT', currency: 'EUR' },
                ]
            }
        };

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
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

            spyLocation = <SpyLocation>location;
            spyLocation.setInitialPath('/it-IT/mock');
        });

        it('should use schema values when app starts', fakeAsync(() => {
            if (fixture.ngZone) {
                fixture.ngZone.run(() => {
                    l10nLoader.load();
                    tick();
                    router.initialNavigation();
                    tick();

                    expect(locale.getCurrentLocale()).toBe('it-IT');
                    expect(locale.getCurrentCurrency()).toBe('EUR');
                });
            } else {
                console.warn('Test not executed');
            }
        }));

    });

});
