const timer = require('./timer');
let testobj1 = document.createElement("p");
testobj.innerHTML = "25:00";
let testobj2 = document.createElement("p");
testobj.innerHTML = "22:37";
let testobj3 = document.createElement("p");
testobj.innerHTML = "22:00";
let testobj4 = document.createElement("p");
testobj.innerHTML = "00:00";

test('pass html object with 25:00', () => {
    expect(countdown(testobj1)).toBe("24:59");
});

test('pass html object with 22:37', () => {
    expect(countdown(testobj2)).toBe("22:36");
});

test('pass html object with 22:00', () => {
    expect(countdown(testobj3)).toBe("21:59");
});

test('pass html object with 00:00', () => {
    expect(countdown(testobj4)).toBe("00:00");
});