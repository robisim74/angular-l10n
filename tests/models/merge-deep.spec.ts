/* tslint:disable */
import { mergeDeep } from '../../src/models/merge-deep';

describe('mergeDeep', () => {

    it('should do the same as Object.assign on simple objects', () => {
        const target: any = { KEY1: 'key1' };
        const source: any = { KEY2: 'key2' };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining(Object.assign(target, source)));
    });

    it('should overwrite the same keys as Object.assign on simple objects', () => {
        const target: any = { KEY1: 'key1' };
        const source: any = { KEY1: 'key2' };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining(Object.assign(target, source)));
    });

    it('should deeply merge objects correctly', () => {
        const target: any = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
        const source: any = { KEY2: 'key2', SUBKEY2: { AA: 'aa' } };
        const result: any = mergeDeep(target, source);
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
        const target: any = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
        const source: any = { KEY2: 'key2', SUBKEY1: { BB: 'bb' } };
        const result: any = mergeDeep(target, source);
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
        const target: any = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
        const source: any = { KEY2: 'key2', SUBKEY1: { AA: 'aaa', BB: 'bb' } };
        const result: any = mergeDeep(target, source);
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
