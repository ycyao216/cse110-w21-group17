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
}

export function delete_task(task_id) {
    window.user_data.task_list_data = window.user_data.task_list_data.filter(x => x.id !== task_id);
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
}

export function update_settings() {
    // update backend
    // TODO
    // Refresh Settings
    // TODO
}

// Macros
export function move_task(task_id, offset) {
    let fromidx = window.user_data.task_list_data.findIndex(x => x.id === task_id);
    let toidx = Math.min(Math.max(fromidx + offset, 0), window.user_data.task_list_data.length - 1)

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
    if (active_userstate().break_status.cycles > cycles_limit) {
        active_userstate().break_status.cycles = 0;
        active_userstate().break_status.break = break_string === "short_break" ? "long_break" : "short_break"; //dirty code
    }
}

export function advance_task() {
    window.active_userstate().current_task = window.next_task_id();
    document.getElementById('c-task-list').refresh_list();
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

export function next_task_id() {
    let current_task_inner = current_task();
    let fromidx = window.user_data.task_list_data.findIndex(x => x.id === current_task_inner.id);
    let next_task = window.user_data.task_list_data[fromidx + 1];
    return (next_task == null) ? null : next_task.id;
}

export function active_userstate() {
    let log = window.user_data.user_log;
    return log[log.length - 1];
}
