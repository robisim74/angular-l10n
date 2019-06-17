import { NgModule } from '@angular/core';

import { L10nTimeAgoPipe } from '../pipes/l10n-time-ago.pipe';
import { L10nTimeAgoDirective } from '../directives/l10n-time-ago.directive';

import { Collator } from '../services/collator';

/**
 * Provides extra dependencies, pipes & directives.
 */
@NgModule({
    declarations: [
        L10nTimeAgoPipe,
        L10nTimeAgoDirective
    ],
    exports: [
        L10nTimeAgoPipe,
        L10nTimeAgoDirective
    ],
    providers: [Collator]
})
export class LocalizationExtraModule { }
