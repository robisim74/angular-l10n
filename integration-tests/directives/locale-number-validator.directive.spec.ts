import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FormsModule, NgForm, AbstractControl } from '@angular/forms';
import { Component } from '@angular/core';

import { LocaleNumberValidatorDirective } from './../../index';
import {
    LocalizationModule,
    LocaleValidationModule,
    LocaleService
} from './../../index';

describe('LocaleNumberValidatorDirective', () => {

    let comp: LocaleNumberValidatorComponent;
    let fixture: ComponentFixture<LocaleNumberValidatorComponent>;

    let locale: LocaleService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [LocaleNumberValidatorComponent],
            imports: [
                FormsModule,
                LocalizationModule.forRoot(),
                LocaleValidationModule.forRoot()
            ]
        }).createComponent(LocaleNumberValidatorComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        locale = TestBed.get(LocaleService);

        locale.addConfiguration()
            .disableStorage()
            .defineDefaultLocale('it', 'IT');
        locale.init().then(() => done());
    });

    it('should validate format', async(() => {
        fixture.detectChanges();

        comp.decimal = "12.34";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

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
            fixture.detectChanges();

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
            fixture.detectChanges();

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
            fixture.detectChanges();

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
            fixture.detectChanges();

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
class LocaleNumberValidatorComponent {

    decimal: string;

    digits: string = "1.2-2";
    minValue: number = -100;
    maxValue: number = 100;

}
