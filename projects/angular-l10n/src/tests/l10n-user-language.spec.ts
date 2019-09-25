import { TestBed } from '@angular/core/testing';

import { L10nUserLanguage, L10nConfig, L10nTranslationModule } from '../public-api';

describe('L10nUserLanguage', () => {
    let userLanguage: L10nUserLanguage;
    const config: L10nConfig = {};
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                L10nTranslationModule.forRoot(config)
            ]
        });
        userLanguage = TestBed.inject(L10nUserLanguage);
    });
    it('should get the user language', async () => {
        await expectAsync(userLanguage.get()).toBeResolved();
    });
});
