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
            this.alarm_sound = this.shadowRoot.getElementById("alarm-sound");
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
                var callback_f = this.countdown.callback_f;
                this.clear_countdown();
                callback_f();
            }

        }

        clear_countdown(){
            if (this.countdown !== null){
                clearInterval(this.countdown.timer);
                this.countdown = null;
            }
        }

        trigger_emergency_stop(){
            this.clear_countdown();
            num_pomos = 0;
        }

        ring(){
            this.alarm_sound.volume = 0.2;
            console.log("The Timer is RINGING!");
        }


    }
    customElements.define('c-timer-display', CTimerDisplay);
}