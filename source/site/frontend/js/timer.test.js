const timer = require('./timer');
let testobj = document.createElement("p");
testobj.innerHTML = "25:00";

test('pass html object with 25:00', () => {
    expect(countdown(testobj)).toBe("24:59");
});