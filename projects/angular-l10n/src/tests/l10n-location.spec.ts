import { TestBed } from '@angular/core/testing';

import { L10nConfig, L10nTranslationModule, L10nLocation, L10nRoutingModule } from '../public-api';

describe('L10nLocation', () => {
    describe('Path', () => {
        let location: L10nLocation;
        const config: L10nConfig = {
            format: 'language-region',
            providers: [],
            keySeparator: '.',
            defaultLocale: { language: 'en-US', currency: 'USD' },
            schema: [
                { locale: { language: 'en-US', currency: 'USD' } },
                { locale: { language: 'it-IT', currency: 'EUR' } },
            ]
        };
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    L10nTranslationModule.forRoot(config),
                    L10nRoutingModule.forRoot()
                ]
            });
            location = TestBed.inject(L10nLocation);
        });
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
            expect(location.getLocalizedSegment('/en-US?id=1')).toBe('/en-US');
        });
        it('should get localized segment when root url with fragment', () => {
            expect(location.getLocalizedSegment('/en-US#1')).toBe('/en-US');
        });
        it('should get localized segment with query string', () => {
            expect(location.getLocalizedSegment('/en-US/mock1/?id=1')).toBe('/en-US/');
        });
        it('should localize the path', () => {
            expect(location.toLocalizedPath('it-IT', '/mock1')).toBe('/it-IT/mock1');
        });
    });
});
