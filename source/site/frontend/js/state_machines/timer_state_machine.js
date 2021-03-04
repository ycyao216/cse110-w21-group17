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
        },
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
        /*get timer_finished_early() {
            return timer_finished_early
        },*/
    },
    'functions_enter': [
        () => console.log('[timer_during_countdown]'),
        // change buttons shown, change timer label
        () => {
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("overstudy-button").style.display = 'initial';
            document.getElementById("timer-label").innerHTML = "Work";
            document.getElementById("c-task-list").leave_animate();
        },
        // initiate countdown
        // TODO: Get time from settings page
        () => {
            window.task_list.upon_cycle_start(true);
            document.getElementById("timer-display").trigger_countdown(10, () => {
                window.current_state = transition(window.current_state, 'timer_ringing');
            });
        },
    ],
    'functions_leave': [
        // increment # of pomos
        () => {
            document.getElementById("timer-display").incr_pomo();
        },
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
            window.current_state = transition(window.current_state, 'timer_break_countdown');
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
        () => {
            navigator.serviceWorker.ready.then(registration => {
                registration.active.postMessage({
                    'title': 'take a break',
                    'message': 'take a break'
                });
            });
        },
        // Update the page
        () => {
            document.getElementById("start-button").style.display = 'none';
            document.getElementById("emergency-stop-button").style.display = 'initial';
            document.getElementById("overstudy-button").style.display = 'none';
        },
        // decide between short or long break
        () => {
            // TODO: Get long/short break values from settings page
            if (document.getElementById("timer-display").isLongBreak()) {
                document.getElementById("timer-display").trigger_countdown(8, () => {
                    window.current_state = transition(window.current_state, 'timer_during_countdown');
                });
                document.getElementById("timer-label").innerHTML = "Long Break";
                //event
                let timer_long_break = new Event('timer_long_break');
                document.dispatchEvent(timer_long_break);
            } else {
                document.getElementById("timer-display").trigger_countdown(5, () => {
                    window.current_state = transition(window.current_state, 'timer_during_countdown');
                });
                document.getElementById("timer-label").innerHTML = "Short Break";
                //event
                let timer_short_break = new Event('timer_short_break');
                document.dispatchEvent(timer_short_break);
            }
        }
    ],
    'functions_leave': [
        () => {
            document.getElementById("timer-display").ring();
        },
        () => {
            //event
            let timer_cycle_complete = new Event('timer_cycle_complete');
            document.dispatchEvent(timer_cycle_complete);
        }
    ],
}