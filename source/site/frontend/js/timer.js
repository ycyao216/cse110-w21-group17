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
    if(seconds === 0) {
        minutes = minutes - 1;
        seconds = 59;
    } if(minutes === 0) {
        minutes = 0;
        seconds = 0;   
    } else {
        seconds = seconds - 1;
    }

    // if seconds or minutes less than 10, add leading 0
    if(minutes < 10) {
        minutes = "0" + minutes.toString;
    }

    if(seconds < 10) {
        seconds = "0" + seconds.toString;
    }

    //set the innerHTML back
    text = minutes.toString + ":" + seconds.toString;

    if(text === "00:00" && everySecond != null) {
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
    if(type) {
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
    if(numOfPomo % 4 === 0) {
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
    this.style.display = "none";

    everySecond = setInterval(countdownElement(timerElement), [1000]);

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

// for testing
module.exports = {
    countdownElement,
    isLongBreak,
    altType
};

