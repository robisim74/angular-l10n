import { Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslationService } from '../services/translation.service';

@Component({
    selector: 'l10n-json-ld',
    template: ''
})
export class L10nJsonLdComponent implements OnInit, OnDestroy {

    @Input() path: string;

    @HostBinding('innerHTML') jsonLD: SafeHtml;

    destroy: Subject<boolean> = new Subject<boolean>();

    constructor(private translation: TranslationService, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.translation.translationChanged().pipe(takeUntil(this.destroy)).subscribe(
            () => {
                const schema: any = this.translation.translate(this.path);
                this.jsonLD = schema ? this.sanitize(schema) : "";
            });

    }

    ngOnDestroy(): void {
        this.destroy.next(true);
    }

    sanitize(schema: any): SafeHtml {
        const json: string = JSON.stringify(schema, null, 2);
        const html: string = `<script type="application/ld+json">${json}</script>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
