import { Injectable, Inject } from '@angular/core';

import { LOCALE_CONFIG, TRANSLATION_CONFIG, L10N_ROOT, LocaleConfig, TranslationConfig } from '../models/l10n-config';
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
        private locale: LocaleService,
        private translation: TranslationService
    ) { }

    /**
     * Loads l10n services.
     */
    public async load(): Promise<void> {
        // LocaleService initialization.
        if (this.l10nRoot) {
            if (Object.keys(this.localeConfig).length > 0) {
                await this.locale.init();
            }
        }
        // TranslationService initialization.
        if (Object.keys(this.translationConfig).length > 0) {
            await this.translation.init();
        }
    }

}
