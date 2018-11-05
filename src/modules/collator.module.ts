import { NgModule, ModuleWithProviders } from '@angular/core';

import { Collator } from '../services/collator';

/**
 * Provides dependencies for sorting and filtering a list by locales.
 */
@NgModule({
    providers: [Collator]
})
export class CollatorModule { }
