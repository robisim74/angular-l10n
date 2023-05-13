import { Component, inject } from '@angular/core';

import { L10N_LOCALE } from 'angular-l10n';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  styleUrls: ['./pipe.component.scss']
})
export class PipeComponent {

  locale = inject(L10N_LOCALE);

  today = Date.now();

}
