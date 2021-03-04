// CRUD Operations
export function create_task(task, prev_task_id = null) {
    let prev_idx = window.user_data.task_list_data.findIndex(x => x.id == prev_task_id);
    window.user_data.task_list_data.splice(prev_idx !== null ? prev_idx + 1 : window.user_data.task_list_data.length, 0, task);
}

export function delete_task(task_id) {
    // Delete task
    window.user_data.task_list_data = window.user_data.task_list_data.filter(x => x.id !== task_id);
}

export function read_task(task_id) {
    let tasks = window.user_data.task_list_data.filter(x => x.id === task_id);
    return tasks.length > 0 ? tasks[0] : null;
}

export function update_task(task) {
    let idx = window.user_data.task_list_data.findIndex(x => x.id == task_id);
    window.user_data.task_list_data[idx] = task;
}

// Easy Access
export function current_task() {
    return read_task(active_settings().current_task);
}

export function active_settings() {
    let log = window.user_data.user_log;
    return log[log.length - 1];
}

export function next_task(task) {
    let next_task_id = read_task(task_id).next_task;
    return read_task(next_task_id);
}