import {
    validateLanguage,
    formatLanguage,
    parseLanguage,
    lookupMatcher,
    getValue,
    handleParams,
    mergeDeep,
    hasIntl,
    hasDateTimeFormat,
    hasNumberFormat,
    hasTimeZone,
    hasRelativeTimeFormat,
    hasCollator,
    hasPluralRules
} from '../public-api';
import { toNumber, toDate, parseDigits } from '../lib/models/utils';

describe('utils', () => {
    describe('validateLanguage', () => {
        it('should validate the language', () => {
            expect(validateLanguage('en')).toBe(true);
            expect(validateLanguage('en-US')).toBe(true);
            expect(validateLanguage('en-Zzzz-US')).toBe(true);
            expect(validateLanguage('en-Zzzz-US-u-nu-latn-ca-gregory')).toBe(true);
            expect(validateLanguage('en-nu-latn')).toBe(false);
        });
    });
    describe('formatLanguage', () => {
        it('should format the language', () => {
            let language = formatLanguage('en-Zzzz-US', 'language');
            expect(language).toEqual('en');
            language = formatLanguage('en-Zzzz', 'language-script');
            expect(language).toEqual('en-Zzzz');
            language = formatLanguage('en-Zzzz-US', 'language-region');
            expect(language).toEqual('en-US');
            language = formatLanguage('en-Zzzz-US', 'language-script-region');
            expect(language).toEqual('en-Zzzz-US');
            language = formatLanguage('en');
            expect(language).toEqual('en');
            language = formatLanguage('en', 'language-region');
            expect(language).toEqual('en');
        });
    });
    describe('parseLanguage', () => {
        it('should parse the language', () => {
            let language = parseLanguage('en');
            expect(language).toEqual(jasmine.objectContaining({
                language: 'en'
            }));
            language = parseLanguage('en-US');
            expect(language).toEqual(jasmine.objectContaining({
                language: 'en', region: 'US'
            }));
            language = parseLanguage('en-Zzzz-US-u-nu-latn-ca-gregory');
            expect(language).toEqual(jasmine.objectContaining({
                language: 'en', script: 'Zzzz', region: 'US', extension: '-u-nu-latn-ca-gregory'
            }));
        });
    });
    describe('matchLanguage', () => {
        it('should match the language', () => {
            let matchingLanguage = lookupMatcher([{ locale: { language: 'en-US' } }, { locale: { language: 'it-IT' } }], 'language', 'en');
            expect(matchingLanguage).toBe(true);
            matchingLanguage = lookupMatcher([{ locale: { language: 'en-US' } }, { locale: { language: 'it-IT' } }], 'language', 'fr');
            expect(matchingLanguage).toBe(false);
        });
    });
    describe('getValue', () => {
        it('should get the value', () => {
            let value = getValue('KEY1', { KEY1: 'key1', KEY2: 'key2' });
            expect(value).toEqual('key1');
            value = getValue('SUBKEY1.AA', { KEY1: 'key1', SUBKEY1: { AA: 'aa' } }, '.');
            expect(value).toEqual('aa');
            value = getValue('SUBKEY1', { KEY1: 'key1', SUBKEY1: { AA: 'aa' } }, '.');
            expect(value).toEqual(jasmine.objectContaining({ AA: 'aa' }));
            value = getValue('SUBKEY1.BB', { KEY1: 'key1', SUBKEY1: { AA: 'aa' } }, '.');
            expect(value).toBeNull();
        });
    });
    describe('handleParams', () => {
        it('should handle the params', () => {
            let value = handleParams('Hi {{name}}', { name: 'Robi' });
            expect(value).toEqual('Hi Robi');
            value = handleParams('Hi {{name}} {{surname}}', { name: 'Robi', surname: 'Sim' });
            expect(value).toEqual('Hi Robi Sim');
        });
    });
    describe('mergeDeep', () => {
        it('should do the same as Object.assign on simple objects', () => {
            const target = { KEY1: 'key1' };
            const source = { KEY2: 'key2' };
            const result = mergeDeep(target, source);
            expect(result).toEqual(jasmine.objectContaining(Object.assign(target, source)));
        });
        it('should overwrite the same keys as Object.assign on simple objects', () => {
            const target = { KEY1: 'key1' };
            const source = { KEY1: 'key2' };
            const result = mergeDeep(target, source);
            expect(result).toEqual(jasmine.objectContaining(Object.assign(target, source)));
        });
        it('should deeply merge objects correctly', () => {
            const target = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
            const source = { KEY2: 'key2', SUBKEY2: { AA: 'aa' } };
            const result = mergeDeep(target, source);
            expect(result).toEqual(jasmine.objectContaining({
                KEY1: 'key1',
                KEY2: 'key2',
                SUBKEY1: {
                    AA: 'aa'
                },
                SUBKEY2: {
                    AA: 'aa'
                }
            }));
        });
        it('should deeply merge objects correctly with same sub-key', () => {
            const target = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
            const source = { KEY2: 'key2', SUBKEY1: { BB: 'bb' } };
            const result = mergeDeep(target, source);
            expect(result).toEqual(jasmine.objectContaining({
                KEY1: 'key1',
                KEY2: 'key2',
                SUBKEY1: {
                    AA: 'aa',
                    BB: 'bb'
                }
            }));
        });
        it('should deeply merge objects correctly with same sub-key and overwrite', () => {
            const target = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
            const source = { KEY2: 'key2', SUBKEY1: { AA: 'aaa', BB: 'bb' } };
            const result = mergeDeep(target, source);
            expect(result).toEqual(jasmine.objectContaining({
                KEY1: 'key1',
                KEY2: 'key2',
                SUBKEY1: {
                    AA: 'aaa',
                    BB: 'bb'
                }
            }));
        });
    });
    describe('hasIntl', () => {
        it('should has Intl', () => {
            expect(hasIntl()).toBe(true);
            expect(hasDateTimeFormat()).toBe(true);
            expect(hasNumberFormat()).toBe(true);
            expect(hasTimeZone()).toBe(true);
            expect(hasRelativeTimeFormat()).toBe(true);
            expect(hasCollator()).toBe(true);
            expect(hasPluralRules()).toBe(true);
        });
    });
    describe('toNumber', () => {
        it('should convert to number', () => {
            expect(toNumber('1234')).toEqual(1234);
            expect(toNumber('-1234')).toEqual(-1234);
            expect(toNumber(1234)).toEqual(1234);
        });
    });
    describe('toDate', () => {
        it('should convert to date', () => {
            expect(toDate(100000000000)).toEqual(new Date(100000000000));
            expect(toDate('100000000000')).toEqual(new Date(100000000000));
            expect(toDate('2019-09-19')).toEqual(new Date(2019, 8, 19));
            expect(toDate('2019-09-19T16:30:00')).toEqual(new Date('2019-09-19T16:30:00'));
            expect(toDate(new Date('2019-09-19T16:30:00'))).toEqual(new Date('2019-09-19T16:30:00'));
        });
    });
    describe('parseDigits', () => {
        it('should parse digits', () => {
            expect(parseDigits('1.2-2')).toEqual(jasmine.objectContaining({
                minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2
            }));
            expect(parseDigits('1.')).toEqual(jasmine.objectContaining({
                minimumIntegerDigits: 1
            }));
            expect(parseDigits('.0-2')).toEqual(jasmine.objectContaining({
                minimumFractionDigits: 0, maximumFractionDigits: 2
            }));
        });
    });
});
