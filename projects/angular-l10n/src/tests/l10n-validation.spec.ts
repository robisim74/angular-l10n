import { TestBed } from '@angular/core/testing';

import { L10nValidation, L10nConfig, L10nTranslationModule, L10nValidationModule } from '../public-api';

describe('L10nValidation', () => {
    let validation: L10nValidation;
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
                L10nTranslationModule.forRoot(config),
                L10nValidationModule.forRoot()
            ]
        });
        validation = TestBed.inject(L10nValidation);
    });
    it('should parse a number', () => {
        expect(validation.parseNumber('1')).toBeNull();
    });
    it('should parse a date', () => {
        expect(validation.parseDate('9/19/2019')).toBeNull();
    });
});
