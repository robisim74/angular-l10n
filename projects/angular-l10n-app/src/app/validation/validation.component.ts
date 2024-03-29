import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { L10N_LOCALE, L10nLocale, L10nTranslationService, L10nValidation, L10nNumberFormatOptions, L10nTranslatePipe, L10nValidateNumberDirective, L10nNumberPipe } from 'angular-l10n';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    L10nTranslatePipe,
    L10nNumberPipe,
    L10nValidateNumberDirective
  ]
})
export class ValidationComponent implements OnInit {

  model = { decimal: null };

  options: L10nNumberFormatOptions = { digits: '1.2-2', useGrouping: false };
  minValue = -Math.round(Math.random() * 100000) / 100;
  maxValue = Math.round(Math.random() * 100000) / 100;

  parsedValue: number | null = null;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private translation: L10nTranslationService,
    private validation: L10nValidation
  ) { }

  ngOnInit() {
    this.translation.onChange().subscribe({
      next: () => {
        this.model.decimal = null;
        this.parsedValue = null;
      }
    });
  }

  onNumberSubmit(): void {
    this.parsedValue = this.validation.parseNumber(this.model.decimal, this.options);
  }

}
