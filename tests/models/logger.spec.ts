/* tslint:disable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
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
        <p>{{ 'title' | translate:lang }}</p>
        <p>{{ 'title' | translate }}</p>
        <p>{{ 1.22 | l10nDecimal:defaultLocale:'1-2.1' }}</p>
    `
})
class MockComponent {

    @Language() lang: string;
    @DefaultLocale() defaultLocale: string

}

describe('Logger', () => {

    let comp: any;
    let fixture: ComponentFixture<MockComponent>;

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
            declarations: [MockComponent],
            imports: [
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig)
            ],
        }).createComponent(MockComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        l10nLoader = TestBed.get(L10nLoader);

        l10nLoader.load().then(() => done());
    });

    it('should log missing functions', (() => {
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith("angular-l10n (MockComponent): Missing 'ngOnInit' method: required by AoT compilation");
        expect(console.warn).toHaveBeenCalledWith("angular-l10n (TranslatePipe): Missing 'lang' parameter");

        comp.ngOnDestroy();
        expect(console.warn).toHaveBeenCalledWith("angular-l10n (MockComponent): Missing 'ngOnDestroy' method to cancel subscriptions: required by AoT compilation");
    }));

    it('should log invalid formats', (() => {
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith("angular-l10n (IntlFormatter): Invalid number format alias: the default format will be used");
    }));

});
