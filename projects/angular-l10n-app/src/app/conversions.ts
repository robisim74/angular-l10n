import { L10nLocale } from "angular-l10n";

export const convertCurrency = (value: number, locale: L10nLocale, rate: number) => {
    switch (locale.currency) {
        case "USD":
            return value * rate;
        default:
            return value;
    }
};

export const convertLength = (value: number, locale: L10nLocale) => {
    switch (locale.units['length']) {
        case "mile":
            return value * 0.621371;
        default:
            return value;
    }
};