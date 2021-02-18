const {countdownElement,isLongBreak} = require('./main');

let testobj1 = document.createElement("p");
testobj1.innerHTML = "25:00";
let testobj2 = document.createElement("p");
testobj2.innerHTML = "22:37";
let testobj3 = document.createElement("p");
testobj3.innerHTML = "22:00";
let testobj4 = document.createElement("p");
testobj4.innerHTML = "00:00";

//countdownElement
test('pass html object with 25:00', () => {
    expect(countdownElement(testobj1)).toBe("24:59");
});

test('pass html object with 22:37', () => {
    expect(countdownElement(testobj2)).toBe("22:36");
});

test('pass html object with 22:00', () => {
    expect(countdownElement(testobj3)).toBe("21:59");
});

test('pass html object with 00:00', () => {
    expect(countdownElement(testobj4)).toBe("00:00");
});

// isLongBreak
test('pass 7', () => {
    expect(isLongBreak(7)).toBe(false);
});

test('pass 8', () => {
    expect(isLongBreak(8)).toBe(true);
});