/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    LocalizationExtraModule,
    Collator,
    StorageStrategy
} from '../../src/angular-l10n';

describe('Collator', () => {

    let l10nLoader: L10nLoader;
    let collator: Collator;

    const translationIT: any = {
        "System Architect": "Progettista IT",
        "Accountant": "Ragioniere",
        "Junior Technical Author": "Scrittore tecnico Junior",
        "Senior Javascript Developer": "Programmatore Javascript Senior"
    };

    const l10nConfig: L10nConfig = {
        locale: {
            languages: [
                { code: 'it', dir: 'ltr' }
            ],
            language: 'it',
            storage: StorageStrategy.Disabled
        },
        translation: {
            translationData: [
                { languageCode: 'it', data: translationIT }
            ]
        }
    };

    const data: any = [
        { position: "System Architect" },
        { position: "Accountant" },
        { position: "Junior Technical Author" },
        { position: "Senior Javascript Developer" },
        { position: "Accountant" }
    ];

    beforeEach((done) => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                TranslationModule.forRoot(l10nConfig),
                LocalizationExtraModule
            ]
        });

        l10nLoader = TestBed.get(L10nLoader);
        collator = TestBed.get(Collator);

        l10nLoader.load().then(() => done());
    });

    it('should sort', (() => {
        const result: any[] = collator.sort(data, 'position');

        expect(result).toEqual(jasmine.objectContaining([
            { position: "System Architect" },
            { position: "Senior Javascript Developer" },
            { position: "Accountant" },
            { position: "Accountant" },
            { position: "Junior Technical Author" }
        ]));
    }));

    it('should search', (() => {
        const result: any[] = collator.search('pro', data, ['position'], { usage: 'search', sensitivity: 'base' });

        expect(result).toEqual(jasmine.objectContaining([
            { position: "System Architect" },
            { position: "Senior Javascript Developer" }
        ]));
    }));

});
