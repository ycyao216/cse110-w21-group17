/** Messages to display to the user */

export function define_timer_display(html) {
    class CTimerDisplay extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            this.timer_display = this.shadowRoot.getElementById("timer-string");
            this.alarm_sound = this.shadowRoot.getElementById("alarm-sound");

            // bind
            this.trigger_countdown.bind(this);
            this.update_countdown.bind(this);
            this.reset_countdown.bind(this);
            this.is_countingdown.bind(this);
            this.ring.bind(this);
            this.stop_ring.bind(this);
        }

        /**
         * sets up the time interval for update_countdown() and the
         * callback function. Keeps track of the work cycle time.
         * @function
         * @param {Number} seconds - max time of the countdown
         * @param {function} callback_f - function to call once timer reaches 0
         * @returns callback_f
         */
        trigger_countdown(seconds, callback_f) {
            this.countdown = {
                'endTime': seconds,
                'timer': setInterval(() => this.update_countdown(), [1000]), // update display every second
                get callback_f() {
                    return callback_f
                }
            }

            // THE FIRST RUN
            // update timer
            let minutes = Math.floor(this.countdown.endTime / 60);
            let timer_seconds = this.countdown.endTime - (minutes * 60);

            if(minutes < 10)
                minutes = "0" + minutes;

            if(timer_seconds < 10)
                timer_seconds = "0" + timer_seconds;

            this.timer_display.innerHTML = minutes + ":" + timer_seconds;

            // decrement time
            this.countdown.endTime -= 1;
        }

        /**
         * Does the actual counting from the time set to 0.
         * Updates timer display.
         * At 0 calls the callback function to change states.
         * @function
         * @returns when timer hits 0
         */
        update_countdown() {
            // prevent late updates
            if (this.countdown == null) return;

            // stop the counter
            if (this.countdown.endTime < 0) {
                var callback_f = this.countdown.callback_f;
                this.reset_countdown();
                callback_f();
                return;
            }
            

            // update timer_display
            let minutes = Math.floor(this.countdown.endTime / 60);
            let seconds = this.countdown.endTime - (minutes * 60);

            if(minutes < 10)
                minutes = "0" + minutes;

            if(seconds < 10)
                seconds = "0" + seconds;

            this.timer_display.innerHTML = minutes + ":" + seconds;

            // decrement time
            this.countdown.endTime -= 1;
        }

        /**
         * If a countdown was set, clear its interval and
         * and set it to null. Also sets the counter to the last
         * work cycle time set.
         * @function
         */
        reset_countdown(seconds = null) {
            //reset to default value 


            if (this.countdown != null) {
                clearInterval(this.countdown.timer);
                this.countdown = null;
            }
            // update timer_display
            this.timer_display.innerHTML = "00:00";
        }

        is_countingdown() {
            return this.countdown != null;
        }

        /**
         * Sets the volume of the audio tag and plays it.
         * @function
         */
        ring() {
            this.alarm_sound.volume = 0.1;
            this.alarm_sound.play();
            console.log("The Timer is RINGING!");
        }

        /**
         * Stops the audio
         * @function
         */
        stop_ring() {
            this.alarm_sound.volume = 0;
        }
    }
    customElements.define('c-timer-display', CTimerDisplay);
    return CTimerDisplay;
}

// for testing
/*module.exports = {
    define_timer_display,
}*/