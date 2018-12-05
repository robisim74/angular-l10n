/* tslint:disable */
import { TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';

import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    StorageStrategy,
    LogLevel,
    Language,
    DefaultLocale
} from '../../src/angular-l10n';

@Component({
    template: `
        <p>{{ 'Title' | translate:lang }}</p>
        <p>{{ 'Title' | translate }}</p>
        <p>{{ 1.22 | l10nDecimal:defaultLocale:'1-2.1' }}</p>
    `
})
class LanguageComponent {

    @Language() lang: string;
    @DefaultLocale() defaultLocale: string

}

describe('Logger', () => {

    let comp: any;
    let fixture: ComponentFixture<LanguageComponent>;

    let l10nLoader: L10nLoader;

    const l10nConfig: L10nConfig = {
        logger: {
            level: LogLevel.Warn
        },
        locale: {
            language: 'en',
            storage: StorageStrategy.Disabled
        }
    };

    beforeAll(() => {
        spyOn(console, 'warn');
    });

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [LanguageComponent],
            imports: [
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig)
            ],
        }).createComponent(LanguageComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        l10nLoader = TestBed.get(L10nLoader);

        l10nLoader.load().then(() => done());
    });

    it('should log missing functions', fakeAsync(() => {
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith("angular-l10n (LanguageComponent): Missing 'ngOnInit' method: required by AoT compilation");
        expect(console.warn).toHaveBeenCalledWith("angular-l10n (TranslatePipe): Missing 'lang' parameter");

        comp.ngOnDestroy();
        expect(console.warn).toHaveBeenCalledWith("angular-l10n (LanguageComponent): Missing 'ngOnDestroy' method to cancel subscriptions: required by AoT compilation");
    }));

    it('should log invalid formats', fakeAsync(() => {
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith("angular-l10n (IntlFormatter): Invalid number format alias: the default format will be used");
    }));

});
