// Programmer Note: A Screen refresh should always be triggered by a data change
// Please do not refresh elements that shows the info of the data elsewhere

// CRUD Operations
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
}


export function update_settings() {
    // update backend
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

// Easy Access
export function current_task() {
    return read_task(active_userstate().current_task);
}

export function next_task() {
    let current_task_inner = current_task();
    let fromidx = window.user_data.task_list_data.findIndex(x => x.id === current_task_inner.id);
    return read_task(window.user_data.task_list_data[fromidx + 1]);
}

export function active_userstate() {
    let log = window.user_data.user_log;
    return log[log.length - 1];
}
