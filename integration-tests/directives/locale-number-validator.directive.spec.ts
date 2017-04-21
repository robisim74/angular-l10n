import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
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

        locale = TestBed.get(LocaleService);

        locale.addConfiguration()
            .disableStorage()
            .defineDefaultLocale('it', 'IT');
        locale.init();

        fixture.detectChanges();
    });

    it('should validate format', async(() => {
        comp.decimal = "12.34";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            let control = form.control.get('decimal');

            expect(control.valid).toBe(false);
            expect(control.hasError('format')).toBe(true);
            expect(control.hasError('minValue')).toBe(false);
            expect(control.hasError('maxValue')).toBe(false);
        });
    }));

    it('should validate minValue', async(() => {
        comp.decimal = "-123,45";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            let control = form.control.get('decimal');

            expect(control.valid).toBe(false);
            expect(control.hasError('format')).toBe(false);
            expect(control.hasError('minValue')).toBe(true);
            expect(control.hasError('maxValue')).toBe(false);
        });
    }));

    it('should validate maxValue', async(() => {
        comp.decimal = "123,45";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            let control = form.control.get('decimal');

            expect(control.valid).toBe(false);
            expect(control.hasError('format')).toBe(false);
            expect(control.hasError('minValue')).toBe(false);
            expect(control.hasError('maxValue')).toBe(true);
        });
    }));

    it('should validate', async(() => {
        comp.decimal = "12,34";

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
            let control = form.control.get('decimal');

            expect(control.valid).toBe(true);
            expect(control.hasError('format')).toBe(false);
            expect(control.hasError('minValue')).toBe(false);
            expect(control.hasError('maxValue')).toBe(false);
        });
    }));

});

@Component({
    template: `
        <form>
            <input [validateLocaleNumber]="digits" [minValue]="minValue" [maxValue]="maxValue" name="decimal" [(ngModel)]="decimal">
        </form>
    `
})
class LocaleNumberValidatorComponent {

    decimal: string;

    digits: string = "1.2-2";
    minValue: number = -100
    maxValue: number = 100;

}
