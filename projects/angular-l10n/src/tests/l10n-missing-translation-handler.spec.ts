import { TestBed } from '@angular/core/testing';

import { L10nMissingTranslationHandler, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nMissingTranslationHandler', () => {
    let missingTranslationHandler: L10nMissingTranslationHandler;
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
        missingTranslationHandler = TestBed.inject(L10nMissingTranslationHandler);
    });
    it('should handle missing values', () => {
        expect(missingTranslationHandler.handle('TITLE')).toEqual('TITLE');
    });
});
