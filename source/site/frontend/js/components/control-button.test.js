const {
    define_control_button,
} = require('./control-button');
var fs = require('fs');
let text = fs.readFileSync("frontend/html/components/control-button.html", 'utf8');
let ControlButton = new define_control_button(text);
//const validHTML = require('../../html/timer.html');
describe('Testing both valid and invalid instantiations of control button', () => {
    test('running valid HTML through the function', () => {
        let button = new ControlButton(text);
        expect((button.get_document()).innerHTML).toMatch(text); 
        expect((button.get_shadow()).innerHTML).toMatch(text); 
        expect((button.get_shadow()).mode).toMatch('open');  
    });
})
