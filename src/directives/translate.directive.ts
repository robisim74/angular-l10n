/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { Directive, ElementRef, Input, Renderer, AfterViewInit } from '@angular/core';

// Services.
import { LocalizationService } from '../services/localization.service';
import { LocaleService } from '../services/locale.service';
import { I18nPlural } from '../services/i18n';

@Directive({
    selector: '[translate]'
})

/**
 * TranslateDirective class.
 * Translate by an attribute directive.
 * 
 * @author Roberto Simonetti
 */
export class TranslateDirective extends I18nPlural implements AfterViewInit {

    @Input('translate') params: string;

    constructor(public localization: LocalizationService, public locale: LocaleService, private el: ElementRef, private renderer: Renderer) {
        super(locale);
    }

    ngAfterViewInit(): void {

        let renderNode: any = this.el.nativeElement.childNodes[0];
        let key: string = <string>renderNode.nodeValue;

        // Looks for a number at the beginning of the key. 
        key = this.translateNumber(key);

        this.translate(renderNode, key);

        this.localization.translationChanged.subscribe(
            () => {
                this.translate(renderNode, key);
            }
        );

    }

    private translate(renderNode: any, key: string): void {

        this.localization.translateAsync(this.keyStr, this.params).subscribe(
            (value: string) => {
                this.renderer.setText(renderNode, key.replace(this.keyStr, value));
            }
        );

    }

}
