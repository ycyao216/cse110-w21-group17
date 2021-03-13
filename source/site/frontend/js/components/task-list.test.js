import { create_task, delete_task, read_task, update_task, current_task, move_task, active_userstate, advance_break_cycle, next_task_id, is_running, is_finished, advance_task,is_pending, update_settings } from '../persistence/data.js';
import { define_task } from '../components/task.js';
import { define_task_list } from '../components/task-list.js';
import { readFileSync } from 'fs';
const fetch = require('node-fetch');

import { JSDOM } from "jsdom"
const dom = new JSDOM()
global.document = null;
global.window = null;
global.document = dom.window.document
global.window = dom.window
var document = global.document;
var window = global.window;

var task_list_text = readFileSync("frontend/html/components/task-list.html", 'utf8');
var task_text = readFileSync("frontend/html/components/task.html", 'utf8');
let CTask_list = define_task_list(task_list_text);
let CTask = define_task(task_text);

document.body.innerHTML = "<div>" + "<main id='main-area'>test<div id='testing-area'><p id='current-task'></p></div></main>" + "</div>";
var task_list = new CTask_list;
task_list.setAttribute('id', 'side-bar');
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


test("new add task",()=>{
    task_list.new_add_task();
    let child_count = 0;
    for (let eles of task_list.pendning_list.childNodes){
        if (eles.nodeType == "C-TASK"){
            console.log(eles)
            child_count += 1;
        }
    }
    expect(child_count).toBe(1);
})

test("enter_animate",()=>{
    task_list.enter_animate();
    expect(document.getElementById("side-bar").shadowRoot.style.left).toBe("60%");
})

test("leave animate",()=>{
    task_list.leave_animate();
    expect(document.getElementById("side-bar").shadowRoot.style.left).toBe("100%");
})

test('create task element',()=>{
    let task_data = new Test_task(1,"test",3,0);
    let result = task_list.create_task_element(task_data);
    expect(result.task.id).toBe(1);
    expect(result.task.description).toBe("test");
    let task_data2 = new Test_task(2,"test 2",3,3);
    result = task_list.create_task_element(task_data2);
    expect(result.task.id).toBe(2);
    expect(result.task.description).toBe("test 2");
})
