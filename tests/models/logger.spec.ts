/* tslint:disable */
import { TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';

import {
    L10nConfig,
    L10nLoader,
    TranslationModule,
    StorageStrategy,
    LogLevel,
    Language
} from '../../src/angular-l10n';


@Component({
    template: `
        <p>{{ 'Title' | translate:lang }}</p>
        <p>{{ 'Title' | translate }}</p>
    `
})
class LanguageComponent {

    @Language() lang: string;

}

describe('Logger', () => {

    let comp: any;
    let fixture: ComponentFixture<LanguageComponent>;

    let l10nLoader: L10nLoader;

    const l10nConfig: L10nConfig = {
        locale: {
            language: 'en',
            storage: StorageStrategy.Disabled,
            logger: LogLevel.Warn
        }
    };

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [LanguageComponent],
            imports: [
                HttpClientTestingModule,
                TranslationModule.forRoot(l10nConfig)
            ]
        }).createComponent(LanguageComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        l10nLoader = TestBed.get(L10nLoader);

        spyOn(console, 'warn');

        l10nLoader.load().then(() => done());
    });

    it('should log missing parts', fakeAsync(() => {
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith('angular-l10n - L10nLoader: missing translation configuration');
        expect(console.warn).toHaveBeenCalledWith('angular-l10n - LanguageComponent: missing ngOnInit method: required by AoT compilation');
        expect(console.warn).toHaveBeenCalledWith('angular-l10n - TranslatePipe: missing lang parameter');

        comp.ngOnDestroy();
        expect(console.warn).toHaveBeenCalledWith('angular-l10n - LanguageComponent: missing ngOnDestroy method to cancel subscriptions: required by AoT compilation');
    }));

});
