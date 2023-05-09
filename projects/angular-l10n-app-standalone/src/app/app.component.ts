import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { L10N_CONFIG, L10nConfig, L10N_LOCALE, L10nLocale, L10nTranslationService, formatLanguage, L10nTranslatePipe, L10nDisplayNamesDirective } from 'angular-l10n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    L10nTranslatePipe,
    L10nDisplayNamesDirective
  ]
})
export class AppComponent implements OnInit {

  /**
   * Handle page back/forward
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
      this.translation.init();
  }

  schema = this.l10nConfig.schema;

  pathLang = this.getPathLang();

  constructor(
      @Inject(L10N_LOCALE) public locale: L10nLocale,
      @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
      private translation: L10nTranslationService,
      private location: Location,
      private router: Router
  ) { }

  ngOnInit() {
      // Update path language
      this.translation.onChange().subscribe({
          next: () => {
              this.pathLang = this.getPathLang();
          }
      });

      this.translation.onChange().subscribe({
          next: (locale: L10nLocale) => {
              console.log(locale);
              console.log(this.translation.data);
          }
      });
      this.translation.onError().subscribe({
          next: (error: any) => {
              if (error) console.log(error);
          }
      });
  }

  /**
   * Replace the locale and navigate to the new URL
   */
  navigateByLocale(locale: L10nLocale) {
      let path = this.location.path();
      if (this.locale.language !== this.l10nConfig.defaultLocale.language) {
          if (locale.language !== this.l10nConfig.defaultLocale.language) {
              path = path.replace(`/${this.locale.language}`, `/${locale.language}`);
          } else {
              path = path.replace(`/${this.locale.language}`, '');
          }
      } else if (locale.language !== this.l10nConfig.defaultLocale.language) {
          path = `/${locale.language}${path}`;
      }

      this.router.navigate([path]).then(() => {
          this.translation.init();
      });
  }

  getPathLang() {
      return this.locale.language !== this.l10nConfig.defaultLocale.language ?
          formatLanguage(this.locale.language, this.l10nConfig.format) :
          '';
  }
}
