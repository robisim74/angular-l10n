import { Injectable, Inject } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";

import { TranslationService } from "./translation.service";
import { L10N_CONFIG, L10nConfigRef } from "../models/l10n-config";

@Injectable() export class SearchService {

    constructor(
        @Inject(L10N_CONFIG) private configuration: L10nConfigRef,
        private translation: TranslationService,
        private title: Title,
        private meta: Meta
    ) { }

    public updateHead(page: string): void {
        this.translation.translationChanged().subscribe(
            () => {
                this.setTitle(page);
                if (this.configuration.search.metaTags) {
                    for (const name of this.configuration.search.metaTags) {
                        this.updateTag(name, page);
                    }
                }
            });
    }

    private setTitle(page: string): void {
        this.title.setTitle(this.translation.translate(page + (this.configuration.translation.composedKeySeparator || '') + 'title'));
    }

    private updateTag(name: string, page: string): void {
        this.meta.updateTag(
            {
                name: name,
                content: this.translation.translate(page + (this.configuration.translation.composedKeySeparator || '') + name)
            }
        );
    }

}
