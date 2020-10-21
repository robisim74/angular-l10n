import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Component, Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

import { L10nLoader, L10nTranslationService, L10nConfig, L10nTranslationModule, L10nRoutingModule, L10nUserLanguage, L10nLocation } from '../public-api';

@Component({
    template: ``
})
class MockComponent { }

@Injectable() export class UserLanguage implements L10nUserLanguage {

    public get(): Promise<string | null> {
        return Promise.resolve(null);
    }

}

describe('L10nLocation', () => {
    const mockAsset = {
        'en-US': {
            title: 'Angular localization',
        },
        'it-IT': {
            title: 'Localizzazione in Angular'
        }
    };
    const routes: Route[] = [
        { path: '', redirectTo: 'mock1', pathMatch: 'full' },
        { path: 'mock1', component: MockComponent },
        { path: 'mock2', component: MockComponent },
        { path: '**', redirectTo: 'mock1' }
    ];
    describe('Path', () => {
        let fixture: ComponentFixture<MockComponent>;
        let loader: L10nLoader;
        let translation: L10nTranslationService;
        let router: Router;
        let location: L10nLocation;
        const config: L10nConfig = {
            format: 'language-region',
            providers: [
                { name: 'asset', asset: mockAsset }
            ],
            keySeparator: '.',
            defaultLocale: { language: 'en-US', currency: 'USD' },
            schema: [
                { locale: { language: 'en-US', currency: 'USD' } },
                { locale: { language: 'it-IT', currency: 'EUR' } },
            ]
        };
        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                declarations: [MockComponent],
                imports: [
                    RouterTestingModule.withRoutes(routes),
                    L10nTranslationModule.forRoot(config, {
                        userLanguage: UserLanguage
                    }),
                    L10nRoutingModule.forRoot()
                ]
            }).createComponent(MockComponent);
            loader = TestBed.inject(L10nLoader);
            translation = TestBed.inject(L10nTranslationService);
            router = TestBed.inject(Router);
            location = TestBed.inject(L10nLocation);
        });
        it('should get the path', fakeAsync(() => {
            fixture.ngZone.run(() => {
                loader.init();
                tick();
                router.initialNavigation();
                tick();
                expect(location.path()).toBe('/en-US/mock1');
            });
        }));
        it('should parse the path', () => {
            expect(location.parsePath('/en-US/mock1')).toBe('en-US');
        });
        it('should get localized segment', () => {
            expect(location.getLocalizedSegment('/en-US/mock1')).toBe('/en-US/');
        });
        it('should get localized segment when root url', () => {
            expect(location.getLocalizedSegment('/en-US')).toBe('/en-US');
        });
        it('should get localized segment when root url with query string', () => {
            expect(location.getLocalizedSegment('/en-US?aaa=111')).toBe('/en-US');
        });
        it('should get localized segment with query string', () => {
            expect(location.getLocalizedSegment('/en-US/mock1/?aaa=111')).toBe('/en-US/');
        });
        it('should localize the path', () => {
            expect(location.toLocalizedPath('it-IT', '/mock1')).toBe('/it-IT/mock1');
        });
    });
});
