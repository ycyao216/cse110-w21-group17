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
function state_transition(to_state_string) {
    from_state = window.current_state;
    // Obtain next state
    to_state = from_state.next_states[to_state_string]
    if (to_state == null) {
        console.error('invalid state trainsition detected!!');
        return from_state
    }

    // run all functions_leave of from_state
    if (from_state !== null) {
        from_state.functions_leave.forEach(f => f.call(this));
    }

    // State Transition
    window.current_state = to_state;

    // run all functions_enter of to_state
    to_state.functions_enter.forEach(f => f.call(this));

    return to_state;
}

function force_state(to_state) {
    window.current_state = to_state;
    to_state.functions_enter.forEach(f => f.call(this));
    return to_state;
}