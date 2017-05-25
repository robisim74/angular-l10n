import { Pipe, PipeTransform } from '@angular/core';

import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'translate',
    pure: true
})
export class TranslatePipe implements PipeTransform {

    constructor(protected translation: TranslationService) { }

    public transform(key: string, lang: string, args?: any): string {
        return this.translation.translate(key, args, lang);
    }

}
