export function define_settings(html) {
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
                    if (_class('tabcontent.active')[0].querySelector('#instructions') !== null){
                        _class("tab-content")[0].querySelector("#instructions").style.display = "block";
                    }
                    else {
                        _class("tab-content")[0].querySelector("#instructions").style.display = "none";
                    }
                });
            }

            // Tutorial Tab
            var conv = new showdown.Converter();
            fetch("/md/instructions.md")
                .then(stream => stream.text())
                .then(text => {
                    console.log(text);
                    this.shadowRoot.getElementById('instructions').innerHTML = conv.makeHtml(text);
                });


            // light/dark mode buttons

            this.light_mode_button = this.shadowRoot.getElementById("light-mode-button");
            this.light_mode_button.addEventListener("click", function () {
                window.light_mode();
            })

            this.dark_mode_button = this.shadowRoot.getElementById("dark-mode-button");
            this.dark_mode_button.addEventListener("click", function () {
                window.dark_mode();
            })

            // allow_emergency_stop
            this.allow_emergency_stop = this.shadowRoot.getElementById("allow-emergency-stop");
            this.allow_emergency_stop.addEventListener("change", function () {
                window.user_data.settings.allow_emergency_stop = this.checked;
                window.update_settings();
            });




            function validate_durations() {
                if (parseFloat(self.short_break_min.value) < parseFloat(self.long_break_min.value) &&
                parseFloat(self.long_break_min.value) < parseFloat(self.working_min.value)) {
                    return true;
                }
                return false;
            }


            // work-session duration
            this.working_min = this.shadowRoot.getElementById("working-min");
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

        refresh() {
            this.allow_emergency_stop.checked = window.user_data.settings.allow_emergency_stop;
            this.working_min.value = window.user_data.settings.working_sec / 60;
            this.short_break_min.value = window.user_data.settings.short_break_sec / 60;
            this.long_break_min.value = window.user_data.settings.long_break_sec / 60;
        }

        switch_tab(tab_index) {
            let _class = (name) => this.shadowRoot.querySelectorAll("." + name);
            let tabPanes = _class("tab-header")[0].getElementsByTagName("div");
            tabPanes[tab_index].click();
        }
    }

    customElements.define('c-settings', CSettings);
    return CSettings;
}