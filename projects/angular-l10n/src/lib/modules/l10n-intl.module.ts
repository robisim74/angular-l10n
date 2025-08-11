import { ModuleWithProviders, NgModule } from '@angular/core';

import { L10nDatePipe, L10nDateAsyncPipe } from '../pipes/l10n-date.pipe';
import { L10nNumberPipe, L10nNumberAsyncPipe } from '../pipes/l10n-number.pipe';
import { L10nTimeAgoPipe, L10nTimeAgoAsyncPipe } from '../pipes/l10n-time-ago.pipe';
import { L10nPluralPipe, L10nPluralAsyncPipe } from '../pipes/l10n-plural.pipe';
import { L10nDisplayNamesPipe, L10nDisplayNamesAsyncPipe } from '../pipes/l10n-display-names.pipe';
import { L10nDateDirective } from '../directives/l10n-date.directive';
import { L10nNumberDirective } from '../directives/l10n-number.directive';
import { L10nTimeAgoDirective } from '../directives/l10n-time-ago.directive';
import { L10nPluralDirective } from '../directives/l10n-plural.directive';
import { L10nDisplayNamesDirective } from '../directives/l10n-display-names.directive';
import { L10nIntlService } from '../services/l10n-intl.service';

@NgModule({
    imports: [
        L10nDatePipe,
        L10nNumberPipe,
        L10nTimeAgoPipe,
        L10nPluralPipe,
        L10nDisplayNamesPipe,
        L10nDateAsyncPipe,
        L10nNumberAsyncPipe,
        L10nTimeAgoAsyncPipe,
        L10nPluralAsyncPipe,
        L10nDisplayNamesAsyncPipe,
        L10nDateDirective,
        L10nNumberDirective,
        L10nTimeAgoDirective,
        L10nPluralDirective,
        L10nDisplayNamesDirective
    ],
    exports: [
        L10nDatePipe,
        L10nNumberPipe,
        L10nTimeAgoPipe,
        L10nPluralPipe,
        L10nDisplayNamesPipe,
        L10nDateAsyncPipe,
        L10nNumberAsyncPipe,
        L10nTimeAgoAsyncPipe,
        L10nPluralAsyncPipe,
        L10nDisplayNamesAsyncPipe,
        L10nDateDirective,
        L10nNumberDirective,
        L10nTimeAgoDirective,
        L10nPluralDirective,
        L10nDisplayNamesDirective
    ],
})
export class L10nIntlModule { 

    public static forRoot(): ModuleWithProviders<L10nIntlModule> {
        return {
            ngModule: L10nIntlModule,
            providers: [L10nIntlService]
        };
    }

}
