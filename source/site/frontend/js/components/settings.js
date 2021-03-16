import { postData } from '../utils.js';
/**
 * Enacts the settings element constructor
 * @param {*} html - html component of the settings
 * @function
 */
export function define_settings(html) {
    /**
     * Attaches the setting's html to the shadow dom and initialzies it and its functions
     * @class
     */
    class CSettings extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            let self = this;
            function _class(name) {
                return self.shadowRoot.querySelectorAll("." + name);
            }

            let tabPanes = _class("tab-header")[0].getElementsByTagName("div");
            // Hide the help message initially for not blocking mode buttons
            _class('tab-content')[0].querySelector("#instructions").style.display = 'none';

            // for switching tabs
            for (let i = 0; i < tabPanes.length; i++) {
                tabPanes[i].addEventListener("click", function () {

                    _class("tab-header")[0].getElementsByClassName("active")[0].classList.remove("active");
                    tabPanes[i].classList.add("active");

                    _class("tab-indicator")[0].style.top = `calc(80px + ${i * 50}px)`;

                    _class("tab-content")[0].getElementsByClassName("active")[0].classList.remove("active");
                    _class("tab-content")[0].getElementsByClassName("tabcontent")[i].classList.add("active");
                    // Toggle the display of help message
                    if (_class('tabcontent.active')[0].querySelector('#instructions') !== null) {
                        _class("tab-content")[0].querySelector("#instructions").style.display = "block";
                    }
                    else {
                        _class("tab-content")[0].querySelector("#instructions").style.display = "none";
                    }

                    window.update_settings();
                });
            }

            // Tutorial Tab
            var conv = new showdown.Converter();
            fetch("/md/instructions.md")
                .then(stream => stream.text())
                .then(text => {
                    this.shadowRoot.getElementById('instructions').innerHTML = conv.makeHtml(text);
                });


            // light/dark mode buttons

            this.light_mode_button = this.shadowRoot.getElementById("light-mode-button");
            /**
             * Turns on light mode when clicking light mode button
             * @event - click light mode
             */
            this.light_mode_button.addEventListener("click", function () {
                window.light_mode();
            })

            this.dark_mode_button = this.shadowRoot.getElementById("dark-mode-button");
            /**
             * Turns on dark mode when clicking dark mode button
             * @event - click dark mode
             */
            this.dark_mode_button.addEventListener("click", function () {
                window.dark_mode();
            })

            // allow_emergency_stop
            this.allow_emergency_stop = this.shadowRoot.getElementById("allow-emergency-stop");
            /**
             * Toggles whether emergency stop is enabled or not when user changes toggle button
             * @event - toggle emergency stop button
             */
            this.allow_emergency_stop.addEventListener("change", function () {
                window.user_data.settings.allow_emergency_stop = this.checked;
                window.update_settings();
            });

            /**
             * Show people currently online
             */
            // people_online
            this.people_online = this.shadowRoot.getElementById("people-online");

            /**
             * Show analysis of the user history
             */
            // analysis
            this.analysis = this.shadowRoot.getElementById("analysis");

            /**
             * Deletes all user data
             */
            // delete_data
            this.delete_data = this.shadowRoot.getElementById("delete-data");
            this.delete_data.addEventListener("click", function () {
                document.getElementById('c-modal').display_confirm("YOU WILL LOSE EVERYTHING!!",
                    () => {
                        window.delete_user_data();
                        window.location.reload(); 
                    },
                    () => { }
                )
            });


            /**
             * Validates the values user typed in for work/break durations. Upholds work > long > short.
             * @function
             * @returns boolean matching whether or not inputs are valid
             */
            function validate_durations() {
                if (parseFloat(self.short_break_min.value) < parseFloat(self.long_break_min.value) &&
                    parseFloat(self.long_break_min.value) < parseFloat(self.working_min.value)) {
                    return true;
                }
                return false;
            }


            // work-session duration
            this.working_min = this.shadowRoot.getElementById("working-min");
            /**
             * Updates and checks for valid working duration value inputed when user changes it
             * @event - Change input for working duration
             */
            this.working_min.addEventListener("change", function () {
                if (validate_durations()) {
                    window.user_data.settings.working_sec = this.value * 60;
                } else {
                    document.getElementById('c-modal').display_alert("FAILED: short break < long break < working time");
                }
                window.update_settings();
            });

            // short-break duration
            this.short_break_min = this.shadowRoot.getElementById("short-break-min");
            /**
             * Updates and checks for valid short break duration value inputed when user changes it
             * @event - Change input for short break duration
             */
            this.short_break_min.addEventListener("change", function () {
                if (validate_durations()) {
                    window.user_data.settings.short_break_sec = this.value * 60;
                } else {
                    document.getElementById('c-modal').display_alert("FAILED: short break < long break < working time");
                }
                window.update_settings();
            });

            // long-break duration
            this.long_break_min = this.shadowRoot.getElementById("long-break-min");
            /**
             * Updates and checks for long break duration value inputed when user changes it
             * @event - Change input for long break duration
             */
            this.long_break_min.addEventListener("change", function () {
                if (validate_durations()) {
                    window.user_data.settings.long_break_sec = this.value * 60;
                } else {
                    document.getElementById('c-modal').display_alert("FAILED: short break < long break < working time");
                }
                window.update_settings();
            });



            // bind
            this.refresh.bind(this);
            this.switch_tab.bind(this);
        }

        /**
         * Refreshes all the values in the timer from the settings menu
         * @function
         */
        refresh() {
            this.allow_emergency_stop.checked = window.user_data.settings.allow_emergency_stop;
            this.working_min.value = window.user_data.settings.working_sec / 60;
            this.short_break_min.value = window.user_data.settings.short_break_sec / 60;
            this.long_break_min.value = window.user_data.settings.long_break_sec / 60;
            this.analysis.innerText = `\n${window.analysis()}\n`
            postData('/online', {
                "token": window.userid,
            }).then(data => {
                this.people_online.innerText = "\nCurrently Online:\n" + data.map((x) => `${x.id} @${x.state}`).join('\n');
            })
        }

        /**
         * Switches the tab of the settings menu to passed index
         * @param {*} tab_index - tab to change to
         * @function
         */
        switch_tab(tab_index) {
            let _class = (name) => this.shadowRoot.querySelectorAll("." + name);
            let tabPanes = _class("tab-header")[0].getElementsByTagName("div");
            tabPanes[tab_index].click();
        }
    }

    customElements.define('c-settings', CSettings);
    return CSettings;
}