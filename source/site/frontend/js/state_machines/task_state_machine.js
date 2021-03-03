import { fastforward_state, force_state, transition } from './state_machine.js';

export var task_create;
export var task_load;
export var task_edit;
export var task_pending;
export var task_run;
export var task_finish;
export var task_delete;

// This state machine is for ONE task only. The `target` argument in the
// next_state_string function IS the task object

// This state machine supports fastforward; so all functions much have exaclty ONE target argument

// task lifecycle adjacency list
// task_create -> task_load
// task_load -> task_pending/task_run/task_finish
// task_pending -> task_run/task_edit
// task_run -> task_finish/task_edit
// task_finish -> task_edit
// task_edit -> task_load/task_delete
// task_delete -> task_edit

task_create = {
    'next_states': {
        get task_load() {
            return task_load
        },
    },
    'functions_enter': [
        (target) => console.log("[task_create]"),
        // Upon task create, we need to:
        // 1. Trigger sync to backend
        (target) => console.log("TODO: perform create operation on backend"),
    ],
    'functions_leave': [],
    'next_state_string': (target) => {
        return "task_load"
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
        (target) => console.log("[task_load]"),
        // Upon task load, we need to:
        // 1. Refresh this item in the tasklist
        (target) => console.log("TODO: refresh this task (either add or modify) in the tasklist"),
    ],
    'functions_leave': [],
    'next_state_string': (target) => {
        if (target.actual_pomo == target.pomo_estimation){
            // The task is done
            return "task_finish";
        }else{
            if (target.start_date == null){
                // The task is scheduled, but not never ran
                return "task_pending";
            }else{
                // The task was running, but for some reason it got reloaded
                return "task_run";
            }
            
        }
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
        (target) => console.log("[task_run]"),
    ],
    'functions_leave': [],
    'next_state_string': (target) => {
        return "task_finish"
    }
}

