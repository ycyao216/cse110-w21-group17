// import modules
import { postData } from './utils.js';
import { define_settings } from './components/settings.js';
import { define_timer_display } from './components/timer-display.js';
import { define_control_button } from './components/control-button.js';
import { define_time_picker } from './components/time-picker.js';
import { define_modal } from './components/modal.js';
import { define_task_list } from './components/task-list.js';
import { define_task } from './components/task.js';
import { Task_data, Task_list_data } from './components/task-list-data.js';
import { define_analysis } from './components/analysis.js';
import { force_state, transition } from './state_machines/state_machine.js';
import { timer_init } from './state_machines/timer_state_machine.js';
import { create_task, delete_task, read_task, update_task, current_task, move_task, active_userstate, advance_break_cycle } from './persistence/data.js';
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


//// for timer
window.num_pomos = 0;
window.last_time_set = 0;

//// Task-list data 
window.task_list = new Task_list_data();

//// Settings
window.active_userstate = active_userstate;
window.advance_break_cycle = advance_break_cycle;

//// New Tasklist
window.create_task = create_task;
window.delete_task = delete_task;
window.read_task = read_task;
window.update_task = update_task;
window.current_task = current_task;
window.move_task = move_task;
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
    .then(text => define_control_button(text));

// Time Picker Component
fetch("/html/components/time-picker.html")
    .then(stream => stream.text())
    .then(text => define_time_picker(text));

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

// Analysis Component
fetch("/html/components/analysis.html")
    .then(stream => stream.text())
    .then(text => define_analysis(text));


///// This function registers the service worker
// navigator.serviceWorker.title = "ffff";
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/service-worker.js').then(function () {
//         console.log('Service worker registered!');
//     });


//     // navigator.serviceWorker.addEventListener('message', event => {
//     //     // event is a MessageEvent object
//     //     console.log(`The service worker sent me a message: ${event.data}`);
//     //   });
// }

// Notification.requestPermission(function (status) {
//     console.log('Notification permission status:', status);
// });


//// This Section fetches user data from the server and start state machine
// wait a while for the content to load
setTimeout(() => window.current_state = force_state(timer_init), 500);

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

