// TODO Ready For Testing
function define_control_button(html) {
    class CControlButton extends HTMLElement {
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

            // Use value in the custom tag to be the display text in the button
            document.getElementById('button').innerText = this.textContent
        }
    }
    customElements.define('c-control-button', CControlButton);
}