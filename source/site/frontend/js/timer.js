// import modules
import { define_settings } from './components/settings.js';
import { define_timer_display } from './components/timer-display.js';
import { define_control_button } from './components/control-button.js';
import { define_modal } from './components/modal.js';
import { define_task_list } from './components/task-list.js';
import { define_task } from './components/task.js';
import { force_state, transition } from './state_machines/state_machine.js';
import { timer_init } from './state_machines/timer_state_machine.js';
import { create_task, delete_task, read_task, update_task, current_task, move_task, active_userstate, advance_break_cycle, next_task_id, is_running, is_finished, advance_task } from './persistence/data.js';
// set global variables

//// state machine
window.transition = transition;
window.timer_init = timer_init;

//// messages
window.WORK_TIME = "00:10";
window.SHORT_BREAK = "00:03";
window.LONG_BREAK = "00:04";
window.TIME_UP = "00:00";
window.TIME_UP_SHORT_MSG = "Pomo is done! Now take a short break";
window.TIME_UP_LONG_MSG = "You have done 4 pomos! Good job! Now take a long break!";
window.TIME_UP_WORK_MSG = "Break is over! Now get back to the tasks!";
window.EMERG_STOP_WARNING = "Are you sure? If you stop now, you will lose these sessions!"
window.OVERSTUDY_MSG = "Great job! Don't start the next task yet, reflect on your current task!"

// Added example events to text compatibilities with event listener
window.TIME_START_EVENT = 't_start';
window.TIME_FINISH_EVENT = 't_finish';
window.FINISH_EARLY_EVENT = 't_finish_early';
window.TIME_START = new Event(window.TIME_START_EVENT);
window.TIME_FINISH = new Event(window.TIME_FINISH_EVENT);
window.FINISH_EARLY = new Event(window.FINISH_EARLY_EVENT);


//// Settings
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
window.user_data = {
    "task_list_data": [
        {
            "id": "1579afed-2143-49e4-8768-b0d54eba43f8",
            "description": "task 1",
            "pomo_estimation": 4,
            "cycles_completed": 0,
            "last_timer_start": null,
        },
        {
            "id": "97bf356c-3910-45f5-950e-34acc6319b83",
            "description": "task 2",
            "pomo_estimation": 2,
            "cycles_completed": 0,
            "last_timer_start": null,
        }
    ],
    "user_log": [
        {
            "login_timestamp": "",
            "timer_state": "timer_init",
            "current_task": "1579afed-2143-49e4-8768-b0d54eba43f8",
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
        "work_sec": 6,
        "short_break_sec": 3,
        "short_break_cycles": 1,
        "long_break_sec": 5,
        "long_break_cycles": 4,
        "allow_emergency_stop": true
    }
}

//// Macros
window.emergency_stop_btn = () => {
    document.getElementById('c-modal').display_confirm(EMERG_STOP_WARNING,
        () => {
            document.getElementById('timer-display').reset_countdown();
            transition(window.current_state, 'timer_init');
        },
        () => { }
    )
}
window.finish_early_btn = () => {
    document.getElementById('c-modal').display_alert(OVERSTUDY_MSG);
    document.getElementById('early-prompt').style.display = 'initial';
    current_task().pomo_estimation = current_task().cycles_completed + 1;
    update_task(current_task());
}
window.start_btn = () => {
    if (current_task() == null) window.advance_task();
    if (current_task() != null) transition(window.current_state, 'timer_during_countdown');
}
window.add_cycle_btn = () => {
    window.current_task().pomo_estimation += 1;
    window.update_task(current_task());
}
window.update_status = () => {
    document.getElementById("current-task").innerText =
        window.current_task() == null ? "Please add a task" :
            "Task Name: " + window.current_task().description +
            "\nDone: " + Math.min((window.current_task().cycles_completed + 1), window.current_task().pomo_estimation) +
            " of " + window.current_task().pomo_estimation;
}

// This Section Imports Requires Components
// Settings Component
fetch("/html/components/settings.html")
    .then(stream => stream.text())
    .then(text => define_settings(text));

// Timer Display Component
fetch("/html/components/timer-display.html")
    .then(stream => stream.text())
    .then(text => define_timer_display(text));

// Control Button Component
fetch("/html/components/control-button.html")
    .then(stream => stream.text())
    .then(text => define_control_button(text))

// Modal Component
fetch("/html/components/modal.html")
    .then(stream => stream.text())
    .then(text => define_modal(text));

// Task Component
fetch("/html/components/task.html")
    .then(stream => stream.text())
    .then(text => define_task(text));

// Task List Component
fetch("/html/components/task-list.html")
    .then(stream => stream.text())
    .then(text => define_task_list(text));


//// This Section fetches user data from the server and start state machine
// wait a while for the content to load

// postData('/fetchuserdata', {
//     "token": "1e250968-7a1b-11eb-9439-0242ac130002",
//     "title": "title"
// })
//     .then(data => {
//         console.log(data);
//         // data ready
//         window.user_data = JSON.parse(localStorage.getItem('user_data')); //data
//         window.current_state = timer_init;
//         if (window.user_data["user_log"].length > 0) {
//             let previous_state = window.user_data["user_log"].slice(-1)[0]["timer_state"];
//             transition(window.current_state, previous_state);
//         } else {
//             window.current_state = force_state(timer_init);
//         }
//         localStorage.setItem('user_data', JSON.stringify(window.user_data));
//     }) // JSON from `response.json()` call
//     .catch(error => { console.error(error); })


// Initialize the timer state machine
setTimeout(() => window.current_state = force_state(timer_init), 500);

