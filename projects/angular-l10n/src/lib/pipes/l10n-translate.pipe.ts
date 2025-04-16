import { Pipe, PipeTransform } from '@angular/core';

import { L10nAsyncPipe } from '../models/l10n-async-pipe';
import { L10nTranslationService } from '../services/l10n-translation.service';

@Pipe({
    name: 'translate',
    pure: true,
    standalone: true
})
export class L10nTranslatePipe implements PipeTransform {

    constructor(protected translation: L10nTranslationService) { }

    public transform(key: null, language: string, params?: any): null;
    public transform(key: "", language: string, params?: any): null;
    public transform(key: string, language: string, params?: any): string;
    public transform(key: any, language: string, params?: any): string | null {
        if (key == null || key === '') return null;

        return this.translation.translate(key, params, language);
    }

}

@Pipe({
    name: 'translateAsync',
    pure: false,
    standalone: true
})
export class L10nTranslateAsyncPipe extends L10nAsyncPipe implements PipeTransform {

    public transform(key: any, params?: any, language?: string): string | null {
        if (key == null || key === '') return null;

        return this.translation.translate(key, params, language);
    }

}
