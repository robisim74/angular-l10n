import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { L10nCache, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nCache', () => {
    let cache: L10nCache;
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
        cache = TestBed.inject(L10nCache);
    });
    it('should read from cache', () => {
        let request = cache.read('name', of({ KEY1: 'key1' }));
        request.subscribe({
            next: (value) => expect(value).toEqual(jasmine.objectContaining({ KEY1: 'key1' }))
        });
        request = cache.read('name', of({ KEY1: 'key1' }));
        request.subscribe({
            // It doesn't have to happen.
            next: () => expect(true).toBeFalse(),
            complete: () => expect(true).toBeTrue()
        });
    });
});
