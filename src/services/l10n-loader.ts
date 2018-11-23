import { Injectable, Inject } from '@angular/core';

import { LOCALE_CONFIG, TRANSLATION_CONFIG, L10N_ROOT, LocaleConfig, TranslationConfig } from '../models/l10n-config';
import { LocalizedRouting } from '../models/localized-routing';
import { LocaleService } from '../services/locale.service';
import { TranslationService } from '../services/translation.service';

/**
 * Initializes the services.
 */
@Injectable() export class L10nLoader {

    constructor(
        @Inject(LOCALE_CONFIG) private localeConfig: LocaleConfig,
        @Inject(TRANSLATION_CONFIG) private translationConfig: TranslationConfig,
        @Inject(L10N_ROOT) private l10nRoot: boolean,
        private localizedRouting: LocalizedRouting,
        private locale: LocaleService,
        private translation: TranslationService
    ) { }

    /**
     * Loads l10n services.
     */
    public async load(): Promise<any> {
        // Root initialization.
        if (this.l10nRoot) {
            if (Object.keys(this.localeConfig).length > 0) {
                // LocalizedRouting initialization.
                this.localizedRouting.init();
                // LocaleService initialization.
                await this.locale.init();
            }
        }
        // TranslationService initialization.
        if (Object.keys(this.translationConfig).length > 0) {
            await this.translation.init()
                .catch((error: any) => { throw error; });
        }
    }

}
