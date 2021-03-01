export var task_create;
export var task_load;
export var task_edit;
export var task_run;
export var task_finish;
export var task_pending;
export var task_delete;

// task lifecycle
//                                /-- task_finish
// task_create \    / task_run  -----
//              >--<  
// task_load   /    \ task_edit
//
//

// 
task_load = {
    'next_states': {
        // get timer_open_settings() {
        //     return timer_open_settings
        // }, // triggered when user pressed the settings button
    },
    'functions_enter': [
        () => console.log("[task_load]"),
        // () => {
        //     document.getElementById("start-button").style.display = 'initial';
        // },
    ],
    'functions_leave': [],
}
