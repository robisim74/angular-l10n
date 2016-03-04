import {Component} from 'angular2/core';
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe';

@Component({
    template: `
            <!--home component view-->

            <div class="container">

                <div class="row">

                    <div class="col-sm-6">

                        <blockquote class="blockquote-reverse">

                            <p>{{ 'DUMMY_TEXT' | translate }}</p>
                            <footer>{{ 'AUTHOR' | translate }},&nbsp;<cite title="Source Title">{{ 'SOURCE_TITLE' | translate }}</cite></footer>

                        </blockquote>

                    </div>

                </div>

            </div>
            `,
    pipes: [LocalizationPipe]
})

export class HomeComponent {

    constructor() { }

}
