import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { DefaultLocale } from './../../angular-l10n';
import {
    LocalizationModule,
    LocaleService
} from './../../angular-l10n';

describe('DefaultLocale decorator', () => {

    let comp: DefaultLocaleComponent;
    let fixture: ComponentFixture<DefaultLocaleComponent>;
    let des: DebugElement[];
    let els: HTMLElement[] = [];

    let locale: LocaleService;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [DefaultLocaleComponent],
            imports: [
                LocalizationModule.forRoot()
            ]
        }).createComponent(DefaultLocaleComponent);

        comp = fixture.componentInstance;
    });

    beforeEach((done) => {
        locale = TestBed.get(LocaleService);

        locale.addConfiguration()
            .disableStorage()
            .defineDefaultLocale('en', 'US');
        locale.init().then(() => done());
    });

    beforeEach(() => {
        fixture.detectChanges();
        des = fixture.debugElement.queryAll(By.css("p"));
        for (let i: number = 0; i < des.length; i++) {
            els.push(des[i].nativeElement);
        }
    });

    it('should render localized date', (() => {
        expect(els[0].textContent).toContain("May 8, 2017");
    }));

    it('should render localized date when default locale changes', fakeAsync(() => {
        locale.setDefaultLocale('it', 'IT');

        tick();
        fixture.detectChanges();
        els = [];
        for (let i: number = 0; i < des.length; i++) {
            els.push(des[i].nativeElement);
        }

        expect(els[0].textContent).toContain("8 mag 2017");
    }));

});

@Component({
    template: `
        <p>{{ day | localeDate:defaultLocale }}</p>
    `
})
class DefaultLocaleComponent {

    @DefaultLocale() defaultLocale: string;

    day: Date = new Date('5/8/2017');

}
