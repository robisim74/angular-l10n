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

    @Input('value') public valueAttribute: string;

    @Input('innerHTML') public innerHTMLProperty: string;

    protected key: string;
    protected attributes: any[] = [];

    protected subscriptions: ISubscription[] = [];

    private element: any;
    private renderNode: any;
    private nodeValue: string;

    private textObserver: MutationObserver;

    private readonly TEXT_MUTATION_CONFIG: any = { subtree: true, characterData: true };

    private readonly SELECTOR: RegExp = /^l10n-/;

    constructor(protected el: ElementRef, protected renderer: Renderer2) { }

    public ngAfterViewInit(): void {
        if (this.el && this.el.nativeElement) {
            this.element = this.el.nativeElement;

            this.renderNode = BFS.getTargetNode(this.element);

            this.getKey();
            this.getAttributes();

            this.addTextListener();

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
            this.replaceText();
        }
        if (this.attributes.length > 0) {
            this.replaceAttributes();
        }
    }

    public ngOnDestroy(): void {
        this.removeTextListener();
        this.cancelSubscriptions();
    }

    protected abstract setup(): void;

    protected abstract replace(): void;

    protected abstract replaceText(): void;

    protected abstract replaceAttributes(): void;

    protected getAttributesData(): any {
        const keys: string[] = this.getAttributesKeys();
        const data: any = {};
        for (const key of keys) {
            data[key] = this.getValues(key);
        }
        return data;
    }

    protected getAttributesKeys(): string[] {
        return this.attributes.map((attr: any) => attr.key);
    }

    protected abstract getValues(keys: string | string[]): string | any;

    protected setText(value: string): void {
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

    protected setAttributes(data: any): void {
        for (const attr of this.attributes) {
            this.renderer.setAttribute(this.element, attr.name, data[attr.key]);
        }
    }

    private addTextListener(): void {
        if (typeof MutationObserver !== "undefined") {
            this.textObserver = new MutationObserver((mutations: MutationRecord[]) => {
                this.renderNode = BFS.getTargetNode(this.element);
                this.getKey();
                this.replaceText();
            });
            this.textObserver.observe(this.renderNode, this.TEXT_MUTATION_CONFIG);
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

    private getAttributes(): void {
        if (this.element.attributes) {
            for (const attr of this.element.attributes) {
                if (this.SELECTOR.test(attr.name)) {
                    const name: string = attr.name.substr(5);
                    for (const targetAttr of this.element.attributes) {
                        if (new RegExp("^" + name + "$").test(targetAttr.name)) {
                            this.attributes.push({ name: name, key: targetAttr.value });
                        }
                    }
                }
            }
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
