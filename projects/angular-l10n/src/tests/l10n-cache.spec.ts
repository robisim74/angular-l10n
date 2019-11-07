import { TestBed } from '@angular/core/testing';
import { from } from 'rxjs';

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
        const request = cache.read('name', from(['first', 'last']));
        request.subscribe();
        request.subscribe({
            next: (value) => expect(value).toEqual('last')
        });
    });
});
