import { Component, OnInit, Input, Inject } from '@angular/core';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
    selector: 'app-directive',
    templateUrl: './directive.component.html',
    styleUrls: ['./directive.component.scss']
})
export class DirectiveComponent implements OnInit {

    @Input() today: number;
    @Input() timeAgo: string;
    @Input() value: number;

    constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) {}

    ngOnInit() {
    }

}
