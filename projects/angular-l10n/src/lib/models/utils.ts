import { L10nFormat, L10nSchema } from './types';
import { l10nError } from './l10n-error';

export function validateLanguage(language: string): boolean {
    return /^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?(-u.+)?$/
        .test(language);
}

export function formatLanguage(language: string, format?: L10nFormat): string {
    if (!validateLanguage(language)) throw l10nError(formatLanguage, 'Invalid language');
    if (format == null) return language;

    const [, LANGUAGE = '', SCRIPT = '', REGION = ''] = language.match(/^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?/) || [];
    switch (format) {
        case 'language':
            return LANGUAGE;
        case 'language-script':
            return LANGUAGE + SCRIPT;
        case 'language-region':
            return LANGUAGE + REGION;
        case 'language-script-region':
            return LANGUAGE + SCRIPT + REGION;
    }
}

export function parseLanguage(language: string) {
    const matching = language
        .match(/^(?<LANGUAGE>[a-z]{2,3})(\-(?<SCRIPT>[A-Z][a-z]{3}))?(\-(?<REGION>[A-Z]{2}))?(?<EXTENSION>-u.+)?$/);

    if (!matching || !matching.groups) throw l10nError(parseLanguage, 'Invalid language');

    const groups = matching.groups;
    return {
        language: groups.LANGUAGE,
        script: groups.SCRIPT,
        region: groups.REGION,
        extension: groups.EXTENSION
    };
}

export function getBrowserLanguage(): string | null {
    let browserLanguage = null;
    if (navigator !== undefined && navigator.language) {
        browserLanguage = navigator.language;
    }
    if (browserLanguage != null) {
        browserLanguage = browserLanguage.split('-')[0];
    }
    return browserLanguage;
}

export function lookupMatcher(schema: L10nSchema[], format: L10nFormat, language: string): boolean {
    return schema.find((element) => formatLanguage(element.locale.language, format) === language) !== undefined;
}

export function getValue(key: string, data: any, keySeparator?: string): string | any | null {
    if (data) {
        if (keySeparator) {
            return key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur]) || null, data);
        }
        return data[key];
    }
    return null;
}

export function handleParams(value: string, params: any): string {
    return value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
        const replacer = params[parsedKey];
        return replacer !== undefined ? replacer : substring;
    });
}

export function mergeDeep(target: any, source: any): any {
    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
}

function isObject(item: any): boolean {
    return (typeof item === 'object' && !Array.isArray(item));
}
