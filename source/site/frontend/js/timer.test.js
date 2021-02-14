const timer = require('./timer');
let testobj = document.createElement("p");
testobj.innerHTML = "25:00";

test('pass html object with 25:00', () => {
    expect(timer(testobj)).toBe("24:59");
});