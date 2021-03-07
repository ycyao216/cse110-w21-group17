/** Messages to display to the user */

export function define_timer_display(html) {
    class CTimerDisplay extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            let document = this.shadowRoot;



            this.timer_display = this.shadowRoot.getElementById("timer-string");
            this.alarm_sound = this.shadowRoot.getElementById("alarm-sound");

            // bind
            this.trigger_countdown.bind(this);
            this.update_countdown.bind(this);
            this.reset_countdown.bind(this);
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




        /**
         * This is for the start button to dispatch the
         * start event and setup the state machine
         * @function
         */
        trigger_start() {
            //event
            let timer_started = new Event('timer_start');
            document.dispatchEvent(timer_started);

            transition(window.current_state, 'timer_during_countdown');

        }


        /**
         * Prompt user to trigger emergency stop or not.
         * if they want to stop, calls trigger_emergency_stop()
         * @function
         */
        trigger_emergency_stop_prompt() {
            // debug msg
            console.log('[timer_emergency_stop]')

            // show prompt, go back to defaults if confirmed, do nothing if not
            document.getElementById('c-modal').display_confirm(
                EMERG_STOP_WARNING,
                () => {
                    document.getElementById("timer-display").trigger_emergency_stop();
                    transition(window.current_state, 'timer_init');
                },
                () => { }
            )
        }

        /**
         * Resets the countdown and its interval, set the display to the last work cycle time set,
         * and reset number of pomos
         * @function
         */
        trigger_emergency_stop() {
            this.reset_countdown();
        }

        /**
         * If the prompt is not already showing, pop-up message and show finish early prompt
         * @function
         */
        trigger_finish_early() {
            document.getElementById('c-modal').display_alert(OVERSTUDY_MSG);
            document.getElementById('early-prompt').style.display = 'initial';
            current_task().pomo_estimation = current_task().cycles_completed + 1;
            update_task(current_task());
        }

        /**
         * If the user clicks, dispatches event for tasklist to listen to
         * to add 1 cycle to current task.
         * @function
         */
        trigger_add_cycle() {
            console.log("Cycle Added!");
            current_task().pomo_estimation += 1;
            update_task(current_task());
        }

        /**
         * Sets the volume of the audio tag and plays it.
         * @function
         */
        ring() {
            this.alarm_sound.volume = 0.1;
            //this.alarm_sound.play();
            console.log("The Timer is RINGING!");
        }

    }
    customElements.define('c-timer-display', CTimerDisplay);
    return CTimerDisplay;
}