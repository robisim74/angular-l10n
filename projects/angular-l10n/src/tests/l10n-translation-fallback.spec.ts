import { TestBed } from '@angular/core/testing';

import { L10nTranslationFallback, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nTranslationFallback', () => {
    let translationFallback: L10nTranslationFallback;
    const mockAsset = {
        en: {
            title: 'Angular localization',
            subtitle: 'The world is small'
        },
        'en-US': {
            subtitle: 'The world is small'
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
        translationFallback = TestBed.inject(L10nTranslationFallback);
    });
    it('should get the loaders', () => {
        const loaders = translationFallback.get('en-US', { name: 'asset', asset: mockAsset });
        expect(loaders.length).toEqual(2);
        loaders[0].subscribe({
            next: (value) => expect(value).toEqual(jasmine.objectContaining({
                title: 'Angular localization',
                subtitle: 'The world is small'
            }))
        });
        loaders[1].subscribe({
            next: (value) => expect(value).toEqual(jasmine.objectContaining({
                subtitle: 'The world is small'
            }))
        });
    });
});
