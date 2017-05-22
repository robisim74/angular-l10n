import { LocaleConfig } from './locale-config';

/**
 * Manages the browser for cookie, local storage & navigator.
 */
export class Browser {

    private hasCookie: boolean;
    private hasStorage: boolean;

    constructor(private configuration: LocaleConfig) {
        this.hasCookie = typeof navigator !== "undefined" && typeof navigator.cookieEnabled !== "undefined" &&
            navigator.cookieEnabled;
        this.hasStorage = typeof Storage !== "undefined";
    }

    public readStorage(name: string): string | null {
        let value: string | null = null;
        if (!this.configuration.storageIsDisabled) {
            if (this.configuration.localStorage && this.hasStorage) {
                value = this.getLocalStorage(name);
            } else if (this.configuration.sessionStorage && this.hasStorage) {
                value = this.getSessionStorage(name);
            } else if (this.hasCookie) {
                value = this.getCookie(name);
            }
        }
        return value;
    }

    public writeStorage(name: string, value: string): void {
        if (!this.configuration.storageIsDisabled) {
            if (this.configuration.localStorage && this.hasStorage) {
                this.setLocalStorage(name, value);
            } else if (this.configuration.sessionStorage && this.hasStorage) {
                this.setSessionStorage(name, value);
            } else if (this.hasCookie) {
                this.setCookie(name, value);
            }
        }
    }

    public getBrowserLanguage(): string | null {
        let browserLanguage: string | null = null;
        if (typeof navigator !== "undefined" && typeof navigator.language !== "undefined") {
            browserLanguage = navigator.language;
        }
        if (browserLanguage != null) {
            const index: number = browserLanguage.indexOf("-");
            if (index != -1) {
                browserLanguage = browserLanguage.substring(0, index);
            }
        }
        return browserLanguage;
    }

    private getLocalStorage(name: string): string | null {
        return localStorage.getItem(name);
    }

    private getSessionStorage(name: string): string | null {
        return sessionStorage.getItem(name);
    }

    private getCookie(name: string): string | null {
        let result: RegExpExecArray | null = null;
        if (typeof document !== "undefined") {
            result = new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)").exec(document.cookie);
        }
        return result ? result[1] : null;
    }

    private setLocalStorage(name: string, value: string): void {
        localStorage.setItem(name, value);
    }

    private setSessionStorage(name: string, value: string): void {
        sessionStorage.setItem(name, value);
    }

    private setCookie(name: string, value: string): void {
        let expires: string = "";
        if (this.configuration.cookiesExpirationDays != null) {
            const expirationDate: Date = new Date();
            expirationDate.setTime(
                expirationDate.getTime() +
                (this.configuration.cookiesExpirationDays * 24 * 60 * 60 * 1000)
            );
            expires = "; expires=" + expirationDate.toUTCString();
        }
        if (typeof document !== "undefined") {
            document.cookie = name + "=" + value + expires + "; path=/";
        }
    }

}
