// Top Level State Machine For Timer.html 

var timer_init;
var timer_open_settings;
var timer_toggle_task_list;

timer_init = {
    'attatched_states': [],
    'next_states': {   
        get timer_open_settings() { return timer_open_settings }, // triggered when user pressed the settings button
        get timer_toggle_task_list() { return timer_toggle_task_list }, // triggered when user pressed the tasklist button
    },
    'functions_enter': [
        () => console.log("[timer_init]"),
    ],
    'functions_leave': [],
}


timer_open_settings = {
    'attatched_states': [],
    'next_states': {
        get timer_init() { return timer_init},
    },
    'functions_enter': [
        () => console.log('[timer_open_settings]'),
        () => { document.getElementById("c-settings").style.display = 'block'; },
    ],
    'functions_leave': [
        () => { document.getElementById("c-settings").style.display = 'none'; },
    ],
}

timer_toggle_task_list = {
    'attatched_states': [],
    'next_states': {
        get timer_init() { return timer_init},
    },
    'functions_enter': [
        () => console.log('[timer_toggle_task_list]'),
        () => { document.getElementById("c-task-list").style.display = 'block'; },
    ],
    'functions_leave': [
        () => { document.getElementById("c-task-list").style.display = 'none'; },
    ],
}