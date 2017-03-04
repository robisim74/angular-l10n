import { LocaleService } from '../../services/locale.service';

/**
 * Manages the browser for storage, navigator and Intl.
 */
export class Browser {

    public storageIsDisabled: boolean;

    private hasCookie: boolean;
    private hasLocalStorage: boolean;

    constructor(public locale: LocaleService) {
        this.hasCookie = typeof navigator !== "undefined" &&
            typeof navigator.cookieEnabled !== "undefined" &&
            navigator.cookieEnabled;
        this.hasLocalStorage = typeof Storage !== "undefined";
    }

    public readStorage(name: string): string {
        let value: string;
        if (!this.storageIsDisabled) {
            if (this.locale.configuration.localStorage && this.hasLocalStorage) {
                value = this.getLocalStorage(name);
            } else if (this.hasCookie) {
                value = this.getCookie(name);
            }
        }
        return value;
    }

    public writeStorage(name: string, value: string): void {
        if (!this.storageIsDisabled) {
            if (this.locale.configuration.localStorage && this.hasLocalStorage) {
                this.setLocalStorage(name, value);
            } else if (this.hasCookie) {
                this.setCookie(name, value);
            }
        }
    }

    public getBrowserLanguage(): string {
        let browserLanguage: string;
        if (typeof navigator !== "undefined" && typeof navigator.language !== "undefined") {
            browserLanguage = navigator.language;
        }
        if (browserLanguage != null) {
            let index: number = browserLanguage.indexOf("-");
            if (index != -1) {
                browserLanguage = browserLanguage.substring(0, index);
            }
        }
        return browserLanguage;
    }

    private getLocalStorage(name: string): string {
        return localStorage.getItem(name);
    }

    private getCookie(name: string): string {
        let result: RegExpExecArray;
        if (typeof document !== "undefined") {
            result = new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)").exec(document.cookie);
        }
        return result ? result[1] : null;
    }

    private setLocalStorage(name: string, value: string): void {
        localStorage.setItem(name, value);
    }

    private setCookie(name: string, value: string): void {
        let expires: string = "";
        if (this.locale.configuration.cookiesExpirationDays != null) {
            let expirationDate: Date = new Date();
            expirationDate.setTime(
                expirationDate.getTime() +
                (this.locale.configuration.cookiesExpirationDays * 24 * 60 * 60 * 1000)
            );
            expires = "; expires=" + expirationDate.toUTCString();
        }
        if (typeof document !== "undefined") {
            document.cookie = name + "=" + value + expires + "; path=/";
        }
    }

}
