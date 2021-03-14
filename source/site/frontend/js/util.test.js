import { create_uid } from './utils';
describe('Testing create_uid', () => {
    test('create new uid of length 10', () => {
        let new_uid = create_uid(10);
        // verify
        expect(new_uid.toString().length).toBe(10);
    });
    test('create new uid of length -2', () => {
        let new_uid = create_uid(-2);
        // verify
        expect(new_uid.length).toBe(undefined);
    });
    test('create new uid of length 0', () => {
        let new_uid = create_uid(0);
        // verify
        expect(new_uid.length).toBe(undefined);
    });
})