// import modules
import { postData } from './utils.js';
import { define_settings } from './components/settings.js';
import { define_timer_display } from './components/timer-display.js';
import { define_control_button } from './components/control-button.js';
import { define_modal } from './components/modal.js';
import { define_task_list } from './components/task-list.js';
import { define_task } from './components/task.js';
import { force_state, transition, rev_transition } from './state_machines/state_machine.js';
import { timer_state_machine } from './state_machines/timer_state_machine.js';
import { create_task, delete_task, read_task, update_task, current_task, move_task, active_userstate, advance_break_cycle, next_task_id, is_running, is_finished, advance_task, update_settings, update_state, statelet } from './persistence/data.js';
// set global variables

//// state machine
window.transition = transition;
window.rev_transition = rev_transition;
window.timer_state_machine = timer_state_machine;

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
window.LOCAL_MSG = "You are currently logged in anonymously. Your data will be preserved locally and will NOT be synced.\n Please enter the website using http://127.0.0.1:3000/user/${your_access_token} in order to enable cloud sync."

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
window.update_settings = update_settings;
window.update_state = update_state;
window.statelet = statelet;
let default_user_data = {
    "task_list_data": [],
    "user_log": [
        {
            "login_timestamp": "",
            "timer_state": {
                "current": "timer_init",
                "previous": "timer_during_countdown"
            },
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
        "working_sec": 1500,
        "short_break_sec": 300,
        "short_break_cycles": 3,
        "long_break_sec": 480,
        "long_break_cycles": 1,
        "allow_emergency_stop": true
    }
}

//// Macros
/**
 * Controls state transition and sends prompt for emergency stop button
 * @function
 */
window.emergency_stop_btn = () => {
    document.getElementById('c-modal').display_confirm(EMERG_STOP_WARNING,
        () => {
            document.getElementById('timer-display').reset_countdown();
            transition(window.statelet(), 'timer_init');
        },
        () => { }
    )
}
/**
 * Controls prompt for finished early button and edits current task to get finished
 * @function
 */
window.finish_early_btn = () => {
    document.getElementById('c-modal').display_alert(OVERSTUDY_MSG);
    document.getElementById('early-prompt').style.visibility = 'visible';
    current_task().pomo_estimation = current_task().cycles_completed + 1;
    update_task(current_task());
}
/**
 * Controls state transition and timer resetting after clicking start button
 * @function
 */
window.start_btn = () => {
    if (current_task() == null){
        window.advance_task();
    }
    /* istanbul ignore else */
    if (current_task() != null){
        transition(window.statelet(), 'timer_during_countdown');
    }
    active_userstate().break_status.cycles = 0;
    active_userstate().break_status.break = "short_break";
}
/**
 * Controls adding a cycle to current task for add cycle button
 * @function
 */
window.add_cycle_btn = () => {
    window.current_task().pomo_estimation += 1;
    window.update_task(current_task());
}
/**
 * Updates the task box underneath the timer
 * @function
 */
window.update_status = () => {
    document.getElementById("current-task").innerText =
        window.current_task() == null ? "Please add a task" :
            "Task Name: " + window.current_task().description +
            "\nDone: " + window.current_task().cycles_completed +
            " of " + window.current_task().pomo_estimation;
}

//// Themes
/**
 * Sets the css style for light mode
 * @function
 */
window.light_mode = () => {
    document.body.style.background = "radial-gradient(circle, rgba(246,245,245,1) 0%, rgba(43,215,215,1) 100%)";
    document.body.style.background = "rgb(156,152,214)";
    document.body.style.background = "radial-gradient(circle, rgba(156,152,214,1) 0%, rgba(17,85,85,1) 100%)";
    document.getElementById("early-prompt").style.color = "#0f373d";
    document.getElementById("timer-label").style.color = "#0f373d";
}

/**
 * Sets the css style for dark mode
 */
window.dark_mode = () => {
    document.body.style.background = "rgb(38,32,69)";
    document.body.style.background = "radial-gradient(circle, rgba(38,32,69,1) 0%, rgba(44,53,69,1) 45%, rgba(48,69,69,1) 100%)";
    document.getElementById("early-prompt").style.color = "#89d9e6";
    document.getElementById("timer-label").style.color = "#89d9e6";
}

//// Backend Sync
let url_current = window.location.href.split("/");
console.log(url_current);
window.userid = url_current[url_current.length - 1]
/**
 * Grabs the user data when user logs in
 * @function
 * @returns the user grabbed from postData()
 */
function request_user_data_and_start() {
    //// This Section fetches user data from the server and start state machine
    //// wait a while for the content to load
    return postData('/fetchuserdata', {
        "token": window.userid,
    })
        .then(data => {
            // data ready
            window.user_data = data; //data
        })
}

// This Section Imports Requires Components
// Settings Component
fetch("/html/components/settings.html")
    .then(stream => stream.text())
    .then(text => define_settings(text))
    .then(fetch("/html/components/timer-display.html")
        .then(stream => stream.text())
        .then(text => define_timer_display(text))
        .then(fetch("/html/components/control-button.html")
            .then(stream => stream.text())
            .then(text => define_control_button(text))
            .then(fetch("/html/components/modal.html")
                .then(stream => stream.text())
                .then(text => define_modal(text))
                .then(fetch("/html/components/task.html")
                    .then(stream => stream.text())
                    .then(text => define_task(text))
                    .then(fetch("/html/components/task-list.html")
                        .then(stream => stream.text())
                        .then(text => define_task_list(text))
                        .then(() => {
                            // set user data
                            if (window.userid == "") {
                                window.user_data = default_user_data;
                                // User logged in anonymously
                                if (localStorage.hasOwnProperty('user_data')) {
                                    window.user_data = JSON.parse(localStorage.getItem('user_data'));
                                }
                                document.getElementById('c-modal').display_alert(LOCAL_MSG);
                                force_state(window.statelet());
                            } else {
                                request_user_data_and_start().then(() => {
                                    // Initialize the timer state machine
                                    force_state(window.statelet());
                                });
                            }
                        }))))));


