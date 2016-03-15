import {Component} from 'angular2/core';
// Services.
import {LocalizationService} from './services/localization.service';
// Pipes.
import {LocalizationPipe} from './pipes/localization.pipe';

@Component({
    templateUrl: './app/i18n.component.html',
    providers: [LocalizationService, LocalizationPipe],
    pipes: [LocalizationPipe]
})

export class I18nComponent {

    message: string = "";

    gender: string = "female";
    inviteMapping: any = {
        'male': 'INVITE_HIM',
        'female': 'INVITE_HER'
    }

    messages: any = [];
    messageMapping: any = {
        '=0': 'NO_MESSAGES',
        '=1': 'ONE_MESSAGE',
        'other': '# MESSAGES'
    }

    // Instantiates a new LocalizationService for this component and for its descendants.
    constructor(public localizationI18n: LocalizationService) {

        this.localizationI18n.translationProvider('./resources/locale-i18n-'); // Required: initializes the translation provider with the given path prefix.

    }

    addMessage(message: string) {

        this.messages.push(message);
        this.message = "";

    }

}