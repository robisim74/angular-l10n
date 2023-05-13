import { Component, inject } from '@angular/core';

import { L10N_LOCALE, L10nDatePipe, L10nNumberPipe, L10nPluralPipe, L10nTimeAgoPipe, L10nTranslatePipe } from 'angular-l10n';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  styleUrls: ['./pipe.component.scss'],
  standalone: true,
  imports: [
    L10nTranslatePipe,
    L10nDatePipe,
    L10nTimeAgoPipe,
    L10nNumberPipe,
    L10nPluralPipe
  ]
})
export class PipeComponent {

  locale = inject(L10N_LOCALE);

  today = Date.now();

}
