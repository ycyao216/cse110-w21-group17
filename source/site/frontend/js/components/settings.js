import { define_incdecinput } from './incdecinput.js';

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

            // for switching tabs
            for (let i = 0; i < tabPanes.length; i++) {
                tabPanes[i].addEventListener("click", function() {

                    _class("tab-header")[0].getElementsByClassName("active")[0].classList.remove("active");
                    tabPanes[i].classList.add("active");

                    _class("tab-indicator")[0].style.top = `calc(80px + ${i * 50}px)`;

                    _class("tab-content")[0].getElementsByClassName("active")[0].classList.remove("active");
                    _class("tab-content")[0].getElementsByClassName("tabcontent")[i].classList.add("active");

                });
            }

            // for incdecinput control
            define_incdecinput(this.shadowRoot);


            // allow_emergency_stop
            this.allow_emergency_stop = this.shadowRoot.getElementById("allow-emergency-stop");
            this.allow_emergency_stop.checked = window.user_data.settings.allow_emergency_stop;
            this.allow_emergency_stop.addEventListener("change", function() {
                window.user_data.settings.allow_emergency_stop = this.checked;
            });

            // work-session duration
            this.working_min = this.shadowRoot.getElementById("working-min");
            this.working_min.value = window.user_data.settings.short_break_sec/60;
            this.working_min.addEventListener("change", function() {
                let working_sec = this.value * 60;
                window.user_data.settings.working_sec = working_sec;
                console.log(window.user_data.settings.working_sec);
            });
            
            // short-break duration
            this.short_break_min = this.shadowRoot.getElementById("short-break-min");
            this.short_break_min.value = window.user_data.settings.short_break_sec/60;
            this.short_break_min.addEventListener("change", function() {
                let short_break_sec = this.value * 60;
                if(short_break_sec > window.user_data.settings.long_break_sec){
                    this.value = window.user_data.settings.short_break_sec/60;
                    document.getElementById('c-modal').display_alert("FAILED: short break longer than long break");
                    return
                }
                window.user_data.settings.short_break_sec = short_break_sec;
                console.log(window.user_data.settings.short_break_sec);
            });

            // long-break duration
            this.long_break_min = this.shadowRoot.getElementById("long-break-min");
            this.long_break_min.value = window.user_data.settings.long_break_sec/60;
            this.long_break_min.addEventListener("change", function() {
                let long_break_sec = this.value * 60;
                if(long_break_sec < window.user_data.settings.short_break_sec){
                    this.value = window.user_data.settings.long_break_sec/60;
                    document.getElementById('c-modal').display_alert("FAILED: long break shorter than short break");
                    return
                }
                console.log(window.user_data.settings.long_break_sec);
                window.user_data.settings.long_break_sec = long_break_sec;
                console.log(window.user_data.settings.long_break_sec);
            });

        }

    }
    customElements.define('c-settings', CSettings);
    return CSettings;
}