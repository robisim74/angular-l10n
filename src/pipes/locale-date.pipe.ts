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
  pure: false // Required to update the value.
})

/**
 * LocaleDatePipe class.
 * An instance of this class is created for each 'localedate' pipe function.
 * 
 * Getting the local date:
 * 
 * expression | localedate[:format]
 * 
 * where 'expression' is a date object or a number (milliseconds since UTC epoch) and 'format' indicates which date/time components to include.
 * 
 * For example, to get the local date, add in the template:
 * 
 * {{ today | localedate:'fullDate' }}
 * 
 * and include LocaleDatePipe in the component:
 * 
 * import {LocaleDatePipe} from 'angular2localization/angular2localization';
 * 
 * @Component({
 *      ...
 *      pipes: [LocaleDatePipe]
 * })
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

  /**
   * The default locale for LocaleDatePipe.
   */
  private defaultLocale: string;

  /**
   * The value of LocaleDatePipe.
   */
  private value: any;

  /**
   * The locale date for the value.
   */
  private localeDate: string;

  constructor(public locale: LocaleService) { }

  /**
   * LocaleDatePipe transform method.
   * 
   * @param value The date to be localized
   * @param pattern The format of the date
   * @return The locale date
   */
  transform(value: any, pattern: string = 'mediumDate'): string {

    if (isBlank(value)) return null;

    if (!this.supports(value)) {

      throw new InvalidPipeArgumentException(LocaleDatePipe, value);

    }

    // Updates the locale date for the value if:
    // - the value has changed;
    // - the locale date is empty;
    // - the default locale has changed.
    if (this.value != value || this.localeDate == "" || this.defaultLocale != this.locale.getDefaultLocale()) {

      // Updates the default locale for LocaleDatePipe.
      this.defaultLocale = this.locale.getDefaultLocale();

      // Updates the value of LocaleDatePipe before it changes.
      this.value = value;

      if (isNumber(value)) {

        value = DateWrapper.fromMillis(value);

      }

      if (StringMapWrapper.contains(LocaleDatePipe.ALIASES, pattern)) {

        pattern = <string>StringMapWrapper.get(LocaleDatePipe.ALIASES, pattern);

      }

      // Gets the locale date.
      this.localeDate = DateFormatter.format(value, this.defaultLocale, pattern);

    }

    return this.localeDate;

  }

  private supports(obj: any): boolean { return isDate(obj) || isNumber(obj); }
  
}