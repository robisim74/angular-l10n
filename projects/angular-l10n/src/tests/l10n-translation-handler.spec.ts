import { TestBed } from '@angular/core/testing';

import { L10nTranslationHandler, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nTranslationHandler', () => {
    describe('Default', () => {
        let translationHandler: L10nTranslationHandler;
        const config: L10nConfig = {};
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    L10nTranslationModule.forRoot(config)
                ]
            });
            translationHandler = TestBed.inject(L10nTranslationHandler);
        });
        it('should handle params', () => {
            expect(translationHandler.parseValue('greetings', { name: 'Robi' }, 'Hi {{name}}')).toEqual('Hi Robi');
        });
        it('should return the value', () => {
            expect(translationHandler.parseValue('title', null, 'Angular localization')).toEqual('Angular localization');
        });
    });
});
