import {Component} from 'angular2/core';
// Services.
import {LocalizationService} from './services/localization.service';
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe';

@Component({
    template: `
            <!--advanced use component view-->

            <div class="container">

                <div class="row">

                    <div class="col-sm-6">

                        <samp>{{ 'DESCRIPTION' | translate }}</samp>

                    </div>

                </div>

            </div>
            `,
    providers: [LocalizationService, LocalizationPipe],
    pipes: [LocalizationPipe]
})

export class AdvancedUseComponent {

    // Instantiates a new LocalizationService for this component and for its descendants.
    constructor(public localizationAdvancedUse: LocalizationService) {

        this.localizationAdvancedUse.translationProvider('./resources/locale-advanced-use-'); // Required: initializes the translation provider with the given path prefix.
            
    }

}