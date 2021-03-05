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

        trigger_countdown(seconds, callback_f) {
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

        update_countdown() {
            let remaining_ms = this.countdown.endTime - Date.now();

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

        reset_countdown() {
            //reset to default value 
            // TODO: Take default value from settings

            if (this.countdown !== null) {
                clearInterval(this.countdown.timer);
                let counter = 10;

                // update timer_display
                this.timer_display.innerHTML = new Date(counter * 1000).toISOString().substr(14, 5)

                this.countdown = null;
            }
        }

        trigger_emergency_stop() {
            this.reset_countdown();
            num_pomos = 0;
        }

        ring() {
            this.alarm_sound.volume = 0.2;
            console.log("The Timer is RINGING!");
        }

        incr_pomo() {
            num_pomos++;
        }

        isLongBreak() {
            return ((num_pomos % 4) == 0)
        }


    }
    customElements.define('c-timer-display', CTimerDisplay);
    return CTimerDisplay;
}