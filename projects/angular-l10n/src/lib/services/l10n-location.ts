import { Injectable, Injector, Inject } from '@angular/core';
import { Location } from '@angular/common';

import { formatLanguage } from '../models/utils';
import { L10N_CONFIG, L10nConfig } from '../models/l10n-config';

/**
 * Implement this class-interface to change the localized path.
 */
@Injectable() export abstract class L10nLocation {

    /**
     * This method must contain the logic to get the path.
     * @return The path
     */
    public abstract path(): string;

    /**
     * This method must contain the logic to parse the path.
     * @param path The path to be parsed
     * @return The value of language
     */
    public abstract parsePath(path: string): string | null;

    /**
     * This method must contain the logic toget the localized segment in the path.
     * @param path The localized path
     */
    public abstract getLocalizedSegment(path: string): string | null;

    /**
     * This method must contain the logic to localize the path.
     * @param language The language to add to the path
     * @param path The path to be localized
     */
    public abstract toLocalizedPath(language: string, path: string): string;
}

@Injectable() export class L10nDefaultLocation implements L10nLocation {

    private get location(): Location {
        return this.injector.get(Location);
    }

    constructor(@Inject(L10N_CONFIG) private config: L10nConfig, private injector: Injector) { }

    public path(): string {
        return this.location.path(true);
    }

    public parsePath(path: string): string | null {
        if (!path) return null;

        const segment = this.getLocalizedSegment(path);
        if (segment != null) {
            const language = segment.replace(/\//g, '');
            return language;
        }

        return null;
    }

    public getLocalizedSegment(path: string): string | null {
        for (const element of this.config.schema) {
            const language = formatLanguage(element.locale.language, this.config.format);
            const regex = new RegExp(`(\/${language}\/)|(\/${language}$)|(\/${language}?)`);
            const segments = path.match(regex);
            if (segments != null) {
                return segments[0];
            }
        }
        return null;
    }

    public toLocalizedPath(language: string, path: string): string {
        const segment = this.getLocalizedSegment(path);
        if (segment != null && segment.includes(language)) return path;

        return Location.stripTrailingSlash('/' + language + path);
    }

}
