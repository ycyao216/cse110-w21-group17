import { postData } from '../utils.js';
/*
    Developer Note: A Screen refresh should always be triggered by a data change
    Please do not refresh elements that shows the info of the data elsewhere
    Everything in this file is global because there is only 1 data for 1 browser session
*/

// CRUD Operations on user_data
export function create_task(task, prev_task_id = null) {
    let prev_idx = window.user_data.task_list_data.findIndex(x => x.id == prev_task_id);
    window.user_data.task_list_data.splice(prev_idx !== -1 ? prev_idx + 1 : window.user_data.task_list_data.length, 0, task);

    // Refresh screen
    document.getElementById("c-task-list").refresh_list();

    // Sync
    upload_userdata();
}

export function delete_task(task_id) {
    window.user_data.task_list_data = window.user_data.task_list_data.filter(x => x.id !== task_id);

    // Sync
    upload_userdata();
}

export function read_task(task_id) {
    let tasks = window.user_data.task_list_data.filter(x => x.id === task_id);
    return tasks.length > 0 ? tasks[0] : null;
}

export function update_task(task) {
    let idx = window.user_data.task_list_data.findIndex(x => x.id === task.id);
    window.user_data.task_list_data[idx] = task;

    // Refresh screen
    document.getElementById("c-task-list").refresh_list(); // TODO current implementation is slow
    window.update_status();

    // Sync
    upload_userdata();
}

export function update_settings(settings) {
    // Refresh Settings
    document.getElementById("c-settings").refresh();

    // Sync
    upload_userdata();
}

export function upload_userdata() {
    if (window.userid !== "") {
        postData('/uploaduserdata', {
            "token": window.userid,
            "data": window.user_data
        })
            .then(data => {
                console.log("Sync Successful");
                // data ready
                window.user_data = data; //data
            }) // JSON from `response.json()` call
            .catch(error => { console.error(error); })
    }
}

// Macros
export function move_task(task_id, offset) {
    let fromidx = window.user_data.task_list_data.findIndex(x => x.id === task_id);
    let toidx = fromidx;
    // traverse the task list, and stop at the next running task, or at the ends
    do {
        toidx += offset/Math.abs(offset);
    }while (toidx < window.user_data.task_list_data.length-1 && toidx > 0 && !is_pending(window.user_data.task_list_data[toidx]))
    // to protect the tast from being out of bound
    toidx = Math.min(Math.max(toidx, 0), window.user_data.task_list_data.length - 1)
    // swap
    var temp = window.user_data.task_list_data[fromidx];
    window.user_data.task_list_data[fromidx] = window.user_data.task_list_data[toidx];
    window.user_data.task_list_data[toidx] = temp;

    update_task(window.user_data.task_list_data[fromidx]);
    update_task(window.user_data.task_list_data[toidx]);
}

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

export function advance_task() {
    window.active_userstate().current_task = window.next_task_id();
    document.getElementById('c-task-list').refresh_list();

    // Sync
    upload_userdata();
}

// Easy Access
export function current_task() {
    return read_task(active_userstate().current_task);
}

export function is_finished(task) {
    return task.cycles_completed >= task.pomo_estimation;
}

export function is_running(task) {
    if (window.current_task() == null) return false;
    if (task == null) return false;
    return task.id === window.current_task().id;
}

export function is_pending(task) {
    return !is_running(task) && !is_finished(task);
}

export function next_task_id() {
    let pending_list = window.user_data.task_list_data.filter(x => is_pending(x));
    return pending_list.length == 0 ? null : pending_list[0].id;
}

export function active_userstate() {
    let log = window.user_data.user_log;
    return log[log.length - 1];
}
