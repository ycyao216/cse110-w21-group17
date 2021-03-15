const {
    define_settings,
} = require('./settings');
var fs = require('fs');
let validText = fs.readFileSync("frontend/html/components/settings.html", 'utf8');
let invalidText = fs.readFileSync("frontend/html/components/modal.html", 'utf8');
let CSettings = new define_settings(validText);
//const validHTML = require('../../html/timer.html');
describe('General test of settings', () => {
    test('Running valid HTML through constructor', () => {
        let settings = new CSettings(test);
        let expected_panes = `<div class="active">
        <i class="account-tab" /> Account
    </div>, <div>
        <i class="appearence-tab" /> Appearance
    </div>, <div>
        <i class="timer-tab" /> Timer
    </div>, <div>
        <i class="todo-list-tab" /> Todo
    </div>, <div>
        <i class="about-tab" /> About
    </div>`;
        let actual_panes = (settings.get_tabpanes());
        //console.log((settings.get_tabpanes())[0].itemValue);
        /** 
        expect((settings.get_document()).innerHTML).toMatch(validText); 
        expect((settings.get_shadow()).innerHTML).toMatch(validText); 
        */
        expect((settings.get_shadow()).mode).toMatch('open');  
        //expect(actual_panes).toMatch(expected_panes);
        //make sure actual_panes is instanceof HTMLElement
    });
})