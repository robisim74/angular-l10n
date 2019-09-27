import { TestBed } from '@angular/core/testing';

import { L10nTranslationLoader, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nTranslationLoader', () => {
    let translationLoader: L10nTranslationLoader;
    const mockAsset = {
        en: {
            title: 'Angular localization'
        }
    };
    const config: L10nConfig = {
        format: 'language',
        providers: [],
        keySeparator: '.',
        defaultLocale: { language: 'en' },
        schema: [
            { locale: { language: 'en' } }
        ]
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        });
        translationLoader = TestBed.inject(L10nTranslationLoader);
    });
    it('should get the translation', () => {
        translationLoader.get('en', { name: 'asset', asset: mockAsset }).subscribe({
            next: (value) => expect(value).toEqual(jasmine.objectContaining({
                title: 'Angular localization'
            }))
        });
    });
    it('should throw an error', () => {
        translationLoader.get('it', { name: 'asset', asset: mockAsset }).subscribe({
            error: (error) => expect(error).not.toBeNull()
        });
    });
});
