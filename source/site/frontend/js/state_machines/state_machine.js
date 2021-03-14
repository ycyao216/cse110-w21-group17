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

// TODO Ready For Testing
// State Utils
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

export function rev_transition(statelet) {
    transition(statelet, statelet.previous);
}

export function force_state(statelet) {
    window.timer_state_machine[statelet.current].functions_enter.forEach(f => f.call(this));
    window.update_state();
    return;
}