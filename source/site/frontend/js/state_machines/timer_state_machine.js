// Top Level State Machine For Timer.html 

export var timer_init;
export var timer_open_settings;
export var timer_toggle_task_list;
export var timer_ringing;
export var timer_open_analysis;
export var timer_during_countdown;
export var timer_break_countdown;
export var timer_emergency_stop;

// init page when user enters website
timer_init = {
    'attatched_states': [],
    'next_states': {
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
    },
    'functions_enter': [
        () => console.log("[timer_init]"),
        () => {
            document.getElementById("start-button").style.display = 'initial';
        },
        () => {
            document.getElementById("emergency-stop-button").style.display = 'none';
        },
        () => {
            document.getElementById("overstudy-button").style.display = 'none';
        },
        () => {
            document.getElementById("early-prompt").style.display = 'none';
        },
        () => {
            document.getElementById("timer-label").innerHTML = "Waiting";
        },
    ],
    'functions_leave': [],
}

// opening the settings page
timer_open_settings = {
    'attatched_states': [],
    'next_states': {
        get timer_init() {
            return timer_init
        },
    },
    'functions_enter': [
        () => console.log('[timer_open_settings]'),
        () => {
            document.getElementById("c-settings").style.display = 'block';
        },
    ],
    'functions_leave': [
        () => {
            document.getElementById("c-settings").style.display = 'none';
        },
    ],
}

// opening the analysis page
timer_open_analysis = {
    'attatched_states': [],
    'next_states': {
        get timer_init() {
            return timer_init
        },
    },
    'functions_enter': [
        () => console.log('[timer_open_analysis]'),
        () => {
            document.getElementById("c-analysis").style.display = 'block';
        },
    ],
    'functions_leave': [
        () => {
            document.getElementById("c-analysis").style.display = 'none';
        },
    ],
}

// opening the task list
timer_toggle_task_list = {
    'attatched_states': [],
    'next_states': {
        get timer_init() {
            return timer_init
        },
    },
    'functions_enter': [
        () => console.log('[timer_toggle_task_list]'),
        () => {
            document.getElementById("c-task-list").enter_animate();
        },
    ],
    'functions_leave': [
        () => {
            document.getElementById("c-task-list").leave_animate();
        },
    ],
}

// pomo timer states
timer_during_countdown = {
    'attatched_states': [],
    'next_states': {
        get timer_ringing() {
            return timer_ringing
        },
        get timer_emergency_stop() {
            return timer_emergency_stop
        },
        get timer_finished_early() {
            return timer_finished_early
        },
    },
    'functions_enter': [
        () => console.log('[timer_during_countdown]'),
        () => {
            document.getElementById("start-button").style.display = 'none';
        },
        () => {
            document.getElementById("emergency-stop-button").style.display = 'initial';
        },
        () => {
            document.getElementById("overstudy-button").style.display = 'initial';
        },
        () => {
            document.getElementById("timer-label").innerHTML = "Work";
        },
        () => {
            document.getElementById("timer-display").trigger_countdown(10, () => {
                state_transition('timer_ringing');
            });
        },
    ],
    'functions_leave': [
        () => {
            document.getElementById("timer-display").incr_pomo();
        },
    ],
}

timer_emergency_stop = {
    'attatched_states': [],
    'next_states': {
        get timer_init() {
            return timer_init
        },
        get timer_during_countdown() {
            return timer_during_countdown
        },
    },
    'functions_enter': [
        () => console.log('[timer_emergency_stop]'),
        () => {
            document.getElementById('c-modal').display_confirm(
                EMERG_STOP_WARNING,
                () => {
                    document.getElementById("timer-display").trigger_emergency_stop();
                    state_transition('timer_init');
                },
                () => {}
            )
        }
    ],
    'functions_leave': [],
}

timer_ringing = {
    'attatched_states': [],
    'next_states': {
        get timer_init() {
            return timer_init
        },
        get timer_break_countdown() {
            return timer_break_countdown
        },
    },
    'functions_enter': [
        () => console.log('[timer_ringing]'),
        () => {
            document.getElementById("start-button").style.display = 'none';
        },
        () => {
            document.getElementById("emergency-stop-button").style.display = 'initial';
        },
        () => {
            document.getElementById("overstudy-button").style.display = 'none';
        },
        () => {
            document.getElementById("early-prompt").style.display = 'none';
        },
        () => {
            document.getElementById("timer-label").innerHTML = "Ringing";
        },
        () => {
            document.getElementById("timer-display").ring();
        },
        () => {
            state_transition('timer_break_countdown');
        }
    ],
    'functions_leave': [],
}

timer_break_countdown = {
    'attatched_states': [],
    'next_states': {
        get timer_init() {
            return timer_init
        },
        get timer_during_countdown() {
            return timer_during_countdown
        },
        get timer_emergency_stop() {
            return timer_emergency_stop
        },
    },
    'functions_enter': [
        () => console.log('[timer_break_countdown]'),
        () => {
            document.getElementById("start-button").style.display = 'none';
        },
        () => {
            document.getElementById("emergency-stop-button").style.display = 'initial';
        },
        () => {
            document.getElementById("overstudy-button").style.display = 'none';
        },
        () => {
            // TODO: Get long/short break values from settings page
            if (document.getElementById("timer-display").isLongBreak()) {
                document.getElementById("timer-display").trigger_countdown(8, () => {
                    state_transition('timer_during_countdown');
                });
                document.getElementById("timer-label").innerHTML = "Long Break";
            } else {
                document.getElementById("timer-display").trigger_countdown(5, () => {
                    state_transition('timer_during_countdown');
                });
                document.getElementById("timer-label").innerHTML = "Short Break";
            }
        }
    ],
    'functions_leave': [
        () => {
            document.getElementById("timer-display").ring();
        }
    ],
}