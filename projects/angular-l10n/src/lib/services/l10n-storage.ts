import { Injectable } from '@angular/core';

import { L10nLocale } from '../models/types';

/**
 * Implement this class-interface to create a storage for the locale.
 */
@Injectable() export abstract class L10nStorage {

    /**
     * This method must contain the logic to read the storage.
     * @return A promise with the value of the locale
     */
    public abstract read(): Promise<L10nLocale | null>;

    /**
     * This method must contain the logic to write the storage.
     * @param locale The current locale
     */
    public abstract write(locale: L10nLocale): Promise<void>;

}

@Injectable() export class L10nDefaultStorage implements L10nStorage {

    public async read(): Promise<L10nLocale | null> {
        return Promise.resolve(null);
    }

    public async write(locale: L10nLocale): Promise<void> { }

}
