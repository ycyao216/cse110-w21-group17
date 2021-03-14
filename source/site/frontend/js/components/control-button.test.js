import { define_control_button } from './control-button';
import { readFileSync } from 'fs';

// read component html
var text = readFileSync("frontend/html/components/control-button.html", 'utf8');

// component class
let CControlButton = define_control_button(text)

describe('Testing control button', () => {
    test('running control button HTML through the function', () => {
        let test_ele = new CControlButton();

        // verify
        expect(test_ele.textContent).toBe("");
    });
})