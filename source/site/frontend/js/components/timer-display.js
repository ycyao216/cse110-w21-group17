/** Messages to display to the user */
const WORK_TIME = "00:10";
const SHORT_BREAK = "00:03";
const LONG_BREAK = "00:04";
const TIME_UP = "00:00";
const TIME_UP_SHORT_MSG = "Pomo is done! Now take a short break";
const TIME_UP_LONG_MSG = "You have done 4 pomos! Good job! Now take a long break!";
const TIME_UP_WORK_MSG = "Break is over! Now get back to the tasks!";
const EMERG_STOP_WARNING = "Are you sure? If you stop now, you will lose this sessions!"
const OVERSTUDY_MSG = "Great job! Don't start the next task yet, reflect on your current task!"


function define_timer_display(html) {
    class CTimerDisplay extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = html;

            let document = this.shadowRoot;

            function _class(name) {
                return document.querySelectorAll("." + name);
            }

            this.timer_display = this.shadowRoot.getElementById("timer-string");
        }

        trigger_countdown(seconds, callback_f) {
            this.countdown = {
                'timer': setInterval(() => this.update_countdown(), [seconds * 100]),
                'counter': seconds,
                get callback_f() {return callback_f}
            }
        }

        update_countdown() {
            // update counter
            this.countdown.counter--;

            // update timer_display
            this.timer_display.innerHTML = new Date(this.countdown.counter * 1000).toISOString().substr(14, 5)

            // stop the counter
            if (this.countdown.counter == 0) {
                clearInterval(this.countdown.timer);
                this.countdown.callback_f();
            }

        }

        trigger_emergency_stop(){
            

        }


    }
    customElements.define('c-timer-display', CTimerDisplay);
}





/**
 * Callback funciton for emergency stop button.
 */
function emerg_stop() {
    if (confirm(EMERG_STOP_WARNING) && running) {
        timer_display.innerHTML = WORK_TIME;
        running = false;
        at_break = false;
        // everySecond is a variable in the "package"
        clearInterval(everySecond);

        //reset cycles
        num_pomos = 0;

        //reset prompt
        document.getElementById("early-prompt").innerHTML = "";

        //reset label
        document.getElementById("timer-label").innerHTML = "Waiting";
    }
}

function over_study() {
    if (document.getElementById("early-prompt").innerHTML === "") {
        alert(OVERSTUDY_MSG);
        document.getElementById("early-prompt").innerHTML = "Reflect on your current task!"
    }
}

/**
 * A callback wrapper for coundownElement, called every second in startButton
 */
function countdownWrapper(timer_display) {
    countdownElement(timer_display);
    update_timer(timer_display);
}

/**
 * This funciton shows an alert when the timer stops naturally, and then reset 
 * the timer to the correct break/work cycle when "ok" is clicked.
 */
function update_timer(timer_display) {

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
                    alert(TIME_UP_LONG_MSG)
                }, 0);
                timer_display.innerHTML = LONG_BREAK;
                at_break = true;

                //change timer label to Long Break
                document.getElementById("timer-label").innerHTML = "Long Break";
            }
            else {
                timer_display.innerHTML = TIME_UP;
                setTimeout(function () {
                    alert(TIME_UP_SHORT_MSG)
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
            setTimeout(function () { alert(TIME_UP_WORK_MSG) }, 0);
            timer_display.innerHTML = WORK_TIME;
            at_break = false;

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
