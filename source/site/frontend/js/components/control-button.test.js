const {
    define_control_button
} = require('./control-button');
var fs = require('fs');
let text = fs.readFileSync("frontend/html/components/control-button.html", 'utf8');
let ControlButton = new define_control_button(text);
//const validHTML = require('../../html/timer.html');
describe('Testing both valid and invalid instantiations of control button', () => {
    test('running valid HTML through the function', () => {
        let button = new ControlButton(text);
        //let strings = JSON.stringify(button);
        //console.log(strings);
        expect(button).toMatch(text);      
    });
    /** 
    test('running invalid HTML through the function', () => {
        //
    })
    **/
})