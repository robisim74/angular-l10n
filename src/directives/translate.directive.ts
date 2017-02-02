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
        if (this.el.nativeElement.hasAttribute("value")) {
            this.key = this.el.nativeElement.getAttribute("value");
        } else if (this.el.nativeElement.hasChildNodes()) {
            this.key = this.getKey();
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
                if (this.renderNode) {
                    this.renderer.setText(this.renderNode, this.nodeValue.replace(this.key, value));
                } else {
                    this.renderer.setElementAttribute(this.el.nativeElement, "value", value);
                }
            }
        );
    }

    private getKey(): string {
        let element: any = this.el.nativeElement;
        for (let child1st of element.childNodes) {
            if (typeof child1st !== "undefined" && child1st.nodeValue != null) {
                this.assignNode(child1st);
                break;
            } else {
                for (let child2nd of child1st.childNodes) {
                    if (typeof child2nd !== "undefined" && child2nd.nodeValue != null) {
                        this.assignNode(child2nd);
                        break;
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
