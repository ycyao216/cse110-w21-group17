// Example State Data Structure
var example_state = {
    'name': 'timer_init',
    'attatched_states': [],
    'next_states': {

    },
    'functions_enter': [],
    'functions_leave': [],
}

// TODO Ready For Testing
// State Utils
export function transition(from_state, to_state_string, target = null) {
    // Obtain next state
    let to_state = from_state.next_states[to_state_string]

    if (to_state == null) {
        console.error(`invalid state trainsition: ${from_state} -> ${to_state_string} detected!!`);
        return null;
    }

    // run all functions_leave of from_state
    if (from_state !== null) {
        from_state.functions_leave.forEach(f => target == null ? f.call(this) : f.call(this, target));
    }

    // State Transition
    window.current_state = to_state;

    // run all functions_enter of to_state
    to_state.functions_enter.forEach(f => target == null ? f.call(this) : f.call(this, target));

    return to_state;
}

export function force_state(to_state, target = null) {
    to_state.functions_enter.forEach(f => target == null ? f.call(this) : f.call(this, target));
    return to_state;
}