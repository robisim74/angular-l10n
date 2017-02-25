import { ElementRef, Renderer, AfterViewInit } from '@angular/core';

import { BFS } from './bfs';

export abstract class BaseDirective implements AfterViewInit {

    protected key: string;

    private element: any;
    private renderNode: any;
    private nodeValue: any;

    constructor(protected el: ElementRef, protected renderer: Renderer) { }

    public ngAfterViewInit(): void {
        this.element = this.el.nativeElement;
        this.renderNode = BFS.getTargetNode(this.element);
        this.nodeValue = this.renderNode != null ? <string>this.renderNode.nodeValue : null;

        if (this.element.childNodes.length > 0) {
            this.key = this.getText();
        } else if (this.element.value !== "undefined") {
            this.key = this.element.value;
        }

        if (!!this.key) {
            this.setup();
        }
    };

    protected abstract setup(): void;

    protected abstract replace(): void;

    protected setText(value: string): void {
        if (!!this.nodeValue) {
            this.renderer.setText(this.renderNode, this.nodeValue.replace(this.key, value));
        } else if (this.element.hasAttribute("value")) {
            this.renderer.setElementAttribute(this.element, "value", value);
        }
    }

    private getText(): string {
        return this.nodeValue != null ? this.nodeValue.trim() : null;
    }

}
