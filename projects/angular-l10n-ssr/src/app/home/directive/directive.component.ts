import { Component, inject } from '@angular/core';

import { L10N_LOCALE, L10nTranslateDirective, L10nDateDirective, L10nNumberDirective, L10nPluralDirective, L10nTimeAgoDirective } from 'angular-l10n';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  styleUrls: ['./directive.component.scss'],
  standalone: true,
  imports: [
    L10nTranslateDirective,
    L10nDateDirective,
    L10nTimeAgoDirective,
    L10nNumberDirective,
    L10nPluralDirective
  ],
  host: { ngSkipHydration: 'true' }
})
export class DirectiveComponent {

  locale = inject(L10N_LOCALE);

  today = Date.now();

}
