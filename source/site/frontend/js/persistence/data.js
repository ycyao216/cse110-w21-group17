import { postData } from '../utils.js';
/*
    Developer Note: A Screen refresh should always be triggered by a data change
    Please do not refresh elements that shows the info of the data elsewhere
    Everything in this file is global because there is only 1 data for 1 browser session
*/

// CRUD Operations on user_data
/**
 * Convert task to data to be pushed into local storage or cloud sync
 * @param {*} task - task information to be converted
 * @param {*} prev_task_id - id of previous task to make new id
 * @function
 */
export function create_task(task, prev_task_id = null) {
    let prev_idx = window.user_data.task_list_data.findIndex(x => x.id == prev_task_id);
    window.user_data.task_list_data.splice(prev_idx !== -1 ? prev_idx + 1 : window.user_data.task_list_data.length, 0, task);

    // Refresh screen
    document.getElementById("c-task-list").refresh_list();

    // Sync
    upload_userdata();
}

/**
 * Delete the task with the matching id from the local storage or cloud sync
 * @param {*} task_id - id of task to delete
 */
export function delete_task(task_id) {
    window.user_data.task_list_data = window.user_data.task_list_data.filter(x => x.id !== task_id);

    // Sync
    upload_userdata();
}

/**
 * Read the data of the task with the matching id in local storage or cloud sync
 * @param {*} task_id - id of task to read
 * @returns task with matching id
 */
export function read_task(task_id) {
    let tasks = window.user_data.task_list_data.filter(x => x.id === task_id);
    return tasks.length > 0 ? tasks[0] : null;
}

/**
 * Update task with new data in local storage or cloud sync
 * @param {*} task - id of task to update
 */
export function update_task(task) {
    let idx = window.user_data.task_list_data.findIndex(x => x.id === task.id);
    window.user_data.task_list_data[idx] = task;

    // Refresh screen
    document.getElementById("c-task-list").refresh_list(); // TODO current implementation is slow
    window.update_status();

    // Sync
    upload_userdata();
}

/**
 * Update settings stored in local storage or cloud sync by grabbing from current settings
 * @param {*} settings - new setting data
 */
export function update_settings(settings) {
    // Refresh Settings
    document.getElementById("c-settings").refresh();

    // Sync
    upload_userdata();
}

/**
 * Upload/Reupload entire user data to local storage or cloud sync
 * @function
 */
export function upload_userdata() {
    window.active_userstate().last_active = Date.now();
    if (window.userid !== "") {
        postData('/uploaduserdata', {
            "token": window.userid,
            "data": window.user_data
        })
            .then(data => {
                console.log("Sync Successful");
                // data ready
                window.user_data = data; //data
            })
    } else {
        // User logged in anonymously
        localStorage.setItem('user_data', JSON.stringify(window.user_data));
    }
}

// Macros
/**
 * Move order of task in local storage or cloud-sync
 * @param {*} task_id - id of task to move
 * @param {*} offset - amount to move task up or down
 * @function
 */
export function move_task(task_id, offset) {
    let fromidx = window.user_data.task_list_data.findIndex(x => x.id === task_id);
    let toidx = fromidx;
    // traverse the task list, and stop at the next running task, or at the ends
    do {
        toidx += offset / Math.abs(offset);
    } while (toidx < window.user_data.task_list_data.length - 1 && toidx > 0 && !is_pending(window.user_data.task_list_data[toidx]))
    // to protect the tast from being out of bound
    toidx = Math.min(Math.max(toidx, 0), window.user_data.task_list_data.length - 1)
    // swap
    var temp = window.user_data.task_list_data[fromidx];
    window.user_data.task_list_data[fromidx] = window.user_data.task_list_data[toidx];
    window.user_data.task_list_data[toidx] = temp;

    update_task(window.user_data.task_list_data[fromidx]);
    update_task(window.user_data.task_list_data[toidx]);
}

/**
 * Increment number of break cycles done in current break type
 * @function
 */
export function advance_break_cycle() {
    // advance break status
    let break_string = active_userstate().break_status.break;
    let cycles_limit = window.user_data.settings[`${break_string}_cycles`];
    window.active_userstate().break_status.cycles += 1;
    if (active_userstate().break_status.cycles + 1 > cycles_limit) {
        active_userstate().break_status.cycles = 0;
        active_userstate().break_status.break = break_string === "short_break" ? "long_break" : "short_break"; //dirty code
    }
}

/**
 * Advance task to next unfinished task in local storage/cloud-sync
 * @function
 */
export function advance_task() {
    window.active_userstate().current_task = window.next_task_id();
    document.getElementById('c-task-list').refresh_list();

    // Sync
    upload_userdata();
}

/**
 * Update current/previous state in local storage/cloud sync
 * @function
 */
export function update_state() {
    window.active_userstate().timer_state = window.statelet();

    // Sync
    upload_userdata();
}

// Easy Access
/**
 * Accessors for current task
 * @function
 * @returns current task
 */
export function current_task() {
    return read_task(active_userstate().current_task);
}

/**
 * Accessors for timer state
 * @function
 * @returns state of timer
 */
export function statelet() {
    return active_userstate().timer_state;
}

/**
 * Checks if task is finished by comparing to estimation
 * @param {*} task - task to check
 * @function
 * @returns boolean matching if task is finished or not
 */
export function is_finished(task) {
    return task.cycles_completed >= task.pomo_estimation;
}

/**
 * Checks if task is currently running
 * @param {*} task - task to check
 * @function
 * @returns boolean matching if task is running or not
 */
export function is_running(task) {
    if (window.current_task() == null) return false;
    if (task == null) return false;
    return task.id === window.current_task().id;
}

/**
 * Checks if task is in pending
 * @param {*} task - task to check
 * @function
 * @returns boolean matching if task is pending or not
 */
export function is_pending(task) {
    return !is_running(task) && !is_finished(task);
}

/**
 * Grabs the next task's id
 * @function
 * @returns id of next task
 */
export function next_task_id() {
    let pending_list = window.user_data.task_list_data.filter(x => is_pending(x));
    return pending_list.length == 0 ? null : pending_list[0].id;
}

/**
 * Accessor for current user
 * @function
 * @returns current user's data
 */
export function active_userstate() {
    return window.user_data.user_log;
}
