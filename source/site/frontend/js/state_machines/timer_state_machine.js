// Top Level State Machine For Timer.html 

export var timer_init;
export var timer_open_settings;
export var timer_toggle_task_list;
export var timer_ringing;
export var timer_open_analysis;
export var timer_during_countdown;
export var timer_break_countdown;

// init page when user enters website
timer_init = {
    'next_states': {
        get timer_init() {
            return timer_init
        }, // for recover state purposes
        get timer_open_settings() {
            return timer_open_settings
        }, // triggered when user pressed the settings button
        get timer_open_analysis() {
            return timer_open_analysis
        }, // triggered when user pressed the analysis button
        get timer_toggle_task_list() {
            return timer_toggle_task_list
        }, // triggered when user pressed the tasklist button
        get timer_during_countdown() {
            return timer_during_countdown
        }, // triggered when user pressed the start button
        get timer_break_countdown() {
            return timer_break_countdown
        } // could be triggered when user presses emergency stop button
    },
    'functions_enter': [
        () => console.log("[timer_init]"),
        // Set everything to defaultView
        () => {
            document.getElementById("start-button").style.display = 'initial';
            document.getElementById("emergency-stop-button").style.display = 'none';
            document.getElementById("overstudy-button").style.display = 'none';
            document.getElementById("early-prompt").style.display = 'none';
            document.getElementById("timer-label").innerHTML = "Waiting";
            document.getElementById("timer-display").reset_countdown(window.user_data.settings.work_sec)
            window.update_status();
        },
        () => {
            document.getElementById('c-task-list').refresh_list()
        }
    ],
    'functions_leave': [],
}

// opening the settings page
timer_open_settings = {
    'next_states': {
        get timer_init() {
            return timer_init;
        },
    },
    'functions_enter': [
        () => console.log('[timer_open_settings]'),
        // show settings
        () => {
            document.getElementById("c-settings").style.display = 'block';
        },
    ],
    'functions_leave': [
        // hide settings
        () => {
            document.getElementById("c-settings").style.display = 'none';
        },
    ],
}

// opening the analysis page
timer_open_analysis = {
    'next_states': {
        get timer_init() {
            return timer_init;
        },
    },
    'functions_enter': [
        () => console.log('[timer_open_analysis]'),
        // show analysis
        () => {
            document.getElementById("c-analysis").style.display = 'block';
        },
    ],
    'functions_leave': [
        // hide analysis
        () => {
            document.getElementById("c-analysis").style.display = 'none';
        },
    ],
}

// opening the task list
timer_toggle_task_list = {
    'next_states': {
        get timer_init() {
            return timer_init;
        },
    },
    'functions_enter': [
        () => console.log('[timer_toggle_task_list]'),
        // show task list
        () => {
            document.getElementById("c-task-list").enter_animate();
        },
    ],
    'functions_leave': [
        // hide task list
        () => {
            document.getElementById("c-task-list").leave_animate();
        },
    ],
}

// pomo timer states
timer_during_countdown = {
    'next_states': {
        get timer_ringing() {
            return timer_ringing;
        },
        get timer_init() {
            return timer_init;
        },
    },
    'functions_enter': [
        () => console.log('[timer_during_countdown]'),
        // change buttons shown, change timer label
        () => {
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("add-cycle-button").style.display = 'none';
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("overstudy-button").style.display = 'initial';
            document.getElementById("timer-label").innerHTML = "Work";
            document.getElementById("c-task-list").leave_animate();
            window.update_status();
        },
        // initiate countdown
        () => {
            if (current_task() == null) transition(window.current_state, 'timer_init');
        },
        () => {
            let time_limit = window.user_data.settings.work_sec;
            document.getElementById("timer-display").trigger_countdown(time_limit, () => {
                // countdown timeout
                current_task().cycles_completed += 1;
                update_task(current_task());
                transition(window.current_state, 'timer_ringing');
            });
        },
    ],
    'functions_leave': [
    ],
}

timer_ringing = {
    'next_states': {
        get timer_init() {
            return timer_init;
        },
        get timer_break_countdown() {
            return timer_break_countdown;
        },
    },
    'functions_enter': [
        () => console.log('[timer_ringing]'),
        // Update the page
        () => {
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("overstudy-button").style.display = 'none';
            document.getElementById("early-prompt").style.display = 'none';
            document.getElementById("timer-label").innerHTML = "Ringing";
        },
        // Ring
        () => {
            document.getElementById("timer-display").ring();
        },
        () => {
            if (is_finished(current_task())) {
                document.getElementById('c-modal').display_confirm('Did you finish the task?',
                    () => {
                        window.advance_task();
                        transition(window.current_state, 'timer_break_countdown');
                    },
                    () => {
                        window.current_task().pomo_estimation += 1;
                        window.update_task(current_task());
                        transition(window.current_state, 'timer_break_countdown');
                    })
            }else{
                transition(window.current_state, 'timer_break_countdown');
            }
        },
        () => {
        }
    ],
    'functions_leave': [],
}

timer_break_countdown = {
    'next_states': {
        get timer_init() {
            return timer_init
        },
        get timer_during_countdown() {
            return timer_during_countdown
        },
    },
    'functions_enter': [
        () => console.log('[timer_break_countdown]'),
        // Update the page
        () => {
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("add-cycle-button").style.display = 'initial';
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("overstudy-button").style.display = 'none';
        },
        // decide between short or long break
        () => {
            // get break status 
            let break_string = window.active_userstate().break_status.break;
            let sec_limit = window.user_data.settings[`${break_string}_sec`];
            document.getElementById("timer-label").innerHTML = break_string;
            document.getElementById("timer-display").trigger_countdown(sec_limit, () => {
                transition(window.current_state, 'timer_during_countdown');
            });
        },
        // advance 1 break cycle
        () => window.advance_break_cycle()
    ],
    'functions_leave': [
    ],
}