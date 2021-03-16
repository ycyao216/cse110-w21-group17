// Example State Data Structure
// var example_state = {
//     'next_states': {
//         get some_state() { return some_state; },
//     },
//     'functions_enter': [
//         () => console.log("test")
//     ],
//     'functions_leave': [],
// }

// State Utils
/**
 * Controls state transitions and checking for valid transitions
 * @param {*} statelet - current/previous state information
 * @param {*} to_state_string - string of state of transition to
 * @function
 */
export function transition(statelet, to_state_string) {
    let from_state = statelet.current;

    // Obtain next state
    if (!window.timer_state_machine[statelet.current].next_states.includes(to_state_string)) {
        console.error(`invalid state trainsition: ${from_state} -> ${to_state_string} detected!!`);
        return null;
    }

    // run all functions_leave of from_state
    if (statelet.current !== null) {
        window.timer_state_machine[statelet.current].functions_leave.forEach(f => (statelet.current == from_state) && (f.call(this)));
    }

    // State Transition
    statelet.previous = statelet.current;
    statelet.current = to_state_string;
    from_state = statelet.current;
    window.update_state();

    // run all functions_enter of to_state
    window.timer_state_machine[statelet.current].functions_enter.forEach(f => (statelet.current == from_state) && (f.call(this)));

    return;
}

/**
 * Transition to the previous state
 * @param {*} statelet - information on current/previous state
 */
export function rev_transition(statelet) {
    transition(statelet, statelet.previous);
}

/**
 * Force state transition (no checks)
 * @param {*} statelet - information on wanted current/previous state
 */
export function force_state(statelet) {
    statelet.previous = statelet.current;
    statelet.current = statelet.current;
    window.update_state();
    window.timer_state_machine[statelet.current].functions_enter.forEach(f => f.call(this));
    window.update_state();
    return;
}