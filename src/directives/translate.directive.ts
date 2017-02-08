import { Directive, ElementRef, Input, Renderer, AfterViewInit } from '@angular/core';

import { TranslationService } from '../services/translation.service';

@Directive({
    selector: '[translate]'
})
export class TranslateDirective implements AfterViewInit {

    @Input('translate') public params: string;

    private key: string;
    private renderNode: any;
    private nodeValue: string = "";

    constructor(public translation: TranslationService, private el: ElementRef, private renderer: Renderer) { }

    public ngAfterViewInit(): void {
        if (this.el.nativeElement.hasChildNodes()) {
            this.key = this.getKey();
        } else if (this.el.nativeElement.hasAttribute("value")) {
            this.key = this.el.nativeElement.getAttribute("value");
        }

        if (!!this.key) {
            this.replace();
            this.translation.translationChanged.subscribe(
                () => {
                    this.replace();
                }
            );
        }
    }

    protected replace(): void {
        this.translation.translateAsync(this.key, this.params).subscribe(
            (value: string) => {
                if (!!this.nodeValue) {
                    this.renderer.setText(this.renderNode, this.nodeValue.replace(this.key, value));
                } else if (this.el.nativeElement.hasAttribute("value")) {
                    this.renderer.setElementAttribute(this.el.nativeElement, "value", value);
                }
            }
        );
    }

    private getKey(): string {
        let element: any = this.el.nativeElement;
        for (let childOf1stLevel of element.childNodes) {
            if (typeof childOf1stLevel !== "undefined" && childOf1stLevel.nodeValue != null) {
                this.assignNode(childOf1stLevel);
                break;
            } else {
                for (let childOf2ndLevel of childOf1stLevel.childNodes) {
                    if (typeof childOf2ndLevel !== "undefined" && childOf2ndLevel.nodeValue != null) {
                        this.assignNode(childOf2ndLevel);
                        break;
                    } else {
                        for (let childOf3rdLevel of childOf2ndLevel.childNodes) {
                            if (typeof childOf3rdLevel !== "undefined" && childOf3rdLevel.nodeValue != null) {
                                this.assignNode(childOf3rdLevel);
                                break;
                            }
                        }
                    }
                }
            }
        }
        return this.nodeValue.trim();
    }

    private assignNode(node: any): void {
        this.renderNode = node;
        this.nodeValue = <string>node.nodeValue;
    }

}
