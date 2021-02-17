// add action handlers to the three buttons

/** The HTML elements, see timer_index.html */
let start_button = document.getElementById("start-button");
let timer_display = document.getElementById("timer-string");
let emerg_button = document.getElementById("emergency-stop-button");
let overstudy_button = document.getElementById("overstudy-button");

// The number of pomo cycles. used for long break
let num_pomos = 1;
// Whether is at break time
let at_break = false;
// Whether the timer is running
let running = false;


/** Messages to display to the user */
const WORK_TIME = "00:03";
const SHORT_BREAK = "00:03";
const LONG_BREAK = "00:04";
const TIME_UP = "00:00";
const TIME_UP_SHORT_MSG = "Pomo is done! Now take a short break";
const TIME_UP_LONG_MSG = "You have done 4 pomos! Good job! Now take a long break!";
const TIME_UP_WORK_MSG = "Break is over! Now get back to the tasks!";
const EMERG_STOP_WARNING = "Are you sure? If you stop now, you will lose this sessions!"
const OVERSTUDY_MSG = "Great job! Don't start the next task yet, reflect on your current task!"

start_button.addEventListener('click', startButton);
emerg_button.addEventListener('click', emerg_stop);
overstudy_button.addEventListener('click', over_study);
toggle_buttons();

/**
 * A helper function to hide/display stop buttons accordingly
 */
function toggle_buttons() {
    // only hide when timer is running, or at break
    if (!running || at_break) {
        emerg_button.style.display = "none";
        overstudy_button.style.display = "none";
    }
    else {
        emerg_button.style.display = "initial";
        overstudy_button.style.display = "initial";
    }
}

/**
 * Callback funciton for emergency stop button.
 */
function emerg_stop() {
    if (confirm(EMERG_STOP_WARNING)) {
        timer_display.innerHTML = WORK_TIME;
        running = false;
        at_break = false;
        // everySecond is a variable in the "package"
        clearInterval(everySecond);
    }
}

function over_study() {
    //TODO: add label to task
    alert(OVERSTUDY_MSG);
}

/**
 * A callback wrapper for coundownElement, called every second in startButton
 */
function countdownWrapper() {
    countdownElement(timer_display);
    update_timer();
    toggle_buttons();
}

/**
 * This funciton shows an alert when the timer stops naturally, and then reset 
 * the timer to the correct break/work cycle when "ok" is clicked.
 */
function update_timer() {
    if (timer_display.innerHTML === TIME_UP) {
        running = false;
        if (!at_break) {
            num_pomos += 1;
            if (isLongBreak(num_pomos)) {
                timer_display.innerHTML = TIME_UP;
                // This delay is to make sure alert pause the process only after 
                // HTML element updates. Oterwise timer pauses at 00:01;
                // NOTE: not tested.
                setTimeout(function () {
                    alert(TIME_UP_LONG_MSG)
                }, 0);
                timer_display.innerHTML = LONG_BREAK;
                at_break = true;
            }
            else {
                timer_display.innerHTML = TIME_UP;
                setTimeout(function () {
                    alert(TIME_UP_SHORT_MSG)
                }, 0);
                timer_display.innerHTML = SHORT_BREAK;
                at_break = true;
            }
            num_pomos = 0;
            // Automatically start the break timer.
            setTimeout(startButton, 1);
        }
        else {
            timer_display.innerHTML = TIME_UP;
            setTimeout(function () { alert(TIME_UP_WORK_MSG) }, 0);
            timer_display.innerHTML = WORK_TIME;
            at_break = false;
            // Timer is not automatically started before work.
        }
    }
    else {
        // update the running status for toggle_buttons to work.
        running = true;
    }
}

/** Direct copied from timer.js to temporarily avoid import troubles */
//TODO: allow import from modules.

// Written by: Liam O'Brien
// interval for countdown
var everySecond;

/*
* function countdown(HTMLElement)
*
* param: timerElement - the HTML element that representsd the timer
* Use: This function takes in the html element for the timer, grabs the number from it,
* decrements it by 1, and changes the innerHTML of the element.
*/



function countdownElement(timerElement) {

    // should be something like 25:00
    let text = timerElement.innerHTML;
    // grab the 25
    let minutes = parseInt(text.substring(0, 2));
    // grab the 00
    let seconds = parseInt(text.substring(3, 5));
    // if 25:00, decrement minutes and get 24:59
    if (seconds === 0 && minutes === 0) {
        minutes = 0;
        seconds = 0;
    } else if (seconds === 0) {
        minutes = minutes - 1;
        seconds = 59;
    } else {
        seconds = seconds - 1;
    }

    // if seconds or minutes less than 10, add leading 0
    if (minutes < 10) {
        minutes = "0" + minutes.toString();
    }

    if (seconds < 10) {
        seconds = "0" + seconds.toString();
    }

    //set the innerHTML back
    text = minutes.toString() + ":" + seconds.toString();

    if (text === "00:00" && everySecond != null) {
        clearInterval(everySecond);
    }

    timerElement.innerHTML = text;

    // for testing purposes
    return text;
}

/* 
 * function altType(Number)
 *
 * param: type - a number (0 or 1) representing whether timer is on break or not
 * 0 = pomodoro
 * 1 = break
 */
function altType(type) {
    if (type) {
        type = 0;
    } else {
        type = 1;
    }
    return type;
}

/*
 * function isLongBreak(Number)
 * 
 * param: numOfPomo - the number of pomodoros since pressing start
 * every 4 pomos returns true for long break
 */
function isLongBreak(numOfPomo) {
    if (numOfPomo % 4 === 0) {
        return true;
    } else {
        return false;
    }
}

/*
 * function startButton ()
 * 
 * param: HTMLElement of timer to pass to countdown
 * function to begin the countdown for the timer, should return when
 * timer reaches 0. resetting of timer and breaks handled in driver.
 */
function startButton(timerElement) {
    // this.style.display = "none";

    everySecond = setInterval(countdownWrapper, [1000]);

}

/*
 * function stopEarlyButton()
 * 
 * param: HTMLelement of prompt to unhide (display style should be "none")
 * function to bring up the prompts when user finishes early. timer keeps going
 */
function stopEarlyButton(earlyPrompt) {
    earlyPrompt.style.display = "block";
}

/*
 * function emergStopButton()
 *
 * param: HTMLElement of timer to set to 00:00
 * function to instantly stop timer. should keep old # of cycles.
 */
function emergStopButton(timerElement) {
    timerElement.innerHTML = "00:00";
}
