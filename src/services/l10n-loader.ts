import { Injectable } from '@angular/core';

import { LocalizedRouting } from '../models/localized-routing';
import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';

export function initLocalizedRouting(
    localizedRouting: LocalizedRouting,
    locale: LocaleService,
    translation: TranslationService
): L10nLoader {
    return {
        load: async () => {
            localizedRouting.init();
            await locale.init();
            await translation.init()
                .catch((error: any) => { throw error; });
        }
    };
}

export function initLocale(locale: LocaleService, translation: TranslationService): L10nLoader {
    return {
        load: async () => {
            await locale.init();
            await translation.init()
                .catch((error: any) => { throw error; });
        }
    };
}

export function initTranslation(translation: TranslationService): L10nLoader {
    return {
        load: async () => {
            await translation.init()
                .catch((error: any) => { throw error; });
        }
    };
}

/**
 * Initializes the services.
 */
@Injectable() export abstract class L10nLoader {

    /**
     * Loads l10n services.
     */
    public abstract async load(): Promise<any>;

}
