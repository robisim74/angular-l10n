import { TestBed } from '@angular/core/testing';

import { L10nTranslationFallback, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nTranslationFallback', () => {
    describe('Default', () => {
        let translationFallback: L10nTranslationFallback;
        const i18nAsset = {
            en: {
                title: 'Angular localization',
                subtitle: 'The world is small'
            },
            'en-US': {
                subtitle: 'The world is small'
            }
        };
        const config: L10nConfig = {};
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    L10nTranslationModule.forRoot(config)
                ]
            });
            translationFallback = TestBed.inject(L10nTranslationFallback);
        });
        it('should get the loaders', () => {
            const loaders = translationFallback.get('en-US', { name: 'asset', asset: i18nAsset });
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
});
