import { Component, inject } from '@angular/core';

import { L10N_LOCALE, L10nTranslatePipe } from 'angular-l10n';

import { PipeComponent } from './pipe/pipe.component';
import { DirectiveComponent } from './directive/directive.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        L10nTranslatePipe,
        PipeComponent,
        DirectiveComponent
    ]
})
export class HomeComponent {

    locale = inject(L10N_LOCALE);

}
