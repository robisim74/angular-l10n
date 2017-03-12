import {
    ElementRef,
    Input,
    Renderer,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';

import { BFS } from './bfs';

export abstract class BaseDirective implements AfterViewInit, OnChanges, OnDestroy {

    @Input() set value(valueAttribute: string) {
        this.valueAttribute = valueAttribute;
    }

    protected key: string;

    private element: any;
    private renderNode: any;
    private nodeValue: string;

    private textObserver: MutationObserver;

    private valueAttribute: string;

    private readonly MUTATION_CONFIG: any = { subtree: true, characterData: true };

    constructor(protected el: ElementRef, protected renderer: Renderer) { }

    public ngAfterViewInit(): void {
        this.element = this.el.nativeElement;

        // Target node is a text type node.
        this.renderNode = BFS.getTargetNode(this.element);

        this.getKey();
        if (!!this.key) {
            this.setup();
        }
    };

    public ngOnChanges(changes: SimpleChanges): void {
        if (!!this.key) {
            if (this.element.childNodes.length == 0 && !!this.valueAttribute) {
                this.key = this.valueAttribute;
            }
            this.replace();
        }
    }

    public ngOnDestroy(): void {
        this.removeTextListener();
    }

    protected abstract setup(): void;

    protected abstract replace(): void;

    protected setText(value: string): void {
        if (!!this.nodeValue) {
            this.removeTextListener();
            this.renderer.setText(this.renderNode, this.nodeValue.replace(this.key, value));
            this.addTextListener();
        } else if (!!this.valueAttribute) {
            this.renderer.setElementAttribute(this.element, "value", value);
        }
    }

    private addTextListener(): void {
        this.textObserver = new MutationObserver((mutations: any) => {
            this.getKey();
            if (!!this.key) {
                this.replace();
            }
        });
        this.textObserver.observe(this.renderNode, this.MUTATION_CONFIG);
    }

    private removeTextListener(): void {
        if (typeof this.textObserver != "undefined") {
            this.textObserver.disconnect();
        }
    }

    private getText(): string {
        this.nodeValue = this.renderNode != null ? <string>this.renderNode.nodeValue : null;
        return this.nodeValue != null ? this.nodeValue.trim() : null;
    }

    private getKey(): void {
        if (this.element.childNodes.length > 0) {
            this.key = this.getText();
        } else if (!!this.valueAttribute) {
            this.key = this.valueAttribute;
        }
    }

}
