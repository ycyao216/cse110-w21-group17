// import modules
import { define_settings } from './components/settings.js';
import { define_timer_display } from './components/timer-display.js';
import { define_control_button } from './components/control-button.js';
import { define_time_picker } from './components/time-picker.js';
import { define_modal } from './components/modal.js';
import { define_task_list } from './components/task-list.js';
import {Task_data, Task_list_data} from './components/task-list-data.js';
import { define_analysis } from './components/analysis.js';
import { force_state, state_transition } from './state_machines/state_machine.js';
import { timer_init } from './state_machines/timer_state_machine.js';
// set global variables

//// state machine
window.state_transition = state_transition;
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

// global variable 
window.current_task_code = 0;

// Event names 
window.FIRST_TIME_START_EVENT = 't_start';
window.TIME_FINISH_EVENT = 't_finish';
window.BREAK_START_EVENT = 'b_start';
window.BREAK_ENDS_EVENT = 'b_ends';
window.FINISH_EARLY_EVENT = 't_finish_early';
window.UPDATE_CURRENT_TASK_EVENT = 'e_update_crr_event';
window.TIMER_ADD_CYCLE_EVENT = 't_add_cycle';
window.NO_RUNNING_EVENT = 'no_running'
// Event Declaration
window.FIRST_TIME_START = new Event(window.FIRST_TIME_START_EVENT);
window.TIME_FINISH = new Event(window.TIME_FINISH_EVENT);
window.BREAK_ENDS = new Event(window.BREAK_ENDS_EVENT);
window.BREAK_START = new Event(window.BREAK_START_EVENT);
window.FINISH_EARLY = new Event(window.FINISH_EARLY_EVENT);
window.TIMER_ADD_CYCLE = new Event(window.TIMER_ADD_CYCLE_EVENT);
window.UPDATE_CURRENT_TASK = new Event(window.UPDATE_CURRENT_TASK_EVENT);
window.NO_RUNNING = new Event(window.NO_RUNNING_EVENT);
//// for timer
window.num_pomos = 0;
window.last_time_set = 0;

// Task-list data 
window.task_list = new Task_list_data();

window.addEventListener(window.UPDATE_CURRENT_TASK_EVENT, function (e) {
    document.getElementById('current-task').innerHTML = window.task_list.current.stringify();
});

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

///// This Section Initializes timer.html's state machine
force_state(timer_init);