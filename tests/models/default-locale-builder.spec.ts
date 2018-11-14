/* tslint:disable */
import { DefaultLocaleBuilder } from '../../src/models/default-locale-builder';

describe('DefaultLocaleBuilder', () => {

    const defaultLocale: DefaultLocaleBuilder = new DefaultLocaleBuilder();

    it('should build the default locale', () => {
        defaultLocale.build('en', 'US', 'Zzzz', 'latn', 'gregory');

        const value: string = defaultLocale.value;

        expect(value).toEqual('en-Zzzz-US-u-nu-latn-ca-gregory');
        expect(defaultLocale.languageCode).toEqual('en');
        expect(defaultLocale.scriptCode).toEqual('Zzzz');
        expect(defaultLocale.countryCode).toEqual('US');
        expect(defaultLocale.numberingSystem).toEqual('latn');
        expect(defaultLocale.calendar).toEqual('gregory');
    });

    it('should build the default locale when incomplete', () => {
        defaultLocale.build('en', 'US', undefined, undefined, 'gregory');

        const value: string = defaultLocale.value;

        expect(value).toEqual('en-US-u-ca-gregory');
        expect(defaultLocale.languageCode).toEqual('en');
        expect(defaultLocale.scriptCode).toEqual(undefined);
        expect(defaultLocale.countryCode).toEqual('US');
        expect(defaultLocale.numberingSystem).toEqual(undefined);
        expect(defaultLocale.calendar).toEqual('gregory');
    });

    it('should set the default locale', () => {
        defaultLocale.value = "en-Zzzz-US-u-nu-latn-ca-gregory";

        const value: string = defaultLocale.value;

        expect(value).toEqual('en-Zzzz-US-u-nu-latn-ca-gregory');
        expect(defaultLocale.languageCode).toEqual('en');
        expect(defaultLocale.scriptCode).toEqual('Zzzz');
        expect(defaultLocale.countryCode).toEqual('US');
        expect(defaultLocale.numberingSystem).toEqual('latn');
        expect(defaultLocale.calendar).toEqual('gregory');
    });

    it('should set the default locale when incomplete', () => {
        defaultLocale.value = "en-US-u-ca-gregory";

        const value: string = defaultLocale.value;

        expect(value).toEqual('en-US-u-ca-gregory');
        expect(defaultLocale.languageCode).toEqual('en');
        expect(defaultLocale.scriptCode).toEqual(undefined);
        expect(defaultLocale.countryCode).toEqual('US');
        expect(defaultLocale.numberingSystem).toEqual(undefined);
        expect(defaultLocale.calendar).toEqual('gregory');
    });

});
