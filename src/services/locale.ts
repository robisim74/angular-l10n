/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

// Services.
import { LocaleService } from './locale.service';
import { LocalizationService } from './localization.service';

/**
 * Locale superclass.
 * Provides the updates for localization.
 * 
 * Extend this class in components to provide lang, defaultLocale & currency to the pipes.
 * 
 * @author Roberto Simonetti
 */
export class Locale {

    /**
     * Language code of the LocalizationService.
     */
    public lang: string;

    /**
     * The default locale.
     */
    public defaultLocale: string;

    /**
     * The current currency.
     */
    public currency: string;

    constructor(public locale?: LocaleService, public localization?: LocalizationService) {

        if (this.localization != null) {

            this.lang = this.localization.languageCode;

            // When the language changes, subscribes to the event & updates lang property.
            this.localization.translationChanged.subscribe(

                // Generator or next.
                (language: string) => { this.lang = language; }

            );

        }

        if (this.locale != null) {

            this.defaultLocale = this.locale.getDefaultLocale();

            // When the default locale changes, subscribes to the event & updates defaultLocale property.
            this.locale.defaultLocaleChanged.subscribe(

                // Generator or next.
                (defaultLocale: string) => { this.defaultLocale = defaultLocale; }

            );

            this.currency = this.locale.getCurrentCurrency();

            // When the currency changes, subscribes to the event & updates currency property.
            this.locale.currencyCodeChanged.subscribe(

                // Generator or next.
                (currency: string) => { this.currency = currency; }

            );

        }

    }

}
