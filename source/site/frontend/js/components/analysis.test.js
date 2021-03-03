import { define_analysis } from './analysis';
import { readFileSync } from 'fs';

// read component html
var text = readFileSync("frontend/html/components/analysis.html", 'utf8');

// component class
let CAnalysis = define_analysis(text)

// perform tests
test('test instantiation', () => {
    let test_ele = new CAnalysis(test);

    // verify
    expect((test_ele.get_document()).innerHTML).toMatch(text); 
    expect((test_ele.get_shadow()).innerHTML).toMatch(text); 
    expect((test_ele.get_shadow()).mode).toBe('open');
});
