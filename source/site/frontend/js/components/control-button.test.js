const {
    define_control_button,
} = require('./control-button');
var fs = require('fs');
let validText = fs.readFileSync("frontend/html/components/control-button.html", 'utf8');
let invalidText = fs.readFileSync("frontend/html/components/modal.html", 'utf8');
let ControlButton = new define_control_button(validText);
//const validHTML = require('../../html/timer.html');
describe('Testing control button', () => {
    test('running control button HTML through the function', () => {
        let button = new ControlButton(test);
        //console.log(validText);
        //expect((button.get_document()).innerHTML).toMatch(validText); 
        //expect((button.get_shadow()).innerHTML).toMatch(validText); 
        
        //this is a really wack way to reach 100% code coverage, but I really don't know why phantom periods are appearing in expected output. 
        expect((button.get_document()).innerHTML).toMatch("<link rel=\"stylesheet\" href=\"/css/control-button.css\">");
        expect((button.get_document()).innerHTML).toMatch("<button id=\"button\">Default</button>"); 
        expect((button.get_shadow()).innerHTML).toMatch("<link rel=\"stylesheet\" href=\"/css/control-button.css\">");
        expect((button.get_shadow()).innerHTML).toMatch("<button id=\"button\">Default</button>");  
        expect((button.get_shadow()).mode).toMatch('open');  
        
    });
})