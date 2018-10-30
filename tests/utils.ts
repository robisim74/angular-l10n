/* tslint:disable */
import { Component, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { TranslationProvider, Language, DefaultLocale, Currency, Timezone } from '../angular-l10n';

@Component({
    template: ``
})
export class MockComponent { }

@Component({
    template: `
        <p><em>should render translated text & trim spaces</em></p>
        <p l10nTranslate>
            {{ key }}
        </p>

        <p><em>should render translated text using parameters</em></p>
        <p [params]="{ user: username, NoMessages: messages.length }" l10nTranslate>User notifications</p>

        <p><em>should search the key</em></p>
        <p l10nTranslate>
            <em l10nTranslate>Title</em>
            <span>&nbsp;</span>
            Subtitle
        </p>
        <p l10nTranslate>
            Subtitle
            <span>&nbsp;</span>
            <em l10nTranslate>Title</em>
        </p>
        <a l10nTranslate>
            <div>
                <div></div>
                Title
            </div>
        </a>

        <p><em>should use value attribute</em></p>
        <input type="button" [value]="value" l10nTranslate>

        <p><em>should not use value attribute</em></p>
        <select>
            <option [value]="value" l10nTranslate>Select</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>

        <p><em>should use innerHTML attribute</em></p>
        <p [innerHTML]="innerHTML" l10nTranslate></p>

        <p><em>should render translated attributes</em></p>
        <p l10n-title title="Title" l10nTranslate></p>
        <p l10n-title title="User notifications" [params]="{ user: username, NoMessages: messages.length }" l10nTranslate></p>
        <p l10n-title title="Title" l10nTranslate>
            <span [params]="{ user: username, NoMessages: messages.length }" l10nTranslate>User notifications</span>
        </p>
    `
})
export class TranslateComponent {

    key: string = "Title";
    username: string = "robisim74";
    messages: string[] = ["Test1", "Test2"];
    value: string = "Insert";
    innerHTML: string = "Strong title";

    change() {
        this.key = "Subtitle";
        this.messages.push("Test3");
        this.value = "Select";
        this.innerHTML = "Strong subtitle";
    }

}

@Component({
    template: `
        <p><em>should render localized decimal number</em></p>
        <p l10nDecimal>{{ pi }}</p>
        <p digits="1.5-5" l10nDecimal>{{ pi }}</p>

        <p><em>should render localized percent number</em></p>
        <p l10nPercent>0.1</p>
        <p digits="1.1-1" l10nPercent>0.1</p>

        <p><em>should render localized currency</em></p>
        <p l10nCurrency>{{ asyncValue }}</p>
        <p [digits]="digits" currencyDisplay="symbol" l10nCurrency>{{ value }}</p>

        <p><em>should render localized attributes</em></p>
        <p l10n-title title="{{ pi }}" digits="1.5-5" l10nDecimal></p>
        <p l10n-title title="0.1" digits="1.1-1" l10nPercent></p>
        <p l10n-title title="{{ value }}" [digits]="digits" currencyDisplay="symbol" l10nCurrency></p>
    `
})
export class L10nNumberComponent {

    pi: number = 3.14159;
    asyncValue: number;
    value: number = 1234.5;
    digits: string = "1.2-2";

    change() {
        this.asyncValue = 1234.56;
        this.value = 1234.56;
        this.digits = "1.3-3";
    }

}

@Component({
    template: `
        <form>
            <input [digits]="digits"
                [minValue]="minValue"
                [maxValue]="maxValue"
                name="decimal"
                [(ngModel)]="decimal" l10nValidateNumber>
        </form>
    `
})
export class L10nNumberValidatorComponent {

    decimal: string;

    digits: string = "1.2-2";
    minValue: number = -1100;
    maxValue: number = 1100;

}

@Component({
    template: `
        <p><em>should render localized date</em></p>
        <p l10nDate>{{ day }}</p>
        <p format="shortDate" l10nDate>{{ day }}</p>

        <p><em>should render localized attributes</em></p>
        <p l10n-title title="{{ day }}" format="shortDate" l10nDate></p>
    `
})
export class L10nDateComponent {

    day: Date = new Date('4/19/2017');

}

@Component({
    template: `
        <p>{{ 'Title' | translate:lang }}</p>
    `
})
export class LanguageComponent {

    @Language() lang: string;

}

@Component({
    template: `
        <p>{{ day | l10nDate:defaultLocale }}</p>
    `
})
export class DefaultLocaleComponent {

    @DefaultLocale() defaultLocale: string;

    day: Date = new Date('5/8/2017');

}

@Component({
    template: `
        <p>{{ value | l10nCurrency:defaultLocale:currency:'symbol':'1.2-2' }}</p>
    `
})
export class CurrencyComponent {

    @DefaultLocale() defaultLocale: string;
    @Currency() currency: string;

    value: number = 1234.5;

}

@Component({
    template: `
        <p>{{ day | l10nDate:defaultLocale:'medium':timezone }}</p>
    `
})
export class TimezoneComponent {

    @DefaultLocale() defaultLocale: string;
    @Timezone() timezone: string;

    day: Date = new Date(Date.UTC(2017, 7, 29, 21, 41, 0));

}

@Injectable() export class CustomTranslationProvider implements TranslationProvider {

    constructor(private http: HttpClient) { }

    public getTranslation(language: string, args: any): Observable<any> {
        const url: string = args.path + language + ".json";

        return this.http.get(url);
    }

}
