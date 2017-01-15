/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import { ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// Services.
import { LocaleService } from '../services/locale.service';
import { IntlSupport } from '../services/Intl-support';

/**
 * I18nPlural superclass.
 * 
 * @author Roberto Simonetti
 */
export class I18nPlural {

    protected keyStr: string;

    private readonly REGEXP: RegExp = /^\d+\b/;

    constructor(public locale: LocaleService) { }

    protected translateNumber(key: string): string {

        this.keyStr = key;

        if (this.REGEXP.exec(key) != null) {

            // Tries to extract the number.
            let keyNum: number = parseFloat(key);

            // Tries to extract the string. 
            this.keyStr = key.replace(this.REGEXP, "");
            this.keyStr = this.keyStr.trim();

            // Checks the number & support for Intl.
            if (!isNaN(keyNum) && IntlSupport.NumberFormat(this.locale.getDefaultLocale()) == true) {

                let localeDecimal: DecimalPipe = new DecimalPipe(this.locale.getDefaultLocale());

                // Localizes the number.
                key = key.replace(/^\d+/, localeDecimal.transform(keyNum, '1.0-3'));

            }

        }

        return key;

    }

}

/**
 * LocaleDirective superclass.
 * 
 * @author Roberto Simonetti
 */
export abstract class LocaleDirective implements AfterViewInit {

    constructor(public locale: LocaleService, protected el: ElementRef, protected renderer: Renderer) { }

    ngAfterViewInit(): void {

        let renderNode: any = this.el.nativeElement.childNodes[0];
        let nodeValue: string = <string>renderNode.nodeValue;
        let value: string = nodeValue.trim();

        this.localize(renderNode, nodeValue, value);

        this.locale.defaultLocaleChanged.subscribe(
            () => {
                this.localize(renderNode, nodeValue, value);
            }
        );

    }

    protected abstract localize(renderNode: any, nodeValue: string, value: string): void;

}
