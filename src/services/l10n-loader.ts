import { Injectable, Inject, InjectionToken } from '@angular/core';

import { LOCALE_CONFIG, TRANSLATION_CONFIG, LocaleConfig, TranslationConfig } from '../models/l10n-config';
import { LocaleService } from '../services/locale.service';
import { TranslationService } from '../services/translation.service';

@Injectable() export class L10nLoader {

    constructor(
        @Inject(LOCALE_CONFIG) private localeConfig: LocaleConfig,
        @Inject(TRANSLATION_CONFIG) private translationConfig: TranslationConfig,
        private locale: LocaleService,
        private translation: TranslationService
    ) { }

    public async load(): Promise<void> {
        // LocaleService initialization.
        if (Object.keys(this.localeConfig).length > 0) {
            await this.locale.init();
        }
        // TranslationService initialization.
        if (Object.keys(this.translationConfig).length > 0) {
            await this.translation.init();
        }
    }

}
