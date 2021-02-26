function define_settings(html) {
    class CSettings extends HTMLElement {
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
            define_incdecinput(document);

        }
    }
    customElements.define('c-settings', CSettings);
}