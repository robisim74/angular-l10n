import { Pipe, PipeTransform } from '@angular/core';

import { TranslationService } from '../services/translation.service';
import { Logger } from '../models/logger';

@Pipe({
    name: 'translate',
    pure: true
})
export class TranslatePipe implements PipeTransform {

    constructor(protected translation: TranslationService) { }

    public transform(key: string, lang: string, args?: any): string {
        if (typeof lang === "undefined") Logger.log('TranslatePipe', 'missingLang');

        return this.translation.translate(key, args, lang);
    }

}
