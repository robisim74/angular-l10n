import { TestBed } from '@angular/core/testing';

import { L10nStorage, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nStorage', () => {
    describe('Default', () => {
        let storage: L10nStorage;
        const config: L10nConfig = {};
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    L10nTranslationModule.forRoot(config)
                ]
            });
            storage = TestBed.inject(L10nStorage);
        });
        it('should write the storage', async () => {
            await expectAsync(storage.write({ language: '' })).toBeResolved();
        });
        it('should read from storage', async () => {
            await expectAsync(storage.read()).toBeResolvedTo(null);
        });

    });
});
