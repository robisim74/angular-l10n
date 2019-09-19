import { NgModule } from '@angular/core';

import { L10nDatePipe, L10nDateAsyncPipe } from '../pipes/l10n-date.pipe';
import { L10nNumberPipe, L10nNumberAsyncPipe } from '../pipes/l10n-number.pipe';
import { L10nTimeAgoPipe, L10nTimeAgoAsyncPipe } from '../pipes/l10n-time-ago.pipe';
import { L10nIntlService } from '../services/l10n-intl.service';

@NgModule({
    declarations: [
        L10nDatePipe,
        L10nNumberPipe,
        L10nTimeAgoPipe,
        L10nDateAsyncPipe,
        L10nNumberAsyncPipe,
        L10nTimeAgoAsyncPipe
    ],
    exports: [
        L10nDatePipe,
        L10nNumberPipe,
        L10nTimeAgoPipe,
        L10nDateAsyncPipe,
        L10nNumberAsyncPipe,
        L10nTimeAgoAsyncPipe
    ],
    providers: [L10nIntlService]
})
export class L10nIntlModule { }
