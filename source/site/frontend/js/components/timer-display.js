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
                'endTime': Date.now() + seconds * 1000,
                'timer': setInterval(() => this.update_countdown(), [200]), // update display every 500ms
                get callback_f() {
                    return callback_f
                }
            }
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
            
            // add 1,000 to start at desired time instead of 1 under
            let remaining_ms = this.countdown.endTime - Date.now() + 1000;

            // stop the counter
            if (remaining_ms < 0) {
                var callback_f = this.countdown.callback_f;
                this.reset_countdown();
                callback_f();
                return;
            }

            // update timer_display
            this.timer_display.innerHTML = new Date(Math.ceil(remaining_ms)).toISOString().substr(14, 5)
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
            this.timer_display.innerHTML = new Date(Math.ceil(seconds == null ? 10 : seconds)).toISOString().substr(14, 5)
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