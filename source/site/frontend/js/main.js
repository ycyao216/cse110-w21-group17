// add action handlers to the three buttons

/** The HTML elements, see timer_index.html */
let start_button = document.getElementById("start-button");
let timer_display = document.getElementById("timer-string");
let emerg_button = document.getElementById("emergency-stop-button");
let overstudy_button = document.getElementById("overstudy-button");

// The modal elements
let modal = document.getElementById("modal-popup");
let modal_close_btn = document.getElementsByClassName("close")[0];
let modal_text = document.getElementById("modal-text");
let confirm_button = document.getElementById("confirm-button");
let cancel_button = document.getElementById("cancel-button");


// The number of pomo cycles. used for long break
let num_pomos = 0;
// Whether is at break time
let at_break = false;
// Whether the timer is running
let running = false;


/** Messages to display to the user */
const WORK_TIME = "00:10";
const SHORT_BREAK = "00:03";
const LONG_BREAK = "00:04";
const TIME_UP = "00:00";
const TIME_UP_SHORT_MSG = "Pomo is done! Now take a short break";
const TIME_UP_LONG_MSG = "You have done 4 pomos! Good job! Now take a long break!";
const TIME_UP_WORK_MSG = "Break is over! Now get back to the tasks!";
const EMERG_STOP_WARNING = "Are you sure? If you stop now, you will lose this session!"
const OVERSTUDY_MSG = "Great job! Don't start the next task yet, reflect on your current task!"

start_button.addEventListener('click', startButton);
emerg_button.addEventListener('click', display_emerg_stop);
confirm_button.addEventListener('click', emerg_stop);
overstudy_button.addEventListener('click', over_study);
// When 'X' is pressed, close modal
modal_close_btn.addEventListener('click', close_modal);
// When cancel is pressed, continue and close modal
cancel_button.addEventListener('click', close_modal);
// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(e) {
    if (e.target == modal) {
        close_modal();
    }
})

//init buttons
emerg_button.style.display = "none";
overstudy_button.style.display = "none";
confirm_button.style.display = "none";
cancel_button.style.display = "none";

/**
 * Function to hide away modal
 */
function close_modal() {
    modal.style.display = "none";
    confirm_button.style.display = "none";
    cancel_button.style.display = "none";
}

/**
 * Callback function to display modal for emergency stop button.
 */
function display_emerg_stop() {
    modal.style.display = "block";
    modal_text.innerHTML = EMERG_STOP_WARNING;
    confirm_button.style.display = "block";
    cancel_button.style.display = "block";
}

/**
 * Callback function for emergency stop button.
 */
function emerg_stop() {

    if (running) {
        timer_display.innerHTML = WORK_TIME;
        running = false;
        at_break = false;
        // everySecond is a variable in the "package"
        clearInterval(everySecond);
        
        //reset cycles
        num_pomos = 0;

        //buttons
        start_button.style.display = "initial";

        emerg_button.style.display = "none";
        overstudy_button.style.display = "none";

        //reset prompt
        document.getElementById("early-prompt").innerHTML = "";

        //reset label
        document.getElementById("timer-label").innerHTML = "Waiting";
    }

    modal.style.display = "none";
    confirm_button.style.display = "none";
    cancel_button.style.display = "none";
}

function over_study() {
    if(document.getElementById("early-prompt").innerHTML === "") {
        modal.style.display = "block";
        modal_text.innerHTML = OVERSTUDY_MSG;
        document.getElementById("early-prompt").innerHTML = "Reflect on your current task!"
    }
}

/**
 * A callback wrapper for coundownElement, called every second in startButton
 */
function countdownWrapper() {
    countdownElement(timer_display);
    update_timer();
}

/**
 * This funciton shows an alert when the timer stops naturally, and then reset 
 * the timer to the correct break/work cycle when "ok" is clicked.
 */
function update_timer() {

    //TODO: Add audio playing at end of break/work cycle
    if (timer_display.innerHTML === TIME_UP) {
        running = false;
        if (!at_break) {
            //increment
            num_pomos += 1;
            
            if (isLongBreak(num_pomos)) {
                timer_display.innerHTML = TIME_UP;
                // This delay is to make sure alert pause the process only after 
                // HTML element updates. Oterwise timer pauses at 00:01;
                // NOTE: not tested.
                setTimeout(function () {
                    modal.style.display = "block";
                    modal_text.innerHTML = TIME_UP_LONG_MSG;
                }, 0);
                timer_display.innerHTML = LONG_BREAK;
                at_break = true;

                //change timer label to Long Break
                document.getElementById("timer-label").innerHTML = "Long Break";
            }
            else {
                timer_display.innerHTML = TIME_UP;
                setTimeout(function () {
                    modal.style.display = "block";
                    modal_text.innerHTML = TIME_UP_SHORT_MSG;
                }, 0);
                timer_display.innerHTML = SHORT_BREAK;
                at_break = true;

                //change timer label to Short Break
                document.getElementById("timer-label").innerHTML = "Short Break";
            }

            // Automatically start the break timer.
            setTimeout(startButton, 1);
        }
        else {
            timer_display.innerHTML = TIME_UP;
            setTimeout(function () { 
                modal.style.display = "block";
                modal_text.innerHTML = TIME_UP_WORK_MSG;
            }, 0);
            timer_display.innerHTML = WORK_TIME;
            at_break = false;
            // Timer is not automatically started before work.
            start_button.style.display = "initial";
            emerg_button.style.display = "none";
            overstudy_button.style.display = "none";

            //reset label
            document.getElementById("timer-label").innerHTML = "Waiting";

            //reset early label
            document.getElementById("early-prompt").innerHTML = "";
        }
    }
    else {
        // update the running status for toggle_buttons to work.
        running = true;
    }
}

/** Direct copied from timer.js to temporarily avoid import troubles */
// Turns out it's better to have all your js in one file so it is loaded at the same time

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
    // hide button
    start_button.style.display = "none";

    emerg_button.style.display = "initial";
    overstudy_button.style.display = "initial";

    // set timer label
    if(!at_break) {
        document.getElementById("timer-label").innerHTML = "Work";
    }

    everySecond = setInterval(countdownWrapper, [1000]);

}

// for testing
/*module.exports = {
    countdownElement,
    isLongBreak
};*/
