import {
    ElementRef,
    Input,
    Renderer2,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { BFS } from './bfs';

export abstract class BaseDirective implements AfterViewInit, OnChanges, OnDestroy {

    @Input() set value(valueAttribute: string) {
        this.valueAttribute = valueAttribute;
    }
    @Input() set innerHTML(innerHTMLProperty: string) {
        this.innerHTMLProperty = innerHTMLProperty;
    }

    protected key: string;

    protected subscriptions: ISubscription[] = [];

    private element: any;
    private renderNode: any;
    private nodeValue: string;

    private textObserver: MutationObserver;

    private valueAttribute: string;
    private innerHTMLProperty: string;

    private readonly MUTATION_CONFIG: any = { subtree: true, characterData: true };

    constructor(protected el: ElementRef, protected renderer: Renderer2) { }

    public ngAfterViewInit(): void {
        this.element = this.el.nativeElement;

        // Target node is a text type node.
        this.renderNode = BFS.getTargetNode(this.element);

        this.getKey();
        if (!!this.key) {
            this.setup();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!!this.key) {
            if (this.nodeValue == null || this.nodeValue == "") {
                if (!!this.valueAttribute) {
                    this.key = this.valueAttribute;
                } else if (!!this.innerHTMLProperty) {
                    this.key = this.innerHTMLProperty;
                }
            }
            this.replace();
        }
    }

    public ngOnDestroy(): void {
        this.removeTextListener();
        this.cancelSubscriptions();
    }

    protected abstract setup(): void;

    protected abstract replace(): void;

    protected setText(value: string | null): void {
        if (!!value) {
            if (!!this.nodeValue && !!this.key) {
                this.removeTextListener();
                this.renderer.setValue(this.renderNode, this.nodeValue.replace(this.key, value));
                this.addTextListener();
            } else if (!!this.valueAttribute) {
                this.renderer.setAttribute(this.element, "value", value);
            } else if (!!this.innerHTMLProperty) {
                this.renderer.setProperty(this.element, "innerHTML", value);
            }
        }
    }

    private addTextListener(): void {
        if (typeof MutationObserver !== "undefined") {
            this.textObserver = new MutationObserver((mutations: any) => {
                this.getKey();
                if (!!this.key) {
                    this.replace();
                }
            });
            this.textObserver.observe(this.renderNode, this.MUTATION_CONFIG);
        }
    }

    private removeTextListener(): void {
        if (typeof this.textObserver !== "undefined") {
            this.textObserver.disconnect();
        }
    }

    private getText(): string {
        this.nodeValue = this.renderNode != null ? this.renderNode.nodeValue as string : "";
        return !!this.nodeValue ? this.nodeValue.trim() : "";
    }

    private getKey(): void {
        if (this.element.childNodes.length > 0) {
            this.key = this.getText();
        } else if (!!this.valueAttribute) {
            this.key = this.valueAttribute;
        } else if (!!this.innerHTMLProperty) {
            this.key = this.innerHTMLProperty;
        }
    }

    private cancelSubscriptions(): void {
        this.subscriptions.forEach((subscription: ISubscription) => {
            if (typeof subscription !== "undefined") {
                subscription.unsubscribe();
            }
        });
    }

}
