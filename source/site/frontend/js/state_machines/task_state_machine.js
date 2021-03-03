export var task_create;
export var task_load;
export var task_edit;
export var task_pending;
export var task_run;
export var task_finish;
export var task_delete;

// task lifecycle

// task_create -> task_pending/task_run/task_finish
// task_load -> task_pending/task_run/task_finish
// task_pending -> task_run/task_edit
// task_run -> task_finish/task_edit
// task_finish -> task_edit
// task_edit -> task_pending/task_run/task_finish/task_delete
// task_delete -> task_edit

task_create = {
    'next_states': {
        get task_pending() {
            return 
        },
        get task_run() {
            return task_run
        },
        get task_finish() {
            return task_finish
        },
    },
    'functions_enter': [
        () => console.log("[task_create]"),
        // 1. We need to 
    ],
    'functions_leave': [],
    'get_next_state': (target) => {
        return "task_run"
    }
}

task_load = {
    'next_states': {
        get task_pending() {
            return 
        },
        get task_run() {
            return task_run
        },
        get task_finish() {
            return task_finish
        },
    },
    'functions_enter': [
        () => console.log("[task_load]"),
    ],
    'functions_leave': [],
    'get_next_state': (target) => {
        return "task_run"
    }
}

task_run = {
    'next_states': {
        get task_finish() {
            return task_finish
        },
        get task_edit() {
            return task_edit
        },
    },
    'functions_enter': [
        () => console.log("[task_run]"),
    ],
    'functions_leave': [],
    'get_next_state': (target) => {
        return "task_run"
    }
}

