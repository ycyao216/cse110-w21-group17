// import modules
import { postData } from './utils.js';
import { define_settings } from './components/settings.js';
import { define_timer_display } from './components/timer-display.js';
import { define_control_button } from './components/control-button.js';
import { define_time_picker } from './components/time-picker.js';
import { define_modal } from './components/modal.js';
import { define_task_list } from './components/task-list.js';
import { Task_data, Task_list_data } from './components/task-list-data.js';
import { define_analysis } from './components/analysis.js';
import { fastforward_state, force_state, transition } from './state_machines/state_machine.js';
import { timer_init } from './state_machines/timer_state_machine.js';
import { task_create } from './state_machines/task_state_machine.js';
// set global variables

//// state machine
window.transition = transition;
window.fastforward_state = fastforward_state;
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
window.current_task = null;

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

// Task List Component
fetch("/html/components/task-list.html")
    .then(stream => stream.text())
    .then(text => define_task_list(text));

// Analysis Component
fetch("/html/components/analysis.html")
    .then(stream => stream.text())
    .then(text => define_analysis(text));


///// This function registers the service worker
navigator.serviceWorker.title = "ffff";
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function () {
        console.log('Service worker registered!');
    });


    // navigator.serviceWorker.addEventListener('message', event => {
    //     // event is a MessageEvent object
    //     console.log(`The service worker sent me a message: ${event.data}`);
    //   });
}

Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});

// function displayNotification() {
//     if (Notification.permission == 'granted') {
//         navigator.serviceWorker.getRegistration().then(function (reg) {
//             reg.showNotification('Hello world!');
//         });
//     }
// }

// displayNotification();
console.log(navigator.serviceWorker.controller);

//// This Section fetches user data from the server and start state machine
postData('/fetchuserdata', {
    "token": "1e250968-7a1b-11eb-9439-0242ac130002",
    "title": "title"
})
    .then(data => {
        console.log(data);
        // data ready
        window.user_data = JSON.parse(localStorage.getItem('user_data')); //data
        window.current_state = timer_init;
        if (window.user_data["user_log"].length > 0){
            let previous_state = window.user_data["user_log"].slice(-1)[0]["timer_state"];
            window.current_state = transition(window.current_state, previous_state);
        }else{
            window.current_state = force_state(timer_init);
        }
        localStorage.setItem('user_data', JSON.stringify(window.user_data));
    }) // JSON from `response.json()` call
    .catch(error => { console.error(error); })


fastforward_state(task_create, "");

