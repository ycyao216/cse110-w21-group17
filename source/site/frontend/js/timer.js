/*
* function countdown(HTMLElement)
*
* param: timerElement - the HTML element that representsd the timer
* Use: This function takes in the html element for the timer, grabs the number from it,
* decrements it by 1, and changes the innerHTML of the element.
*/
function countdown(timerElement) {

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

    timerElement.innerHTML = text;

    // for testing purposes
    return text;
}

// for testing
module.exports = {
    countdown
};

