/*
    Top Level State Machine For Timer.html 
    This file defines all the possible states (views) that a user could encounter, and their next steps
    All these states should be stateless, that is, what the user sees in a state should never depend on what he/she have done 
    previously, except for what state he/she comes from and the global user_data
*/

// Default state
////timer_init;
// Menu states
////timer_open_settings;
////timer_toggle_task_list;
// Timer states
////timer_ringing;
////timer_during_countdown;
////timer_break_countdown;

export var timer_state_machine = {
    // init page when user enters website
    "timer_init": {
        'next_states': [
            'timer_init', // default view when entering the website/recovering from a emergency stop
            'timer_open_settings', // triggered when user pressed the settings button
            'timer_toggle_task_list', // triggered when user pressed the tasklist button
            'timer_during_countdown', // triggered when user pressed the start button
        ],
        'functions_enter': [
            () => console.log("[timer_init]"),
            // Force init
            () => document.getElementById("timer-display").reset_countdown(window.user_data.settings.working_sec),
            // Set everything to defaultView
            () => {
                // should show
                document.getElementById("start-button").style.display = 'initial';
                document.getElementById("settings-btn").style.display = 'initial';
                document.getElementById("tasklist-btn").style.display = 'initial';
                document.getElementById("help-button").style.display = 'initial';
                document.getElementById("settings-btn").style.visibility = 'visible';
                document.getElementById("tasklist-btn").style.visibility = 'visible';
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
    },

    // opening the settings page
    'timer_open_settings': {
        'next_states': [
            // Settings should ONLY open when timer is not counting down AT ALL
            'timer_init',
        ],
        'functions_enter': [
            () => console.log('[timer_open_settings]'),
            // show settings
            () => {
                document.getElementById("c-settings").style.display = 'block';
                document.getElementById("help-button").style.display = 'initial';
                document.getElementById("c-settings").refresh();
            }
        ],
        'functions_leave': [
            // hide settings
            () => document.getElementById("c-settings").style.display = 'none'
        ],
    },

    // opening the task list
    'timer_toggle_task_list': {
        'next_states': [
            // Task-list should ONLY open when the user is not working
            'timer_init',
            'timer_break_countdown',
            'timer_during_countdown',
            'timer_open_settings'
        ],
        'functions_enter': [
            () => console.log('[timer_toggle_task_list]'),
            // show task list
            () => document.getElementById("c-task-list").enter_animate(),
            // refreshes
            () => document.getElementById('c-task-list').refresh_list(),
            // hide help button
            () => document.getElementById("help-button").style.display = 'none',
            () => document.getElementById("early-prompt").style.display = 'none',
            () => document.getElementById("emergency-stop-button").style.display = 'none',
            () => document.getElementById("overstudy-button").style.display = 'none',
        ],
        'functions_leave': [
            // hide task list
            () => document.getElementById("c-task-list").leave_animate()
        ],
    },

    // the timer is counting down (working)
    'timer_during_countdown': {
        'next_states': [
            'timer_ringing', // Cycle ends naturally
            'timer_init', // Occurs when Emergency Stop
        ],
        'functions_enter': [
            () => console.log('[timer_during_countdown]'),
            // change buttons shown, change timer label
            () => {
                // should show
                document.getElementById("emergency-stop-button").style.display = window.user_data.settings.allow_emergency_stop ? 'initial' : 'none';
                document.getElementById("overstudy-button").style.display = 'initial';
                document.getElementById("timer-label").innerHTML = "Work";
                // should NOT show
                document.getElementById("start-button").style.display = 'none';
                document.getElementById("add-cycle-button").style.display = 'none';
                document.getElementById("early-prompt").style.display = 'none';
                document.getElementById("settings-btn").style.visibility = 'hidden';
                document.getElementById("tasklist-btn").style.visibility = 'hidden';
                document.getElementById("help-button").style.display = 'none';
                document.getElementById("c-task-list").leave_animate();
                // refreshes
                window.update_status();
            },
            // initiate countdown if not counting down, or return to init if no more tasks
            () => { if (current_task() == null) transition(window.statelet(), 'timer_init'); },
            () => {
                if (!document.getElementById("timer-display").is_countingdown()) {
                    let time_limit = window.user_data.settings.working_sec;
                    document.getElementById("timer-display").trigger_countdown(time_limit, () => {
                        // when done
                        current_task().cycles_completed += 1;
                        update_task(current_task());
                        transition(window.statelet(), 'timer_ringing');
                    });
                }
            },
        ],
        'functions_leave': [
        ],
    },

    // the timer is ringing (when work countdown timeouts)
    'timer_ringing': {
        'next_states': [
            'timer_init', // User decides to Emergency Stop
            'timer_break_countdown', // User takes a break naturally
        ],
        'functions_enter': [
            () => console.log('[timer_ringing]'),
            // Update the page
            () => {
                // should show
                document.getElementById("emergency-stop-button").style.display = window.user_data.settings.allow_emergency_stop ? 'initial' : 'none';
                document.getElementById("timer-label").innerHTML = "Ringing";
                // should NOT show
                document.getElementById("start-button").style.display = 'none';
                document.getElementById("overstudy-button").style.display = 'none';
                document.getElementById("early-prompt").style.display = 'none';
                document.getElementById("add-cycle-button").style.display = 'none';
                document.getElementById("help-button").style.display = 'none';
                document.getElementById("settings-btn").style.visibility = 'hidden';
                document.getElementById("tasklist-btn").style.visibility = 'hidden';
                // refreshes
            },
            // Ring
            () => { document.getElementById("timer-display").ring(); },
            // Automatically go to break after 3 seconds
            () => { setTimeout(() => transition(window.statelet(), 'timer_break_countdown'), 3000); }

        ],
        'functions_leave': [
            // Stop Ringing
            () => { document.getElementById("timer-display").stop_ring(); }
        ],
    },
    'timer_break_countdown': {
        'next_states': [
            'timer_init',
            'timer_during_countdown',
            'timer_toggle_task_list'
        ],
        'functions_enter': [
            () => console.log('[timer_break_countdown]'),
            // Update the page
            () => {
                // should show
                document.getElementById("add-cycle-button").style.display = 'initial';
                document.getElementById("tasklist-btn").style.visibility = 'visible';
                document.getElementById("emergency-stop-button").style.display = window.user_data.settings.allow_emergency_stop ? 'initial' : 'none';
                // should NOT show
                document.getElementById("start-button").style.display = 'none';
                document.getElementById("overstudy-button").style.display = 'none';
                document.getElementById("settings-btn").style.display = 'none';
                document.getElementById("help-button").style.display = 'none';
                document.getElementById("early-prompt").style.display = 'none';
            },
            // decide between short or long break
            () => {
                if (!document.getElementById("timer-display").is_countingdown()) {
                    // get break status 
                    let break_string = window.active_userstate().break_status.break;
                    let sec_limit = window.user_data.settings[`${break_string}_sec`];
                    // set label
                    if(break_string == "short_break") {
                        document.getElementById("timer-label").innerHTML = "Short Break";
                    } else {
                        document.getElementById("timer-label").innerHTML = "Long Break";
                    }
                    document.getElementById("timer-display").trigger_countdown(sec_limit, () => {
                        // advance 1 break cycle
                        window.advance_break_cycle();
                        transition(window.statelet(), 'timer_during_countdown');
                    });
                }
            },
        ],
        'functions_leave': [
            // advance task if completed
            () => {
                if (window.is_finished(window.current_task())) {
                    window.advance_task();
                }
            }
        ],
    }
}
