import { Injectable } from '@angular/core';

import { L10nTranslationService } from './l10n-translation.service';
import { L10nRoutingService } from './l10n-routing.service';

/**
 * Implement this class-interface to init L10n.
 */
@Injectable() export abstract class L10nLoader {

    /**
     * This method must contain the logic to init L10n.
     */
    public abstract async init(): Promise<void>;

}

@Injectable() export class L10nDefaultLoader implements L10nLoader {

    constructor(private translation: L10nTranslationService) { }

    public async init(): Promise<void> {
        await this.translation.init();
    }

}

@Injectable() export class L10nRoutingLoader implements L10nLoader {

    constructor(private routing: L10nRoutingService, private translation: L10nTranslationService) { }

    public async init(): Promise<void> {
        await this.routing.init();
        await this.translation.init();
    }

}
