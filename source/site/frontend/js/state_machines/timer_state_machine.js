/*
    Top Level State Machine For Timer.html 
    This file defines all the possible states (views) that a user could encounter, and their next steps
    All these states should be stateless, that is, what the user sees in a state should never depend on what he/she have done 
    previously, except for what state he/she comes from and the global user_data
*/

// Default state
export var timer_init;
// Menu states
export var timer_open_settings;
export var timer_toggle_task_list;
// Timer states
export var timer_ringing;
export var timer_during_countdown;
export var timer_break_countdown;

// init page when user enters website
timer_init = {
    'name': 'timer_init',
    'next_states': {
        get timer_init() { return timer_init }, // default view when entering the website/recovering from a emergency stop
        get timer_open_settings() { return timer_open_settings }, // triggered when user pressed the settings button
        get timer_toggle_task_list() { return timer_toggle_task_list }, // triggered when user pressed the tasklist button
        get timer_during_countdown() { return timer_during_countdown }, // triggered when user pressed the start button
    },
    'functions_enter': [
        () => console.log("[timer_init]"),
        // Force init
        () => document.getElementById("timer-display").reset_countdown(window.user_data.settings.work_sec),
        // Set everything to defaultView
        () => {
            // should show
            document.getElementById("start-button").style.display = 'initial';
            document.getElementById("timer-label").innerHTML = "Waiting";
            // should NOT show
            document.getElementById("emergency-stop-button").style.display = 'none';
            document.getElementById("overstudy-button").style.display = 'none';
            document.getElementById("early-prompt").style.display = 'none';
            // refreshes
            window.update_status();
            document.getElementById('c-task-list').refresh_list()
        },
    ],
    'functions_leave': [],
}

// opening the settings page
timer_open_settings = {
    'name': 'timer_open_settings',
    'next_states': {
        // Settings should ONLY open when timer is not counting down AT ALL
        get timer_init() { return timer_init; },
    },
    'functions_enter': [
        () => console.log('[timer_open_settings]'),
        // show settings
        () => document.getElementById("c-settings").style.display = 'block'
    ],
    'functions_leave': [
        // hide settings
        () => document.getElementById("c-settings").style.display = 'none'
    ],
}

// opening the task list
timer_toggle_task_list = {
    'name': 'timer_toggle_task_list',
    'next_states': {
        // Task-list should ONLY open when the user is not working
        get timer_init() { return timer_init; },
        get timer_break_countdown() { return timer_break_countdown; },
    },
    'functions_enter': [
        () => console.log('[timer_toggle_task_list]'),
        // show task list
        () => document.getElementById("c-task-list").enter_animate()
        // change the behavior of the button
        
    ],
    'functions_leave': [
        // hide task list
        () => document.getElementById("c-task-list").leave_animate()
    ],
}

// the timer is counting down (working)
timer_during_countdown = {
    'name': 'timer_during_countdown',
    'next_states': {
        get timer_ringing() { return timer_ringing; }, // Cycle ends naturally
        get timer_init() { return timer_init; }, // Occurs when Emergency Stop
    },
    'functions_enter': [
        () => console.log('[timer_during_countdown]'),
        // change buttons shown, change timer label
        () => {
            // should show
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("overstudy-button").style.display = 'initial';
            document.getElementById("timer-label").innerHTML = "Work";
            // should NOT show
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("add-cycle-button").style.display = 'none';
            document.getElementById("c-task-list").leave_animate();
            // refreshes
            window.update_status();
        },
        // initiate countdown if not counting down, or return to init if no more tasks
        () => { if (current_task() == null) transition(window.current_state, 'timer_init'); },
        () => {
            if (!document.getElementById("timer-display").is_countingdown()) {
                let time_limit = window.user_data.settings.work_sec;
                document.getElementById("timer-display").trigger_countdown(time_limit, () => {
                    // when done
                    current_task().cycles_completed += 1;
                    update_task(current_task());
                    transition(window.current_state, 'timer_ringing');
                });
            }
        },
    ],
    'functions_leave': [
    ],
}

// the timer is ringing (when work countdown timeouts)
timer_ringing = {
    'name': 'timer_ringing',
    'next_states': {
        get timer_init() { return timer_init; }, // User decides to Emergency Stop
        get timer_break_countdown() { return timer_break_countdown; }, // User takes a break naturally
    },
    'functions_enter': [
        () => console.log('[timer_ringing]'),
        // Update the page
        () => {
            // should show
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("timer-label").innerHTML = "Ringing";
            // should NOT show
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("overstudy-button").style.display = 'none';
            document.getElementById("early-prompt").style.display = 'none';
            // refreshes
        },
        // Ring
        () => { document.getElementById("timer-display").ring(); },
        // Automatically go to break after 3 seconds
        () => { setTimeout(() => transition(window.current_state, 'timer_break_countdown'), 3000); }

    ],
    'functions_leave': [
        // Stop Ringing
        () => { document.getElementById("timer-display").stop_ring(); }
    ],
}

// the timer is counting down (break)
timer_break_countdown = {
    'name': 'timer_break_countdown',
    'next_states': {
        get timer_init() { return timer_init }, // User decides to Emergency Stop
        get timer_toggle_task_list() { return timer_toggle_task_list }, // Task-list page
        get timer_during_countdown() { return timer_during_countdown }, // User enters new cycle
    },
    'functions_enter': [
        () => console.log('[timer_break_countdown]'),
        // Update the page
        () => {
            // should show
            document.getElementById("add-cycle-button").style.display = 'initial';
            document.getElementById("emergency-stop-button").style.display = 'initial';
            // should NOT show
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("overstudy-button").style.display = 'none';
            // refreshes
            window.update_status();
        },
        // Break if not yet
        () => {
            if (!document.getElementById("timer-display").is_countingdown()) {
                // get break status 
                let break_string = window.active_userstate().break_status.break;
                let sec_limit = window.user_data.settings[`${break_string}_sec`];
                document.getElementById("timer-label").innerHTML = break_string;
                document.getElementById("timer-display").trigger_countdown(sec_limit, () => {
                    transition(window.current_state, 'timer_during_countdown');
                });
            }
        },
    ],
    'functions_leave': [
        // advance 1 break cycle
        () => window.advance_break_cycle(),
        // advance 1 task if complete
        () => window.advance_task()
    ],
}