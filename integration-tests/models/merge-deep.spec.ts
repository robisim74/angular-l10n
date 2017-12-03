import {mergeDeep} from "../../src/models/merge-deep";

describe('mergeDeep', () => {
    it('sould deeply merge to object correctly (case 1)', () => {
        const target: any = { KEY1: 'Key1' };
        const source: any = { KEY2: 'Key2' };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining({ KEY1: 'Key1', KEY2: 'Key2' }));
    });

    it('sould deeply merge to object correctly (case 2)', () => {
        const target: any = { KEY1: 'Key1' };
        const source: any = { KEY1: 'Key2' };
        const result: any = mergeDeep(target, source);
        expect(result).toEqual(jasmine.objectContaining({ KEY1: 'Key2' }));
    });

    it('sould deeply merge to object correctly (case 3)', () => {
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

    it('sould deeply merge to object correctly (case 4)', () => {
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

    it('sould deeply merge to object correctly (case 5)', () => {
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
