export function getLocalStorage(name: string): string | null {
    return localStorage.getItem(name);
}

export function getSessionStorage(name: string): string | null {
    return sessionStorage.getItem(name);
}

export function getCookie(name: string): string | null {
    let result: RegExpExecArray | null = null;
    if (typeof document !== "undefined") {
        result = new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)").exec(document.cookie);
    }
    return result ? result[1] : null;
}

export function setLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value);
}

export function setSessionStorage(name: string, value: string): void {
    sessionStorage.setItem(name, value);
}

export function setCookie(name: string, value: string, expiration?: number): void {
    let expires: string = "";
    if (expiration != null) {
        const expirationDate: Date = new Date();
        expirationDate.setTime(
            expirationDate.getTime() +
            (expiration * 24 * 60 * 60 * 1000)
        );
        expires = "; expires=" + expirationDate.toUTCString();
    }
    if (typeof document !== "undefined") {
        document.cookie = name + "=" + value + expires + "; path=/";
    }
}
