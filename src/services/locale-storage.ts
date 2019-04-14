import { Injectable, Inject } from '@angular/core';

import { L10N_CONFIG, L10nConfigRef } from "../models/l10n-config";
import { StorageStrategy } from '../models/types';
import { getLocalStorage, getSessionStorage, getCookie, setLocalStorage, setSessionStorage, setCookie } from '../models/utils';

/**
 * Implement this class-interface to create a custom storage for default locale, currency & timezone.
 */
@Injectable() export abstract class LocaleStorage {

    /**
     * This method must contain the logic to read the storage.
     * @param name 'defaultLocale', 'currency' or 'timezone'
     * @return A promise with the value of the given name
     */
    public abstract async read(name: 'defaultLocale' | 'currency' | 'timezone'): Promise<string | null>;

    /**
     * This method must contain the logic to write the storage.
     * @param name 'defaultLocale', 'currency' or 'timezone'
     * @param value The value for the given name
     */
    public abstract async write(name: 'defaultLocale' | 'currency' | 'timezone', value: string): Promise<void>;

}

@Injectable() export class L10nStorage implements LocaleStorage {

    private hasCookie: boolean;
    private hasStorage: boolean;

    constructor(@Inject(L10N_CONFIG) private configuration: L10nConfigRef) {
        this.hasCookie = typeof navigator !== "undefined" && navigator.cookieEnabled;
        this.hasStorage = typeof Storage !== "undefined";
    }

    public async read(name: string): Promise<string | null> {
        let value: string | null = null;
        if (this.configuration.locale.storage != StorageStrategy.Disabled) {
            if (this.configuration.locale.storage == StorageStrategy.Local && this.hasStorage) {
                value = getLocalStorage(this.getName(name));
            } else if (this.configuration.locale.storage == StorageStrategy.Session && this.hasStorage) {
                value = getSessionStorage(this.getName(name));
            } else if (this.configuration.locale.storage == StorageStrategy.Cookie && this.hasCookie) {
                value = getCookie(this.getName(name));
            }
        }
        return value;
    }

    public async write(name: string, value: string): Promise<void> {
        if (this.configuration.locale.storage != StorageStrategy.Disabled) {
            if (this.configuration.locale.storage == StorageStrategy.Local && this.hasStorage) {
                setLocalStorage(this.getName(name), value);
            } else if (this.configuration.locale.storage == StorageStrategy.Session && this.hasStorage) {
                setSessionStorage(this.getName(name), value);
            } else if (this.configuration.locale.storage == StorageStrategy.Cookie && this.hasCookie) {
                setCookie(this.getName(name), value, this.configuration.locale.cookieExpiration);
            }
        }
    }

    private getName(name: string): string {
        if (this.configuration.locale.storageNames) {
            console.log(this.configuration.locale.storageNames[name]);
            return this.configuration.locale.storageNames[name] || name;
        }
        return name;
    }

}
