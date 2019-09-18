import { TestBed } from '@angular/core/testing';

import { L10nLoader, L10nTranslationService, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nLoader', () => {
    describe('Default', () => {
        let loader: L10nLoader;
        let translation: L10nTranslationService;
        const config: L10nConfig = {};
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    L10nTranslationModule.forRoot(config)
                ]
            });
            loader = TestBed.inject(L10nLoader);
            translation = TestBed.inject(L10nTranslationService);
            spyOn(translation, 'init').and.returnValue(Promise.resolve());
        });
        it('should call translation service', async () => {
            await loader.init();
            expect(translation.init).toHaveBeenCalled();
        });
    });
});
