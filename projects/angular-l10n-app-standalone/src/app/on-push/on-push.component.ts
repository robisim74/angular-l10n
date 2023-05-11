import { Component, ChangeDetectionStrategy } from '@angular/core';

import { L10nTranslateAsyncPipe } from 'angular-l10n';

@Component({
    selector: 'app-on-push',
    templateUrl: './on-push.component.html',
    styleUrls: ['./on-push.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        L10nTranslateAsyncPipe
    ]
})
export class OnPushComponent { }
