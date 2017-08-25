import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm, AbstractControl } from '@angular/forms';
import { Component } from '@angular/core';

import { L10nNumberValidatorDirective } from './../../index';
import {
    L10nConfig,
    L10nLoader,
    LocalizationModule,
    LocaleValidationModule,
    LocaleService,
    StorageStrategy
} from './../../index';

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
        fixture.detectChanges();

        comp.decimal = "12.34";

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
        comp.decimal = "-123,45";

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
        comp.decimal = "123,45";

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

    it('should validate with thousand separator', async(() => {
        comp.decimal = "1.012,34";
        comp.maxValue = 1100;
        comp.digits = "4.2-2";

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

    it('should validate right to left', async(() => {
        locale.setDefaultLocale('ar', 'SA');

        comp.decimal = "٣٫١٤";

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

@Component({
    template: `
        <form>
            <input [l10nValidateNumber]="digits"
                [minValue]="minValue"
                [maxValue]="maxValue"
                name="decimal"
                [(ngModel)]="decimal">
        </form>
    `
})
class L10nNumberValidatorComponent {

    decimal: string;

    digits: string = "1.2-2";
    minValue: number = -100;
    maxValue: number = 100;

}
