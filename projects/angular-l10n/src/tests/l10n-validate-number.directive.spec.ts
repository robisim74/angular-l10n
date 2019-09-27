import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { Injectable, Inject, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import {
    L10nLoader,
    L10nConfig,
    L10nTranslationModule,
    L10nValidationModule,
    L10nValidation,
    L10N_LOCALE,
    L10nLocale,
    L10nNumberFormatOptions,
    L10nDateTimeFormatOptions,
    parseDigits
} from '../public-api';

@Injectable() class LocaleValidation implements L10nValidation {
    constructor(@Inject(L10N_LOCALE) private locale: L10nLocale) { }
    public parseNumber(value: string, options?: L10nNumberFormatOptions, language = this.locale.language): number | null {
        if (value === '' || value == null) return null;
        let format = { minimumIntegerDigits: 1, minimumFractionDigits: 0, maximumFractionDigits: 0 };
        if (options && options.digits) {
            format = { ...format, ...parseDigits(options.digits) };
        }
        switch (language) {
            default:
                const pattern = `^-?[\\d]{${format.minimumIntegerDigits},}(\\.[\\d]{${format.minimumFractionDigits},${format.maximumFractionDigits}})?$`;
                const regex = new RegExp(pattern);
                return regex.test(value) ? parseFloat(value) : null;
        }
    }
    public parseDate(value: string, options?: L10nDateTimeFormatOptions, language = this.locale.language): Date | null {
        return null;
    }
}

@Component({
    template: `
        <form #form="ngForm">
            <input [options]="options"
                [minValue]="minValue"
                [maxValue]="maxValue"
                name="decimal"
                [(ngModel)]="value" l10nValidateNumber>
        </form>
    `
})
class MockComponent {
    @ViewChild(NgForm, { static: false }) ngForm: NgForm;
    value: string;
    options = { digits: '1.2-2' };
    minValue = -1100;
    maxValue = 1100;
}

describe('L10nValidateNumberDirective', () => {
    let fixture: ComponentFixture<MockComponent>;
    let comp: MockComponent;
    let loader: L10nLoader;
    const config: L10nConfig = {
        format: 'language-region',
        providers: [],
        keySeparator: '.',
        defaultLocale: { language: 'it-IT' },
        schema: [
            { locale: { language: 'it-IT' } }
        ]
    };
    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [MockComponent],
            imports: [
                FormsModule,
                L10nTranslationModule.forRoot(config),
                L10nValidationModule.forRoot({ validation: LocaleValidation })
            ]
        }).createComponent(MockComponent);
        comp = fixture.componentInstance;
        loader = TestBed.inject(L10nLoader);
        await loader.init();
    });
    it('should validate format', async(() => {
        comp.value = '12,34';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const control = comp.ngForm.control.get('decimal');
            expect(control.valid).toBe(false);
            expect(control.hasError('format')).toBe(true);
            expect(control.hasError('minValue')).toBe(false);
            expect(control.hasError('maxValue')).toBe(false);
        });
    }));
    it('should validate minValue', async(() => {
        comp.value = '-1234.56';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const control = comp.ngForm.control.get('decimal');
            expect(control.valid).toBe(false);
            expect(control.hasError('format')).toBe(false);
            expect(control.hasError('minValue')).toBe(true);
            expect(control.hasError('maxValue')).toBe(false);
        });
    }));
    it('should validate maxValue', async(() => {
        comp.value = '1234.56';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const control = comp.ngForm.control.get('decimal');
            expect(control.valid).toBe(false);
            expect(control.hasError('format')).toBe(false);
            expect(control.hasError('minValue')).toBe(false);
            expect(control.hasError('maxValue')).toBe(true);
        });
    }));
    it('should validate', async(() => {
        comp.value = '12.34';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const control = comp.ngForm.control.get('decimal');
            expect(control.valid).toBe(true);
            expect(control.hasError('format')).toBe(false);
            expect(control.hasError('minValue')).toBe(false);
            expect(control.hasError('maxValue')).toBe(false);
        });
    }));
});
