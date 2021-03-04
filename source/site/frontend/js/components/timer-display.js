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
            window.addEventListener(window.NO_RUNNING_EVENT, (_) => {this.trigger_continue_prompt()})
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

        reset_timer_when_done(){
            console.log('timer cycle completed!');
        
            // update timer_display
            this.timer_display.innerHTML = new Date(last_time_set * 1000).toISOString().substr(14, 5);
    
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
        reset_countdown() {
            //reset to default value 
            // TODO: Take default value from settings

            if (this.countdown !== null) {
                clearInterval(this.countdown.timer);
                let counter = last_time_set;

                this.countdown = null;
            }
        }
        
        /**
         * This is for the start button to dispatch the
         * start event and setup the state machine
         * @function
         */
        trigger_start() {
            //event
            if (window.task_list.current === null){
                window.dispatchEvent(window.FIRST_TIME_START);
            }
            state_transition('timer_during_countdown');
        }

        /**
         * This is for the end of a cycle to prompt the user
         * if they want to continue because they have no more cycles scheduled 
         * @function
         */
        trigger_continue_prompt() {
            //prompt
            // document.getElementById('c-modal').display_confirm(
            //     "You have no tasks left! Click confirm to continue cycles/Cancel to stop.",
            //     () => {
            //         state_transition('timer_during_countdown');
            //     },
            //     () => {
            //         state_transition('timer_init');
            //         this.reset_countdown();

            //         // update timer_display
            //         this.timer_display.innerHTML = new Date(last_time_set * 1000).toISOString().substr(14, 5);
            // this.reset_countdown();

            // // update timer_display
            // this.timer_display.innerHTML = new Date(last_time_set * 1000).toISOString().substr(14, 5);
            // //     });
            // state_transition('timer_init');


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
                    state_transition('timer_init');
                },
                () => {}
            )
        }
        
        /**
         * Resets the countdown and its interval, set the display to the last work cycle time set,
         * and reset number of pomos
         * @function
         */
        trigger_emergency_stop() {
            this.reset_countdown();

            // update timer_display
            this.timer_display.innerHTML = new Date(last_time_set * 1000).toISOString().substr(14, 5);

            num_pomos = 0;
        }

        /**
         * If the prompt is not already showing, pop-up message and show finish early prompt
         * @function
         */
        trigger_finish_early() {
            if(document.getElementById('early-prompt').style.display === 'none') {
                document.getElementById('c-modal').display_alert(OVERSTUDY_MSG);
                document.getElementById('early-prompt').style.display = 'initial';
                window.dispatchEvent(window.FINISH_EARLY)
            }

            //event
            let task_complete = new Event('task_complete');
            document.dispatchEvent(task_complete);
        }

        /**
         * If the user clicks, dispatches event for tasklist to listen to
         * to add 1 cycle to current task.
         * @function
         */
        trigger_add_cycle() {
            document.dispatchEvent(window.TIMER_ADD_CYCLE);
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

        /**
         * For at the start of a work cycle countdown, increments number of pomos
         * @function
         */
        incr_pomo() {
            num_pomos++;
        }
        
        /**
         * Return true if this is the 4th break since a Long Break
         * false otherwise
         * @function
         * @returns true if evenly divisible by 4, false otherwise
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

    window.addEventListener('timer_cycle_complete', function (e) {
        this.reset_timer_when_done();
        // update example task
        // document.getElementById('current-task').innerHTML = window.task_list.current_task.stringify();
    });

    document.addEventListener('task_complete', function (e) {
        console.log('Task complete!');

        // update example task
        // document.getElementById('current-task').innerHTML = window.task_list.current_task.stringify();
    });

    // TODO: event for when user edits running task
    /*document.addEventListener('edited_running'), function (e) {
        console.log('Running Task Edited');

        // update example task
        // document.getElementById('current-task').innerHTML = window.task_list.current_task.stringify();
    }*/

    customElements.define('c-timer-display', CTimerDisplay);
    return CTimerDisplay;
}