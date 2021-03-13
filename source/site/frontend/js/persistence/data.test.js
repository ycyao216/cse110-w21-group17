import { create_task, delete_task, read_task, update_task, current_task, move_task, active_userstate, advance_break_cycle, next_task_id, is_running, is_finished, advance_task,is_pending, update_settings, statelet,update_status, update_state } from './data.js';
import { define_task } from '../components/task.js';
import { define_task_list } from '../components/task-list.js';
import { readFileSync } from 'fs';
const fetch = require('node-fetch');

import { JSDOM } from "jsdom"
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window
var document = global.document;
var window = global.window;

var task_list_text = readFileSync("frontend/html/components/task-list.html", 'utf8');
var task_text = readFileSync("frontend/html/components/task.html", 'utf8');
let CTask_list = define_task_list(task_list_text);
let CTask = define_task(task_text);

document.body.innerHTML = "<div>" + "<main id='main-area'>test<div id='testing-area'><p id='current-task'></p></div></main>" + "</div>";
let task_list = document.createElement('c-task-list');
task_list.setAttribute('id', 'c-task-list');
document.getElementById("testing-area").appendChild(task_list);

window.active_userstate = active_userstate;
window.advance_break_cycle = advance_break_cycle;

//// opertions on data
window.create_task = create_task;
window.delete_task = delete_task;
window.read_task = read_task;
window.update_task = update_task;
window.current_task = current_task;
window.move_task = move_task;
window.next_task_id = next_task_id;
window.is_finished = is_finished;
window.is_running = is_running;
window.advance_task = advance_task;
window.update_state = update_state;
window.statelet = statelet;

window.update_status = () => {
    document.getElementById("current-task").innerText =
        window.current_task() == null ? "Please add a task" :
            "Task Name: " + window.current_task().description +
            "\nDone: " + window.current_task().cycles_completed +
            " of " + window.current_task().pomo_pomo_estimation;
}

var Mock_user_data = {
    "task_list_data": [
    ],
    "user_log": [
        {
            "login_timestamp": "",
            "timer_state": {
                "current": "timer_init",
                "previous": "timer_during_countdown"
            },
            "current_task": 1,
            "break_status": {
                "break": "short_break",
                "cycles": 0
            },
            "log": [
                "1579afed-2143-49e4-8768-b0d54eba43f8",
                "short_break",
            ],
            "online": true
        }
    ],
    "settings": {
        "working_sec": 6,
        "short_break_sec": 3,
        "short_break_cycles": 3,
        "long_break_sec": 5,
        "long_break_cycles": 1,
        "allow_emergency_stop": true
    }
}

window.user_data = Mock_user_data;

function Test_task(id, task_name, cycles, completed) {
    this.id = id;
    this.description = task_name;
    this.pomo_estimation = cycles;
    this.cycles_completed = completed;
}

/**
 * @fixme the test does not pass due to document cannot be accessed without the
 * site running.
 * @note The task creation is correct
 */
test("create task", () => {
    create_task(new Test_task(1, "Example Task", 4, 0));
    expect(window.user_data.task_list_data.length).toBe(1);
    expect(window.user_data.task_list_data[0].id).toBe(1);
    expect(window.user_data.task_list_data[0].description).toBe("Example Task");
    create_task(new Test_task(2, "Example Task 2", 3, 0));
    expect(window.user_data.task_list_data.length).toBe(2);
    expect(window.user_data.task_list_data[1].description).toBe("Example Task 2");
    window.user_data.task_list_data = [];
})

test('current task', () => {
    create_task(new Test_task(1, "Completed", 3, 3));
    window.user_data.user_log.current_task = 1;
    console.log(current_task().id ===  window.user_data.user_log.current_task)
    expect(current_task().description).toBe("Completed");
    window.user_data.task_list_data = [];
    window.user_data.user_log.current_task = "";
})

test('Delete task', () => {
    jest.spyOn(document, 'getElementById');
    create_task(new Test_task(1, "Example Task", 4, 0));
    create_task(new Test_task(2, "Example Task", 4, 0));
    create_task(new Test_task(3, "Example Task", 4, 0));
    delete_task(1);
    delete_task(2);
    expect(window.user_data.task_list_data.length).toBe(1);
    delete_task(999);
    expect(window.user_data.task_list_data.length).toBe(1);
    window.user_data.task_list_data = [];

})


test('Read task', () => {
    create_task(new Test_task(1, "Example Task1", 4, 0));
    create_task(new Test_task(2, "Example Task2", 3, 0));
    create_task(new Test_task(3, "Example Task2", 1, 0));
    expect(read_task(1).description).toBe("Example Task1");
    expect(read_task(2).description).toBe("Example Task2");
    expect(read_task(10)).toBe(null);
    window.user_data.task_list_data = [];

})

test('Update task', () => {
    create_task(new Test_task(1, "To be modified", 4, 0));
    let new_task = new Test_task(1, "Modified description", 3, 0);
    update_task(new_task);
    expect(window.user_data.task_list_data[0].description).toBe('Modified description');
    expect(window.user_data.task_list_data[0].pomo_estimation).toBe(3);
    window.user_data.task_list_data = [];
})

test('move task', () => {
    create_task(new Test_task(1, "Example Task1", 4, 0));
    create_task(new Test_task(2, "Example Task2", 3, 0));
    create_task(new Test_task(3, "Example Task2", 1, 0));
    move_task(1, 1);
    expect(window.user_data.task_list_data[1].description).toBe("Example Task1");
    move_task(2, 100);
    expect(window.user_data.task_list_data[2].description).toBe("Example Task2");
    window.user_data.task_list_data = [];
})

test('advance_break_cycle', () => {
    for (let i = 1; i < 4; i++) {
        advance_break_cycle();
    }
    expect(window.user_data.user_log[0].break_status.break).toBe('long_break');
    advance_break_cycle();
    expect(window.user_data.user_log[0].break_status.break).toBe('short_break');
    window.user_data.task_list_data = [];
    window.user_data.user_log[0].break_status.break = 'short_break';
    window.user_data.user_log[0].break_status.cycles = 0;
})

test('is finished', () => {
    window.user_data.task_list_data = [];
    create_task(new Test_task(1, "Completed", 3, 3));
    create_task(2, "No finished", 3, 2);
    expect(is_finished(window.user_data.task_list_data[0])).toBe(true);
    expect(is_finished(window.user_data.task_list_data[1])).toBe(false);
    window.user_data.task_list_data = [];
})

test('is running', () => {
    window.user_data.task_list_data = [];
    expect(is_running(null)).toBe(false);
    expect(is_running(new Test_task(1,'test',3,1))).toBe(false);
    create_task(new Test_task(1, "Running", 3, 0));
    window.user_data.user_log.current_task = 1;
    expect(is_running(window.user_data.task_list_data[0])).toBe(true);
    window.user_data.task_list_data = [];
    window.user_data.user_log.current_task = "";
})

test('is pending', () => {
    create_task(new Test_task(1, "Completed", 3, 3));
    create_task(new Test_task(2, "No finished", 3, 2));
    create_task(new Test_task(3, "Finished", 4, 4));
    window.user_data.user_log.current_task = 1;
    expect(is_pending(window.user_data.task_list_data[0])).toBe(false);
    expect(is_pending(window.user_data.task_list_data[1])).toBe(true);
    expect(is_pending(window.user_data.task_list_data[2])).toBe(false);
    window.user_data.task_list_data = [];
    window.user_data.user_log.current_task = "";
})


test('advance task', () => {
    create_task(new Test_task(1, "Completed", 3, 3));
    create_task(new Test_task(2, "No finished", 3, 2));
    create_task(new Test_task(3, "Finished", 4, 4));
    window.user_data.user_log.current_task = 1;
    advance_task();
    expect(current_task().description).toBe('No finished');
    window.user_data.task_list_data = [];
    window.user_data.user_log.current_task = "";
})

test('next task id', () => {
    window.user_data.task_list_data = [];
    create_task(new Test_task(5, "Example Task1", 4, 0));
    create_task(new Test_task(6, "Example Task2", 3, 0));
    create_task(new Test_task(1, "Example Task3", 1, 0));
    expect(next_task_id()).toBe(5);
    delete_task(5);
    delete_task(6);
    delete_task(1);
    expect(next_task_id()).toBe(null);
    window.user_data.task_list_data = [];
})

test('settings',()=>{
    let called = jest.spyOn(document, 'getElementById');
    update_settings();
    expect(called).toBe('called');
})

test('statelet',()=>{
    expect(statelet().current).toBe("timer_init");
    expect(statelet().previous).toBe("timer_during_countdown");
})

test('update state',()=>{
    update_state();
    expect(window.user_data.user_log.timer_state.current).toBe("timer_init");
    expect(window.user_data.user_log.timer_state.previous).toBe("timer_during_countdown");
})