import { create_task, delete_task, read_task, update_task, current_task, move_task, active_userstate, advance_break_cycle, next_task_id, is_running, is_finished, advance_task,is_pending, update_settings } from '../persistence/data.js';
import { define_task } from './task.js';
import { define_task_list } from './task-list.js';
import { define_modal } from './modal.js';
import { readFileSync } from 'fs';
var fetch = require('node-fetch');

import { JSDOM } from "jsdom"
import { create } from 'domain';
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window
var document = global.document;
var window = global.window;

var task_list_text = readFileSync("frontend/html/components/task-list.html", 'utf8');
var task_text = readFileSync("frontend/html/components/task.html", 'utf8');
var modal_text = readFileSync("frontend/html/components/modal.html", 'utf8');
let CTask_list = define_task_list(task_list_text);
let CTask = define_task(task_text);
let CModal = define_modal(modal_text);

document.body.innerHTML = "<div>" + "<main id='main-area'>test<div id='testing-area'><p id='current-task'></p></div></main>" + "</div>";
let task_list = document.createElement('c-task-list');
task_list.setAttribute('id', 'c-task-list');
document.getElementById("testing-area").appendChild(task_list);
let modal = document.createElement('c-modal');
modal.setAttribute('id',"c-modal");
document.getElementById("testing-area").appendChild(modal);
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
            "timer_state": "timer_init",
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


test('mode view',()=>{
    let test_cTask = new CTask();
    test_cTask.mode_view();
    expect(test_cTask.view_div.style.display).toBe("flex");
    expect(test_cTask.edit_div.style.display).toBe("none");
})

test('mode edit',()=>{
    let test_cTask = new CTask();
    test_cTask.mode_edit();
    expect(test_cTask.view_div.style.display).toBe("none");
    expect(test_cTask.edit_div.style.display).toBe("flex");
})

test('mode non pending',()=>{
    let test_cTask = new CTask();
    test_cTask.mode_non_pending();
    expect(test_cTask.pomo_actual_counter.style.display).toBe("flex");
    expect(test_cTask.edit_div.style.display).toBe("none");
    expect(test_cTask.pomo_delete_btn.style.display).toBe("none");
    expect(test_cTask.pomo_edit_btn.style.display).toBe("none");
    expect(test_cTask.order_btn_up.style.display).toBe("none");
    expect(test_cTask.order_btn_down.style.display).toBe("none");
})

test('populate',()=>{
    let test_cTask = new CTask();
    let task_data = new Test_task(1,"testing task",3,1);
    test_cTask.populate(task_data);
    expect(test_cTask.task).toBe(task_data);
    expect(test_cTask.task.description).toBe("testing task");
    expect(test_cTask.task.pomo_estimation).toBe(3);
})

test("remove task", ()=>{
    let test_cTask = new CTask();
    document.getElementById("c-task-list").appendChild(test_cTask);
    test_cTask.remove_task();
    expect(document.getElementById("c-task-list").querySelector(".c-task")).toBe(null);
    document.getElementById("c-task-list").appendChild(test_cTask);
    let task_data = new Test_task(1,"testing task",3,1);
    test_cTask.populate(task_data);
    create_task(task_data);
    test_cTask.remove_task();
    expect(window.user_data.task_list_data.length).toBe(0);
    expect(document.getElementById("c-task-list").querySelector(".c-task")).toBe(null);
})

test("move task",()=>{
    let test_cTask = new CTask();
    let task_data = new Test_task(1,"testing task",3,1);
    test_cTask.populate(task_data);
    let test_cTask2 = new CTask();
    let task_data2 = new Test_task(2,"testing task 2",4,2);
    test_cTask2.populate(task_data2);
    create_task(task_data);
    create_task(task_data2);
    test_cTask2.move(-1);
    expect(window.user_data.task_list_data[0].id).toBe(2);
    test_cTask2.move(1);
    expect(window.user_data.task_list_data[1].id).toBe(2);
    window.user_data.task_list_data = [];
})

test("cancel",()=>{
    let test_cTask = new CTask();
    document.getElementById("c-task-list").appendChild(test_cTask);
    test_cTask.cancel();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(0);
    let test_cTask2 = new CTask();
    document.getElementById("c-task-list").appendChild(test_cTask2);
    let task_data = new Test_task(1,"testing task",3,1);
    test_cTask2.populate(task_data);
    test_cTask2.cancel();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(1);
    expect(test_cTask2.view_div.style.display).toBe("flex");
    expect(test_cTask2.edit_div.style.display).toBe("none");
    document.getElementById("c-task-list").innerHTML = "";
})

test("input validation",()=>{
    let test_cTask = new CTask();
    test_cTask.task_edit.value = "";
    expect(test_cTask.input_validation()).toBe(false);
    test_cTask.task_edit.value = "Task name";
    test_cTask.pomo_counter_edit.value = "4.2";
    expect(test_cTask.input_validation()).toBe(false);
    test_cTask.pomo_counter_edit.value = "0";
    expect(test_cTask.input_validation()).toBe(false);
    test_cTask.pomo_counter_edit.value = "-10";
    expect(test_cTask.input_validation()).toBe(false);
    test_cTask.pomo_counter_edit.value = "3";
    expect(test_cTask.input_validation()).toBe(true);
})

test("split task",()=>{
    let test_cTask = new CTask();
    let task_data = new Test_task(1,"More than 4",9,0);
    let result = test_cTask.split_task(task_data,4);
    expect(result.length).toBe(3);
    expect(result[0].description).toBe("More than 4 Part 1");
    expect(result[2].pomo_estimation).toBe(1);
    let task_data2 = new Test_task(2,"less than 4",2,0);
    result = test_cTask.split_task(task_data2,4);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe("less than 4 Part 1");
    let task_data3 = new Test_task(3,"zero",0,0);
    result = test_cTask.split_task(task_data3,4);
    expect(result.length).toBe(1);
    expect(result[0].pomo_estimation).toBe(0);
})

test("create_or_update", ()=>{
    let test_cTask = new CTask();
    let task_data = new Test_task(1,"Task 1",4,0);
    let task_data2 = new Test_task(2,"Task 2",3,0);
    let list_of_tasks = [];
    list_of_tasks.push(task_data);
    list_of_tasks.push(task_data2);
    test_cTask.create_or_update(list_of_tasks);
    expect(window.user_data.task_list_data.length).toBe(2);
    let task_data3 = new Test_task(2,"Task 2 update",2,0);
    let new_list = [];
    new_list.push(task_data3);
    test_cTask.create_or_update(new_list);
    expect(window.user_data.task_list_data.length).toBe(2);
    expect(window.user_data.task_list_data[1].description).toBe("Task 2 update");
    window.user_data.task_list_data = [];
})

test("confirm",()=>{
    window.user_data.task_list_data=[]
    // Invalid task
    let test_cTask = new CTask();
    document.getElementById('c-task-list').appendChild(test_cTask);
    test_cTask.task_edit.value = "";
    test_cTask.confirm();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(1);
    expect(window.user_data.task_list_data.length).toBe(0);
    // Valid task less than 4
    test_cTask.task_edit.value = "valid description";
    test_cTask.pomo_counter_edit.value = 1;
    test_cTask.confirm();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(0);
    expect(window.user_data.task_list_data.length).toBe(1);
    // Valid task more than 4 confirmed
    let test_cTask2 = new CTask();
    document.getElementById('c-task-list').appendChild(test_cTask2);
    test_cTask2.task_edit.value = "valid description";
    test_cTask2.pomo_counter_edit.value = 9;
    test_cTask2.confirm();
    document.getElementById('c-modal').onclick_confirm_button();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(0);
    expect(window.user_data.task_list_data.length).toBe(4);
    // Valid task more than 4 canceled
    let test_cTask3 = new CTask();
    document.getElementById('c-task-list').appendChild(test_cTask3);
    test_cTask3.task_edit.value = "valid description";
    test_cTask3.pomo_counter_edit.value = 7;
    test_cTask3.confirm();
    document.getElementById('c-modal').onclick_cancel_button();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(0);
    expect(window.user_data.task_list_data.length).toBe(5);
    // Valid task already exist
    let test_cTask4 = new CTask();
    document.getElementById('c-task-list').appendChild(test_cTask4);
    test_cTask4.populate(new Test_task(100,"Already existing",2,0));
    test_cTask4.task_edit.value = "valid description";
    test_cTask4.pomo_counter_edit.value = 3;
    test_cTask4.confirm();
    expect(document.getElementById("c-task-list").childNodes.length).toBe(0);
    expect(window.user_data.task_list_data.length).toBe(6);
    document.getElementById('c-task-list').innerHTML = "";
    window.user_data.task_list_data=[]
    expect(true).toBe(true);
})