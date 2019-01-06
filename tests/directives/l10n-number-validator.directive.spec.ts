/* tslint:disable */
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm, AbstractControl, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

import {
    l10nValidateNumber,
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleValidationModule,
    LocaleService,
    StorageStrategy
} from '../../src/angular-l10n';

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
class L10nNumberValidatorComponent {

    decimal: string;

    digits: string = "1.2-2";
    minValue: number = -1100;
    maxValue: number = 1100;

}

describe('L10nNumberValidatorDirective', () => {

    let comp: L10nNumberValidatorComponent;
    let fixture: ComponentFixture<L10nNumberValidatorComponent>;

    let l10nLoader: L10nLoader;
    let locale: LocaleService;

    const l10nConfig: L10nConfig = {
        locale: {
            defaultLocale: { languageCode: 'it', countryCode: 'IT' },
            storage: StorageStrategy.Disabled
        }
    };

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [L10nNumberValidatorComponent],
            imports: [
                FormsModule,
                HttpClientTestingModule,
                LocalizationModule.forRoot(l10nConfig),
                LocaleValidationModule.forRoot()
            ]
        }).createComponent(L10nNumberValidatorComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        l10nLoader = TestBed.get(L10nLoader);
        locale = TestBed.get(LocaleService);

        l10nLoader.load().then(() => done());
    });

    it('should validate format', async(() => {
        comp.decimal = "12.34";
        comp.digits = "1.2-2";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            const control: AbstractControl | null = form.control.get('decimal');

            if (control) {
                expect(control.valid).toBe(false);
                expect(control.hasError('format')).toBe(true);
                expect(control.hasError('minValue')).toBe(false);
                expect(control.hasError('maxValue')).toBe(false);
            } else {
                throw new Error("Control is null");
            }
        });
    }));

    it('should validate minValue', async(() => {
        comp.decimal = "-1234,56";
        comp.digits = "1.2-2";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            const control: AbstractControl | null = form.control.get('decimal');

            if (control) {
                expect(control.valid).toBe(false);
                expect(control.hasError('format')).toBe(false);
                expect(control.hasError('minValue')).toBe(true);
                expect(control.hasError('maxValue')).toBe(false);
            } else {
                throw new Error("Control is null");
            }
        });
    }));

    it('should validate maxValue', async(() => {
        comp.decimal = "1234,56";
        comp.digits = "1.2-2";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            const control: AbstractControl | null = form.control.get('decimal');

            if (control) {
                expect(control.valid).toBe(false);
                expect(control.hasError('format')).toBe(false);
                expect(control.hasError('minValue')).toBe(false);
                expect(control.hasError('maxValue')).toBe(true);
            } else {
                throw new Error("Control is null");
            }
        });
    }));

    it('should validate', async(() => {
        comp.decimal = "12,34";
        comp.digits = "1.2-2";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            const control: AbstractControl | null = form.control.get('decimal');

            if (control) {
                expect(control.valid).toBe(true);
                expect(control.hasError('format')).toBe(false);
                expect(control.hasError('minValue')).toBe(false);
                expect(control.hasError('maxValue')).toBe(false);
            } else {
                throw new Error("Control is null");
            }
        });
    }));

    it('should validate decimal & thousand separators', () => {
        let control: FormControl;

        // Valid.
        control = new FormControl('12', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('12,34', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('12,3', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('12,', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('0,12', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('12', [l10nValidateNumber('1.0-0')]);
        expect(control.valid).toBe(true);
        control = new FormControl('1.012,34', [l10nValidateNumber('1.2-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('1.012.012,34', [l10nValidateNumber('1.2-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('1.012', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('1.012,34', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('1.012', [l10nValidateNumber('1.0-0')]);
        expect(control.valid).toBe(true);
        control = new FormControl('012,34', [l10nValidateNumber('3.2-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('01.012,34', [l10nValidateNumber('5.2-2')]);
        expect(control.valid).toBe(true);
        control = new FormControl('-12,34', [l10nValidateNumber('1.0-2', -1100)]);
        expect(control.valid).toBe(true);
        control = new FormControl('-1.012,34', [l10nValidateNumber('1.0-2', -1100)]);
        expect(control.valid).toBe(true);

        // Invalid.
        control = new FormControl('1.012,345', [l10nValidateNumber('1.2-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('0.012,34', [l10nValidateNumber('1.2-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('1..012,34', [l10nValidateNumber('1.2-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('10121.012,34', [l10nValidateNumber('1.2-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('012,34', [l10nValidateNumber('4.2-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('1.012,34', [l10nValidateNumber('5.2-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('1.012', [l10nValidateNumber('5.0-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('1.01', [l10nValidateNumber('1.0-2')]);
        expect(control.valid).toBe(false);
        control = new FormControl('1,01', [l10nValidateNumber('1.0-0')]);
        expect(control.valid).toBe(false);

    });

    it('should validate right to left', async(() => {
        locale.setDefaultLocale('ar', 'SA');

        comp.decimal = "٣٫١٤";
        comp.digits = "1.2-2";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            const control: AbstractControl | null = form.control.get('decimal');

            if (control) {
                expect(control.valid).toBe(true);
                expect(control.hasError('format')).toBe(false);
                expect(control.hasError('minValue')).toBe(false);
                expect(control.hasError('maxValue')).toBe(false);
            } else {
                throw new Error("Control is null");
            }
        });
    }));

});
