const {
    define_modal
} = require('./modal');
var fs = require('fs');

// read component html
var text = fs.readFileSync("frontend/html/components/modal.html", 'utf8');

// component class
let CModal = define_modal(text)

// perform tests

test('test user click the close button', () => {
    let test_ele = new CModal(test);

    // initial value
    test_ele.display_confirm("test", ()=>{}, ()=>{});

    // perform click
    test_ele.onclick_modal_close_btn();

    // verify
    expect(test_ele.modal.style.display).toBe("none");
    expect(test_ele.modal.style.display).toBe("none");
    expect(test_ele.modal.style.display).toBe("none");
});

test('test user click the cancel button', () => {
    let test_ele = new CModal(test);

    // initial value
    test_ele.display_confirm("test", ()=>{}, ()=>{});

    // perform click
    test_ele.onclick_cancel_button(()=>{});

    // verify
    expect(test_ele.modal.style.display).toBe("none");
    expect(test_ele.modal.style.display).toBe("none");
    expect(test_ele.modal.style.display).toBe("none");
});
