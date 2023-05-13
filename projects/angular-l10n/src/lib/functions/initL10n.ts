import { L10nTranslationService } from '../services/l10n-translation.service';

export function initL10n(translation: L10nTranslationService): () => Promise<void> {
    return () => translation.init();
}
