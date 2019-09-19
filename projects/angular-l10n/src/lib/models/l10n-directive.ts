import { Input, AfterViewInit, OnChanges, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getTargetNode } from './bfs';
import { L10nTranslationService } from '../services/l10n-translation.service';

export abstract class L10nDirective implements AfterViewInit, OnChanges, OnDestroy {

    @Input() public value: string;

    @Input() public innerHTML: string;

    protected text: string;
    protected attributes: any[] = [];

    protected destroy = new Subject<boolean>();

    private element: any;
    private renderNode: any;
    private nodeValue: string;

    private textObserver: MutationObserver;

    private readonly TEXT_MUTATION_CONFIG = { subtree: true, characterData: true };

    private readonly SELECTOR = /^l10n-/;

    constructor(protected el: ElementRef, protected renderer: Renderer2, protected translation: L10nTranslationService) { }

    public ngAfterViewInit(): void {
        if (this.el && this.el.nativeElement) {
            this.element = this.el.nativeElement;
            this.renderNode = getTargetNode(this.element);
            this.getText();
            this.getAttributes();
            this.addTextListener();
            this.setup();
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
        if (this.attributes.length > 0) {
            this.replaceAttributes();
        }
    }

    public ngOnDestroy(): void {
        this.destroy.next(true);
        this.removeTextListener();
    }

    protected abstract getValue(text: string): string;

    private getText(): void {
        if (this.element.childNodes.length > 0) {
            this.text = this.getNodeValue();
        } else if (this.value) {
            this.text = this.value;
        } else if (this.innerHTML) {
            this.text = this.innerHTML;
        }
    }

    private getNodeValue(): string {
        this.nodeValue = this.renderNode != null ? this.renderNode.nodeValue as string : '';
        return this.nodeValue ? this.nodeValue.trim() : '';
    }

    private getAttributes(): void {
        if (this.element.attributes) {
            for (const attr of this.element.attributes) {
                if (attr && this.SELECTOR.test(attr.name)) {
                    const name = attr.name.substr(5);
                    for (const targetAttr of this.element.attributes) {
                        if (new RegExp('^' + name + '$').test(targetAttr.name)) {
                            this.attributes.push({ name, key: targetAttr.value });
                        }
                    }
                }
            }
        }
    }

    private addTextListener(): void {
        if (typeof MutationObserver !== 'undefined') {
            this.textObserver = new MutationObserver(() => {
                this.renderNode = getTargetNode(this.element);
                this.getText();
                this.replaceText();
            });
            this.textObserver.observe(this.renderNode, this.TEXT_MUTATION_CONFIG);
        }
    }

    private removeTextListener(): void {
        if (typeof this.textObserver !== 'undefined') {
            this.textObserver.disconnect();
        }
    }

    private setup(): void {
        this.translation.onChange().pipe(takeUntil(this.destroy)).subscribe({
            next: () => this.replace()
        });
    }

    private replace(): void {
        this.replaceText();
        this.replaceAttributes();
    }

    private replaceText(): void {
        if (this.text) {
            this.setText(this.getValue(this.text));
        }
    }

    private replaceAttributes(): void {
        if (this.attributes.length > 0) {
            this.setAttributes(this.getAttributesData());
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
            this.renderer.setAttribute(this.element, attr.name, data[attr.key]);
        }
    }

    private getAttributesData(): any {
        const keys = this.getAttributesKeys();
        const data: any = {};
        for (const key of keys) {
            data[key] = this.getValue(key);
        }
        return data;
    }

    private getAttributesKeys(): string[] {
        return this.attributes.map((attr: any) => attr.key);
    }

}
