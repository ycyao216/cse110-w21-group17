import { define_timer_display, trigger_countdown, update_countdown, reset_countdown, is_countingdown, ring, stop_ring } from './timer-display';
import { readFileSync } from 'fs';

// read component html
var timer_display_html = readFileSync("frontend/html/components/timer-display.html", 'utf8');
let CTimerDisplay = define_timer_display(timer_display_html)

// tests

// fix Error: Not implemented: HTMLMediaElement.prototype.play
window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };


beforeEach(() => {
    jest.useFakeTimers();
});

test('test trigger_countdown calls callback function once hits 0 and sets timer to 00:00', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(15, callback);

    // at this point callback should not be called
    expect(callback).not.toBeCalled();

    // fast-forward until all timers executed
    jest.runAllTimers();

    // now callback should've been called
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);

    expect(test_element.timer_display.innerHTML).toBe("00:00");
})

test('test update_countdown returns null when timer is 0', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(0, callback);

    // null check
    expect(test_element.update_countdown()).toBe(undefined);

    // timer displays 0
    expect(test_element.timer_display.innerHTML).toBe("00:00");
})

test('test trigger_countdown can convert times to minutes', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(60, callback);

    // confirm
    expect(test_element.timer_display.innerHTML).toBe("01:00");
})

test('test trigger_countdown works with intermediate values', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(626, callback);

    // confirm
    expect(test_element.timer_display.innerHTML).toBe("10:26");
})

test('test trigger_countdown will call callback_f when time hits 0', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(3, callback);

    // let 3 seconds pass
    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
})

test('is_countingdown returns true when counting', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(10, callback);

    // force update b/c interval
    jest.advanceTimersByTime(1000);

    expect(test_element.is_countingdown()).toBe(true);
})

test('is_countingdown returns false by default', () => {
    let test_element = new CTimerDisplay();

    expect(test_element.is_countingdown()).toBe(false);
})

test('is_countingdown returns false after stopping', () => {
    let test_element = new CTimerDisplay();
    test_element.trigger_countdown(3, jest.fn());

    // let 3 seconds pass
    jest.runAllTimers();

    expect(test_element.is_countingdown()).toBe(false);
})

test('ring sets volumes to level greater than 0', () => {
    let test_element = new CTimerDisplay();
    test_element.ring();

    expect(test_element.alarm_sound.volume).toBe(0.1);
})

test('stop_ring sets volumes to 0', () => {
    let test_element = new CTimerDisplay();
    test_element.ring();
    test_element.stop_ring();

    expect(test_element.alarm_sound.volume).toBe(0);
})

test('null checks work properly', () => {
    let test_element = new CTimerDisplay();
    let callback = jest.fn();
    test_element.trigger_countdown(10, callback);

    jest.runAllTimers();

    expect(test_element.update_countdown()).toBe(undefined);
    expect(test_element.reset_countdown()).toBe(undefined);
    
})