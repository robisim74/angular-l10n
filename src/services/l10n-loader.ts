import { Injectable } from '@angular/core';

import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';
import { LocalizedRouting } from '../models/localized-routing';

/**
 * Initializes the services.
 */
@Injectable() export abstract class L10nLoader {

    /**
     * Loads l10n services.
     */
    public abstract async load(): Promise<any>;

}

@Injectable() export class LocaleLoader implements L10nLoader {

    constructor(private locale: LocaleService, private translation: TranslationService) { }

    public async load(): Promise<any> {
        await this.locale.init();
        await this.translation.init()
            .catch((error: any) => { throw error; });
    }

}

@Injectable() export class TranslationLoader implements L10nLoader {

    constructor(private translation: TranslationService) { }

    public async load(): Promise<any> {
        await this.translation.init()
            .catch((error: any) => { throw error; });
    }

}

@Injectable() export class LocalizedRoutingLoader implements L10nLoader {

    constructor(private localizedRouting: LocalizedRouting, private locale: LocaleService, private translation: TranslationService) { }

    public async load(): Promise<any> {
        this.localizedRouting.init();
        await this.locale.init();
        await this.translation.init()
            .catch((error: any) => { throw error; });
    }

}
