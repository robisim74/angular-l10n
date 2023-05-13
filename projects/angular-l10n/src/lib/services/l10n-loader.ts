import { Injectable } from '@angular/core';

import { L10nTranslationService } from './l10n-translation.service';

/**
 * Implement this class-interface to init L10n.
 */
@Injectable() export abstract class L10nLoader {

    /**
     * This method must contain the logic to init L10n.
     */
    public abstract init(): Promise<void>;

}

@Injectable() export class L10nDefaultLoader implements L10nLoader {

    constructor(private translation: L10nTranslationService) { }

    public async init(): Promise<void> {
        await this.translation.init();
    }

}
