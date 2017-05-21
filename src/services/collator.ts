import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

import { TranslationService } from './translation.service';
import { IntlAPI } from './intl-api';

/**
 * Intl.Collator APIs.
 */
export interface ICollator {

    /**
     * Compares two keys by the value of translation according to the current language.
     * @param key1, key2 The keys of the values to compare
     * @param extension Unicode extension key, e.g. 'co-phonebk'
     * @param options Default is { usage: 'sort', sensitivity: 'variant' }
     * @return A negative value if the value of translation of key1 comes before the value of translation of key2;
     *         a positive value if key1 comes after key2;
     *         0 if they are considered equal or Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    compare(
        key1: string,
        key2: string,
        extension?: string,
        options?: any
    ): number;

    /**
     * Sorts an array of objects or an array of arrays according to the current language.
     * @param list The array to be sorted
     * @param keyName The column that contains the keys of the values to be ordered
     * @param order 'asc' or 'desc'. The default value is 'asc'
     * @param extension Unicode extension key, e.g. 'co-phonebk'
     * @param options Default is { usage: 'sort', sensitivity: 'variant' }
     * @return The same sorted list or the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    sort(
        list: any[],
        keyName: any,
        order?: string,
        extension?: string,
        options?: any
    ): any[];

    /**
     * Sorts asynchronously an array of objects or an array of arrays according to the current language.
     * @param list The array to be sorted
     * @param keyName The column that contains the keys of the values to be ordered
     * @param order 'asc' or 'desc'. The default value is 'asc'
     * @param extension Unicode extension key, e.g. 'co-phonebk'
     * @param options Default is { usage: 'sort', sensitivity: 'variant' }
     * @return An observable of the sorted list or of the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    sortAsync(
        list: any[],
        keyName: any,
        order?: string,
        extension?: string,
        options?: any
    ): Observable<any[]>;

    /**
     * Matches a string into an array of objects or an array of arrays
     * according to the current language.
     * @param s The string to search
     * @param list The array in which to search
     * @param keyNames An array that contains the columns to look for
     * @param options Default is { usage: 'search' }
     * @return A filtered list or the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    search(
        s: string,
        list: any[],
        keyNames: any[],
        options?: any
    ): any[];

    /**
     * Matches asynchronously a string into an array of objects or an array of arrays
     * according to the current language.
     * @param s The string to search
     * @param list The array in which to search
     * @param keyNames An array that contains the columns to look for
     * @param options Default is { usage: 'search' }
     * @return An observable of the filtered list or the same list if Intl.Collator is not supported
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     */
    searchAsync(
        s: string,
        list: any[],
        keyNames: any[],
        options?: any
    ): Observable<any[]>;

}

@Injectable() export class Collator implements ICollator {

    constructor(private translation: TranslationService) { }

    public compare(
        key1: string,
        key2: string,
        extension?: string,
        options: any = { usage: 'sort', sensitivity: 'variant' }
    ): number {
        if (!IntlAPI.hasCollator()) {
            return 0;
        }

        const value1: string = this.translation.translate(key1);
        const value2: string = this.translation.translate(key2);

        const locale: string = this.addExtension(this.translation.getLanguage(), extension);
        return new Intl.Collator(locale, options).compare(value1, value2);
    }

    public sort(
        list: any[],
        keyName: any,
        order: string = "asc",
        extension?: string,
        options: any = { usage: 'sort', sensitivity: 'variant' }
    ): any[] {
        if (!list || !keyName || !IntlAPI.hasCollator()) {
            return list;
        }

        list.sort((key1: any, key2: any) => {
            return this.compare(key1[keyName], key2[keyName], extension, options);
        });

        if (order == "desc") {
            list.reverse();
        }
        return list;
    }

    public sortAsync(
        list: any[],
        keyName: any,
        order?: string,
        extension?: string,
        options: any = { usage: 'sort', sensitivity: 'variant' }
    ): Observable<any[]> {
        return Observable.create((observer: Observer<any[]>) => {
            observer.next(this.sort(list, keyName, order, extension, options));
            observer.complete();
        });
    }

    public search(
        s: string,
        list: any[],
        keyNames: any[],
        options: any = { usage: 'search' }
    ): any[] {
        if (!list || !keyNames || s == "" || s == null || !IntlAPI.hasCollator()) {
            return list;
        }

        const locale: string = this.translation.getLanguage();
        const collator: Intl.Collator = new Intl.Collator(locale, options);

        const matches: any[] = list.filter((key: any) => {
            let found: boolean = false;
            for (let i: number = 0; i < keyNames.length; i++) {
                if (this.match(key[keyNames[i]], s, collator)) {
                    found = true;
                    break;
                }
            }
            return found;
        });
        return matches;
    }

    public searchAsync(
        s: string,
        list: any[],
        keyNames: any[],
        options: any = { usage: 'search' }
    ): Observable<any[]> {
        return Observable.create((observer: Observer<any[]>) => {
            observer.next(this.search(s, list, keyNames, options));
            observer.complete();
        });
    }

    private addExtension(locale: string, extension?: string): string {
        if (!!extension) {
            locale = locale + "-u-" + extension;
        }
        return locale;
    }

    private match(key: string, s: string, collator: Intl.Collator): boolean {
        const value: string = this.translation.translate(key);
        const valueLength: number = value.length;
        const sLength: number = s.length;

        if (sLength > valueLength) {
            return false;
        }
        if (sLength == valueLength) {
            return collator.compare(value, s) == 0;
        }

        let found: boolean = false;
        for (let i: number = 0; i < valueLength - (sLength - 1); i++) {
            const str: string = value.substr(i, sLength);
            if (collator.compare(str, s) == 0) {
                found = true;
                break;
            }
        }
        return found;
    }

}
