import { ElementRef, Renderer, AfterViewInit } from '@angular/core';

import { LocaleService } from '../../services/locale.service';

export abstract class LocaleDirective implements AfterViewInit {

    protected value: string;
    protected renderNode: any;
    protected nodeValue: string = "";

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer) { }

    public ngAfterViewInit(): void {
        if (this.el.nativeElement.hasChildNodes()) {
            this.value = this.getValue();
        }

        if (!!this.value) {
            this.replace();
            this.locale.defaultLocaleChanged.subscribe(
                () => {
                    this.replace();
                }
            );
        }
    }

    protected abstract replace(): void;

    private getValue(): string {
        let firstChild: any = this.el.nativeElement.firstChild;
        if (typeof firstChild !== "undefined" && firstChild.nodeValue != null) {
            this.renderNode = firstChild;
            this.nodeValue = <string>firstChild.nodeValue;
        }
        return this.nodeValue.trim();
    }

}
