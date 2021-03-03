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

            function _class(name) {
                return document.querySelectorAll("." + name);
            }

            this.timer_display = this.shadowRoot.getElementById("timer-string");
            this.alarm_sound = this.shadowRoot.getElementById("alarm-sound");
        }

        /* 
         * trigger_countdown(seconds, callback_f)
         * seconds - max time of the countdown
         * callback_f - function to call once timer reaches 0
         * use - sets up the time interval for update_countdown() and the
         * callback function. Keeps track of the work cycle time.
         */
        trigger_countdown(seconds, callback_f) {
            // save last time for resetting
            // Work seconds should be the max possible time
            // TODO: When setting up settings, make Work > Long Break > Short Break
            if(seconds > last_time_set)
                last_time_set = seconds;

            if (callback_f !== null) {
                this.countdown = {
                    'endTime': Date.now() + seconds * 1000,
                    'timer': setInterval(() => this.update_countdown(), [200]), // update display every 500ms
                    get callback_f() {
                        return callback_f
                    }
                }
            } else {
                this.countdown = {
                    'endTime': Date.now() + seconds * 100,
                    'timer': this.reset_countdown(),
                    get callback_f() {
                        return callback_f
                    }
                }
            }
        }

        /*
         * update_countdown()
         * use - Does the actual counting from the time set to 0.
         * Updates timer display.
         * At 0 calls the callback function to change states.
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

        /*
         * reset_countdown()
         * use - If a countdown was set, clear its interval and
         * and set it to null. Also sets the counter to the last
         * work cycle time set.
         */
        reset_countdown() {
            //reset to default value 
            // TODO: Take default value from settings

            if (this.countdown !== null) {
                clearInterval(this.countdown.timer);
                let counter = last_time_set;

                this.countdown = null;
            }
        }
        
        /*
         * trigger_start()
         * use - This is for the start button to dispatch the
         * start event and setup the state machine
         */
        trigger_start() {
            //event
            let timer_started = new Event('timer_start');
            document.dispatchEvent(timer_started);

            state_transition('timer_during_countdown');

        }

        /*
         * trigger_continue_prompt()
         * use - This is for the end of a cycle to prompt the user
         * if they want to continue because they have no more cycles scheduled 
         */
        trigger_continue_prompt() {
            //prompt
            document.getElementById('c-modal').display_confirm(
                "You have no tasks left! Click confirm to continue cycles/Cancel to stop.",
                () => {
                    state_transition('timer_during_countdown');
                },
                () => {
                    state_transition('timer_init');
                    this.reset_countdown();

                    // update timer_display
                    this.timer_display.innerHTML = new Date(last_time_set * 1000).toISOString().substr(14, 5);
                });
        }
        
        /*
         * trigger_emergency_stop_prompt()
         * use - prompt user to trigger emergency stop or not.
         * if they want to stop, calls trigger_emergency_stop()
         */
        trigger_emergency_stop_prompt() {
            // debug msg
            console.log('[timer_emergency_stop]')

            // show prompt, go back to defaults if confirmed, do nothing if not
            document.getElementById('c-modal').display_confirm(
                EMERG_STOP_WARNING,
                () => {
                    document.getElementById("timer-display").trigger_emergency_stop();
                    state_transition('timer_init');
                },
                () => {}
            )
        }
        
        /*
         * trigger_emergency_stop()
         * use - resets the countdown and its interval, set the display to the last work cycle time set,
         * and reset number of pomos
         */
        trigger_emergency_stop() {
            this.reset_countdown();

            // update timer_display
            this.timer_display.innerHTML = new Date(last_time_set * 1000).toISOString().substr(14, 5);

            num_pomos = 0;
        }

        /*
         * trigger_finish_early()
         * use - if the prompt is not already showing, pop-up message and show finish early prompt
         */
        trigger_finish_early() {
            if(document.getElementById('early-prompt').style.display === 'none') {
                document.getElementById('c-modal').display_alert(OVERSTUDY_MSG);
                document.getElementById('early-prompt').style.display = 'initial';
            }
        }

        /*
         * ring()
         * use - sets the volume of the audio tag and plays it.
         */
        ring() {
            this.alarm_sound.volume = 0.1;
            //this.alarm_sound.play();
            console.log("The Timer is RINGING!");
        }

        /*
         * incr_pomo()
         * use - for at the start of a work cycle countdown, increments number of pomos
         */
        incr_pomo() {
            num_pomos++;
        }
        
        /* 
         * isLongBreak()
         * use - return true if this is the 4th break since a Long Break
         *       false otherwise
         */
        isLongBreak() {
            return ((num_pomos % 4) == 0);
        }


    }

    // testing events
    document.addEventListener('timer_start', function (e) {
        console.log('timer event started!');
    });

    document.addEventListener('timer_short_break', function (e) {
        console.log('timer short break started!');
    });

    document.addEventListener('timer_long_break', function (e) {
        console.log('timer long break started!');
    });

    document.addEventListener('timer_cycle_complete', function (e) {
        console.log('timer cycle completed!');
    });

    customElements.define('c-timer-display', CTimerDisplay);
    return CTimerDisplay;
}