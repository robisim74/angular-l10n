import { Directive, Input, AfterViewInit, OnChanges, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getTargetNode } from './bfs';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Directive()
export abstract class L10nDirective implements AfterViewInit, OnChanges, OnDestroy {

    @Input() public value: string;

    @Input() public innerHTML: string;

    @Input() public language: string;

    private text: string;
    private attributes: any[];

    private element: HTMLElement;
    private renderNode: HTMLElement;
    private nodeValue: string;

    private textObserver: MutationObserver;

    private destroy = new Subject<boolean>();

    constructor(protected el: ElementRef, protected renderer: Renderer2, protected translation: L10nTranslationService) { }

    public ngAfterViewInit(): void {
        if (this.el && this.el.nativeElement) {
            this.element = this.el.nativeElement;
            this.renderNode = getTargetNode(this.element);
            this.text = this.getText();
            this.attributes = this.getAttributes();
            this.addTextListener();

            if (this.language) {
                this.replaceText()
                this.replaceAttributes();
            } else {
                this.addTranslationListener();
            }
        }
    }

    public ngOnChanges(): void {
        if (this.text) {
            if (this.nodeValue == null || this.nodeValue === '') {
                if (this.value) {
                    this.text = this.value;
                } else if (this.innerHTML) {
                    this.text = this.innerHTML;
                }
            }
            this.replaceText();
        }
        if (this.attributes && this.attributes.length > 0) {
            this.replaceAttributes();
        }
    }

    public ngOnDestroy(): void {
        this.destroy.next(true);
        this.removeTextListener();
    }

    protected abstract getValue(text: string): string;

    private getText(): string {
        let text = '';
        if (this.element.childNodes.length > 0) {
            text = this.getNodeValue();
        } else if (this.value) {
            text = this.value;
        } else if (this.innerHTML) {
            text = this.innerHTML;
        }
        return text;
    }

    private getNodeValue(): string {
        this.nodeValue = this.renderNode != null && this.renderNode.nodeValue != null ? this.renderNode.nodeValue : '';
        return this.nodeValue ? this.nodeValue.trim() : '';
    }

    private getAttributes(): any[] {
        const attributes: any[] = [];
        if (this.element.attributes) {
            for (const attr of Array.from(this.element.attributes)) {
                if (attr && attr.name) {
                    const [, name = ''] = attr.name.match(/^l10n-(.+)$/) || [];
                    if (name) {
                        const targetAttr = Array.from(this.element.attributes).find(a => a.name === name);
                        if (targetAttr) attributes.push({ name: targetAttr.name, value: targetAttr.value });
                    }
                }
            }
        }
        return attributes;
    }

    private addTextListener(): void {
        if (typeof MutationObserver !== 'undefined') {
            this.textObserver = new MutationObserver(() => {
                this.renderNode = getTargetNode(this.element);
                this.text = this.getText();
                this.replaceText();
            });
            this.textObserver.observe(this.renderNode, { subtree: true, characterData: true });
        }
    }

    private removeTextListener(): void {
        if (typeof this.textObserver !== 'undefined') {
            this.textObserver.disconnect();
        }
    }

    private addTranslationListener(): void {
        this.translation.onChange().pipe(takeUntil(this.destroy)).subscribe({
            next: () => {
                this.replaceText();
                this.replaceAttributes();
            }
        });
    }

    private replaceText(): void {
        if (this.text) {
            this.setText(this.getValue(this.text));
        }
    }

    private replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesValues());
        }
    }

    private setText(value: string): void {
        if (value) {
            if (this.nodeValue && this.text) {
                this.removeTextListener();
                this.renderer.setValue(this.renderNode, this.nodeValue.replace(this.text, value));
                this.addTextListener();
            } else if (this.value) {
                this.renderer.setAttribute(this.element, 'value', value);
            } else if (this.innerHTML) {
                this.renderer.setProperty(this.element, 'innerHTML', value);
            }
        }
    }

    private setAttributes(data: any): void {
        for (const attr of this.attributes) {
            this.renderer.setAttribute(this.element, attr.name, data[attr.value]);
        }
    }

    private getAttributesValues(): any {
        const values = this.attributes.map(attr => attr.value);
        const data: any = {};
        for (const value of values) {
            data[value] = this.getValue(value);
        }
        return data;
    }

}
