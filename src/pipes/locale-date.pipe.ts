/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {isDate, isNumber, isPresent, DateWrapper, isBlank} from '@angular/common/src/facade/lang';
import {DateFormatter} from '@angular/common/src/facade/intl';
import {StringMapWrapper} from '@angular/common/src/facade/collection';
import {InvalidPipeArgumentException} from '@angular/common/src/pipes/invalid_pipe_argument_exception';

// Services.
import {LocaleService} from '../services/locale.service';

/**
 * 'localedate' pipe function.
 */
@Pipe({
  name: 'localedate',
  pure: true
})

/**
 * LocaleDatePipe class.
 * 
 * Getting the local date:
 * 
 * expression | localedate[:defaultLocale[:format]]
 * 
 * where 'expression' is a date object or a number (milliseconds since UTC epoch), 'defaultLocale' is the default locale and 'format' indicates which date/time components to include.
 * 
 * For example, to get the local date, add in the template:
 * 
 * {{ today | localedate:defaultLocale:'fullDate' }}
 * 
 * and include in the component:
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 * import {LocaleDatePipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *     ...
 *     pipes: [LocaleDatePipe]
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 *         ...
 *     }
 * 
 *     // Gets the default locale.
 *     get defaultLocale(): string {
 *
 *         return this.locale.getDefaultLocale();
 *      
 *     }
 * 
 * }
 * 
 * @author Roberto Simonetti
 * @see Angular 2 DatePipe for further information
 */
@Injectable() export class LocaleDatePipe implements PipeTransform {

  static ALIASES: { [key: string]: String } = {
    'medium': 'yMMMdjms',
    'short': 'yMdjm',
    'fullDate': 'yMMMMEEEEd',
    'longDate': 'yMMMMd',
    'mediumDate': 'yMMMd',
    'shortDate': 'yMd',
    'mediumTime': 'jms',
    'shortTime': 'jm'
  };

  constructor(public locale: LocaleService) { }

  /**
   * LocaleDatePipe transform method.
   * 
   * @param value The date to be localized
   * @param defaultLocale The default locale
   * @param pattern The format of the date
   * @return The locale date
   */
  transform(value: any, defaultLocale: string, pattern: string = 'mediumDate'): string {

    if (isBlank(value)) return null;

    if (!this.supports(value)) {

      throw new InvalidPipeArgumentException(LocaleDatePipe, value);

    }

    if (isNumber(value)) {

      value = DateWrapper.fromMillis(value);

    }

    if (StringMapWrapper.contains(LocaleDatePipe.ALIASES, pattern)) {

      pattern = <string>StringMapWrapper.get(LocaleDatePipe.ALIASES, pattern);

    }

    return DateFormatter.format(value, defaultLocale, pattern);

  }

  private supports(obj: any): boolean { return isDate(obj) || isNumber(obj); }

}