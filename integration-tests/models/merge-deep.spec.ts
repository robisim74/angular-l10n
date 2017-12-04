import {mergeDeep} from "../../src/models/merge-deep";

describe('mergeDeep', () => {
    it('sould do the same as Object.assign on simple objects', () => {
        const target: any = { KEY1: 'Key1' };
        const source: any = { KEY2: 'Key2' };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining(Object.assign(target, source)));
    });

    it('sould overwrite the same keys as Object.assign on simple objects', () => {
        const target: any = { KEY1: 'Key1' };
        const source: any = { KEY1: 'Key2' };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining(Object.assign(target, source)));
    });

    it('sould deeply merge objects correctly', () => {
        const target: any = { KEY1: 'Key1', SUBKEY1: { AA: 'aa' } };
        const source: any = { KEY2: 'Key2', SUBKEY2: { AA: 'aa'} };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining({
            KEY1: 'Key1',
            KEY2: 'Key2',
            SUBKEY1: {
                AA: 'aa'
            },
            SUBKEY2: {
                AA: 'aa'
            }
        }));
    });

    it('sould deeply merge objects correctly with same sub-key', () => {
        const target: any = { KEY1: 'Key1', SUBKEY1: { AA: 'aa' } };
        const source: any = { KEY2: 'Key2', SUBKEY1: { BB: 'bb'} };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining({
            KEY1: 'Key1',
            KEY2: 'Key2',
            SUBKEY1: {
                AA: 'aa',
                BB: 'bb'
            }
        }));
    });

    it('sould deeply merge objects correctly with same sub-key and overwite', () => {
        const target: any = { KEY1: 'Key1', SUBKEY1: { AA: 'aa' } };
        const source: any = { KEY2: 'Key2', SUBKEY1: { AA: 'aaa', BB: 'bb'} };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining({
            KEY1: 'Key1',
            KEY2: 'Key2',
            SUBKEY1: {
                AA: 'aaa',
                BB: 'bb'
            }
        }));
    });
});
